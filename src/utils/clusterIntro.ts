/**
 * clusterIntro —— 3D 碎片球开场转场
 *
 *  - WebGPU 渲染器 + TSL 节点材质
 *  - IcosahedronGeometry(1,1) 拆解为 80 个外扩三棱柱面（BatchedMesh）
 *  - 黑白液态玻璃着色（菲涅尔边缘光 + 高光带）+ 悬停蓝粉渐变 + 自旋 + 扩散
 *  - 深度 Sobel 描边 + Bayer 抖动后处理
 *
 * 在参考实现之上新增的「点击 → 拼合成球 → 平铺马赛克」转场：
 *  - 点击球体（射线拾取隐形内球）触发
 *  - assembleGain 把噪声缩放收敛到 1 → 八十个碎面严丝合缝拼成完整球
 *  - 每个面的几何通过 a_base 属性塌缩为「标准半正方形三角」，再由实例矩阵
 *    插值到铺满视口的网格（40 格 × 2 = 80 菱形），形成盖满屏幕的彩色马赛克
 *  - onReveal 回调 → 宿主挂载内容，随后整层淡出露出网站
 *
 * 本模块含 three/webgpu，体积较大，由 ClusterIntro.vue 动态 import（App.vue 在
 * 加载完成时预热），避免拖慢首屏 window load。
 */
import * as THREE from 'three/webgpu'
import {
  pass,
  Fn,
  attribute,
  positionLocal,
  float,
  mx_noise_float,
  time,
  vec3,
  normalWorld,
  positionWorld,
  mix,
  dot,
  modelWorldMatrix,
  uniform,
  cameraPosition,
  distance,
} from 'three/tsl'
import { sobel } from 'three/addons/tsl/display/SobelOperatorNode.js'
import { bayerDither } from 'three/addons/tsl/math/Bayer.js'
import { gsap } from 'gsap'

export interface ClusterIntroOptions {
  /** 马赛克盖满屏幕时回调（宿主在此挂载内容） */
  onReveal: () => void
  /** 首帧渲染完成回调（宿主让加载遮罩淡出，露出已开始旋转的小球） */
  onReady?: () => void
  /**
   * intro（默认）：开场流程，小球自旋等待点击。
   * return：回归流程，首帧即为盖满屏幕的马赛克（「碎开」的页面），
   * 稍后反向拼回并恰好封合成完整球，定格一拍裂开后进入自旋，等待点击重新进入网站。
   */
  mode?: 'intro' | 'return'
}

export interface ClusterIntroHandle {
  dispose: () => void
}

const SPIN_SPEED = -0.4
/** 点击后碎片拼合成完整球 */
const ASSEMBLE_DURATION = 0.55
/** 完整球定格一拍再平铺开，让「拼成了球」被看清 */
const ASSEMBLE_HOLD = 0.2
/** 回归流程：反向封合成球后的定格时长，随后裂开成自旋的碎片球 */
const RETURN_SEAL_HOLD = 0.35
const RETURN_CRACK_DURATION = 0.55
const FLATTEN_DURATION = 1.1

/** 平铺目标：每个实例从「球心矩阵」插值到「屏幕网格矩阵」（three 无类型，按 any 处理） */
interface GridTarget {
  pos: any
  quat: any
  scale: number
}

type IntroState = 'spin' | 'assemble' | 'flatten' | 'return' | 'done'

/**
 * 给可能挂起的初始化步骤加超时（如无 WebGPU adapter 时 requestAdapter 可能永不返回）。
 * 超时直接 reject，由组件 catch 后降级到「跳过转场直接进网站」，避免站点被黑屏卡死。
 */
function withTimeout<T>(label: string, promise: Promise<T>, ms: number): Promise<T> {
  // 注意：定时器必须在 race 结束后再清除（.finally 回调），
  // 不能在函数末尾的 finally 块里 clearTimeout——那样会同步清掉刚创建的定时器，超时永不触发。
  return new Promise<T>((resolve, reject) => {
    const timer = window.setTimeout(() => reject(new Error(`[ClusterIntro] ${label} 超时（${ms}ms）`)), ms)
    promise.then(resolve, reject).finally(() => window.clearTimeout(timer))
  })
}

/** 把角度卷到 (-π, π]，视觉朝向不变（自旋角归零前先卷绕，避免长时间停留后倒转多圈） */
function wrapAngle(a: number): number {
  const twoPi = Math.PI * 2
  return a - Math.round(a / twoPi) * twoPi
}

export async function createClusterIntro(
  container: HTMLElement,
  opts: ClusterIntroOptions
): Promise<ClusterIntroHandle> {
  const disposed = { current: false }

  // ---------- 渲染器 / 场景 / 相机（内联 three-start 的薄壳，避免引入依赖） ----------
  const renderer = new THREE.WebGPURenderer({ antialias: true })
  await withTimeout('WebGPU renderer 初始化', renderer.init(), 8000)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
  renderer.setSize(
    container.clientWidth || window.innerWidth,
    container.clientHeight || window.innerHeight
  )
  renderer.domElement.style.width = '100%'
  renderer.domElement.style.height = '100%'
  renderer.domElement.style.display = 'block'
  container.appendChild(renderer.domElement)

  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 20)
  camera.position.z = 4

  const scenePass = pass(scene, camera)
  const renderPipeline = new THREE.RenderPipeline(renderer, scenePass)

  // ---------- 后处理：深度 Sobel 描边 + Bayer 抖动（逐字移植参考） ----------
  const scenePassColor = scenePass.getTextureNode()
  const scenePassDepth = scenePass.getTextureNode('depth')
  const scenePassSobel = sobel(scenePassDepth)
  const sobelPass = Fn(() => scenePassSobel.step(0.01))()
  const outputPass = Fn(() => {
    const result = scenePassColor.add(sobelPass)
    result.assign(bayerDither(result))
    return result
  })()
  renderPipeline.outputNode = outputPass

  // ---------- TSL uniforms ----------
  const hoverPointWS = uniform(vec3(0))
  const effectStrength = uniform(0)
  /** 径向分离增益：1=簇状（参考效果）；平铺→0（塌缩为标准半正方形三角） */
  const radialGain = uniform(1)
  /** 拼合度：0=裂开簇状（噪声缩放带缝隙）；1=缩放精确收敛到 1，八十面拼成完整球 */
  const assembleGain = uniform(0)
  /** 平铺时把配色从「参考暗簇」渐变为「马赛克彩色」 */
  const flattenMix = uniform(0)

  // 悬停衰减函数：世界坐标点到 hoverPointWS 的距离 → [0,1]
  const hoverEffectFn = Fn(([p]: [unknown]) => {
    return distance(p, hoverPointWS).clamp(0, 1).smoothstep(0.8, 0.2).mul(effectStrength)
  })

  // ---------- 内球材质：不可见，仅作拾取目标 ----------
  const InnerMaterial = new THREE.MeshBasicNodeMaterial({
    side: THREE.BackSide,
    colorWrite: false,
    depthWrite: false,
  })
  InnerMaterial.colorNode = Fn(() => hoverEffectFn(positionWorld))()

  // ---------- 簇材质 ----------
  const scaleMin = float(0.15)
  const scaleMax = float(0.75)
  const centered = attribute('position', 'vec3')
  const centroid = positionLocal.sub(centered)
  const centroidWS = modelWorldMatrix.mul(centroid)
  const hover = hoverEffectFn(centroidWS)
  /** a_base：每个顶点塌缩到的「标准半正方形三角」本地坐标（平铺时几何退化为平面） */
  const baseLocal = attribute('a_base', 'vec3')

  // ---------- 着色：黑白液态玻璃 / 悬停蓝粉渐变 ----------
  // MeshBasicNodeMaterial 下「液态玻璃」只能用颜色 + 透明度近似（不引入真实折射）：
  //  · 正对相机的面偏亮、侧壁偏暗 → 玻璃的厚薄差异
  //  · 掠射边缘叠菲涅尔亮边 → 玻璃轮廓反光
  //  · 一道锐利高光 + 一片柔光 → 液面反光（纯静态配色，不随时间变化）
  //  · 本体压一道上亮下暗的纵向渐变 → 液体沉降感
  //  · 半透明 + 双面渲染 → 透过前面的碎片看到后面的碎片，玻璃才有层次
  const glassDeep = vec3(0.012, 0.015, 0.022) // 深缝（近黑，偏冷）
  const glassBody = vec3(0.46, 0.5, 0.58) // 玻璃本体（中灰偏冷，给高光留余量）
  const glassRim = vec3(1.0, 1.0, 1.0) // 轮廓 / 高光（纯白）

  // 平铺马赛克与悬停共用同一组蓝粉色：悬停色 = 平铺色
  const skyBlue = vec3(0.529, 0.808, 0.922) // #87CEEB 天蓝
  const pinkPurple = vec3(0.87, 0.64, 0.92) // 浅粉紫

  // 共用：视线方向与正对程度（colorNode 与 opacityNode 都要用）
  const viewDir = cameraPosition.sub(positionWorld).normalize()
  const facing = dot(normalWorld, viewDir).abs().clamp(0, 1) // 1=正对相机，0=掠射侧壁
  const thickness = facing.smoothstep(0.05, 0.9) // 1=厚（正对），0=薄（边缘）

  const ClusterMaterial = new THREE.MeshBasicNodeMaterial({
    transparent: true,
    side: THREE.DoubleSide, // 双面：让后面的碎片能透出来
    depthWrite: true, // 仍写深度，后处理 Sobel 描边才有深度可用
  })

  ClusterMaterial.colorNode = Fn(() => {
    const fresnel = float(1).sub(facing).pow(2.4) // 边缘残光强度
    const keyLight = dot(normalWorld, vec3(0.35, 0.8, 0.5).normalize()).clamp(0, 1)
    const specular = keyLight.pow(36) // 锐利高光点（液面反光）
    const sheen = keyLight.pow(5).mul(0.18) // 大面积柔光

    // 纵向液面渐变（世界 Y）：上亮下暗，像液体在玻璃里沉积
    const liquidT = positionWorld.y.mul(0.5).add(0.5).clamp(0, 1)

    // 悬停渐变：以指针落点为原点沿世界 X 铺开（左天蓝、右粉紫）——
    // 与平铺马赛克同一组颜色；用位移而非方向，落点处不会出现 normalize(0) 的 NaN
    const relX = positionWorld.x.sub(hoverPointWS.x).mul(1.8).clamp(-1, 1)
    const hoverGrad = mix(skyBlue, pinkPurple, relX.mul(0.5).add(0.5))

    // 玻璃本体：厚处偏暗、正面偏亮，叠纵向液面渐变 / 边缘亮边 / 高光 / 柔光 / 极淡色散
    const glass = mix(glassDeep, glassBody, thickness)
      .mul(float(0.8).add(liquidT.mul(0.34)))
      .add(glassRim.mul(fresnel.mul(0.9)))
      .add(glassRim.mul(specular))
      .add(glassRim.mul(sheen))
      .add(hoverGrad.mul(fresnel.pow(3).mul(0.18)))

    // 悬停：蓝粉渐变取代玻璃本色，但保留白色高光点与边缘提亮，仍像一块玻璃
    const hovered = hoverGrad
      .add(glassRim.mul(specular.mul(0.5)))
      .add(hoverGrad.mul(fresnel.mul(0.2)))

    // 平铺态：按屏幕位置（z=0 平面）做天蓝→浅粉紫对角渐变，每块马赛克采到不同色
    const gradPos = positionWorld.x.add(positionWorld.y).mul(0.075).add(0.5)
    const flatShade = mix(skyBlue, pinkPurple, gradPos.clamp(0, 1))
    return mix(mix(glass, hovered, hover), flatShade, flattenMix)
  })()

  // 透明度：厚处更实、边缘更透（玻璃的厚度差）；平铺时全不透明
  const glassAlpha = mix(float(0.52), float(0.8), thickness)
  ClusterMaterial.opacityNode = mix(glassAlpha, float(1), flattenMix)

  ClusterMaterial.positionNode = Fn(() => {
    const t = time.mul(0.5)
    const noise = mx_noise_float(centroid.yz.add(t))
    noise.remapAssign(-1, 1, scaleMin, scaleMax)
    const scaleByHover = hover.remap(0, 1, 0, 0.45)
    // assembleGain=1 时缩放精确为 1：碎面回到细分二十面体原始位置，严丝合缝拼成完整球
    const growScale = mix(noise.add(scaleByHover), float(1), assembleGain)
    const displaced = centroid.add(centered.mul(growScale))
    // radialGain=1 时 = 参考位移；=0 时退化为标准半正方形三角
    return mix(baseLocal, displaced, radialGain)
  })()

  // ---------- 内球 + 80 个外扩三棱柱面 ----------
  const innerGeometry = new THREE.IcosahedronGeometry(1, 1)
  const innerMesh = new THREE.Mesh(innerGeometry, InnerMaterial)
  innerMesh.name = 'innerMesh'
  scene.add(innerMesh)

  const { geometry } = innerMesh
  const { position: meshPosition } = innerMesh
  const positionAttribute = geometry.getAttribute('position')
  const { length: numVertices } = positionAttribute.array
  const numFaces = numVertices / 9 // 80

  const facesMesh = new THREE.BatchedMesh(
    numFaces,
    numVertices * 6,
    numVertices * 6,
    ClusterMaterial
  )
  facesMesh.name = 'facesMesh'

  const faceCentroid = new THREE.Vector3()
  const faceDirection = new THREE.Vector3()
  const instanceMatrix = new THREE.Matrix4()
  const centroids: any[] = []

  // 标准半正方形三角（直角等腰，覆盖单位方格的上半），平铺时所有面塌缩到这个形状。
  // as const：noUncheckedIndexedAccess 下保证按索引取值仍是 number
  const B1 = [-0.5, -0.5, 0] as const
  const B2 = [0.5, -0.5, 0] as const
  const B3 = [-0.5, 0.5, 0] as const

  let i: number
  for (i = 0; i < numVertices; i += 9) {
    const x1 = positionAttribute.array[i + 0]
    const y1 = positionAttribute.array[i + 1]
    const z1 = positionAttribute.array[i + 2]
    const x2 = positionAttribute.array[i + 3]
    const y2 = positionAttribute.array[i + 4]
    const z2 = positionAttribute.array[i + 5]
    const x3 = positionAttribute.array[i + 6]
    const y3 = positionAttribute.array[i + 7]
    const z3 = positionAttribute.array[i + 8]

    faceCentroid.set(x1 + x2 + x3, y1 + y2 + y3, z1 + z2 + z3).divideScalar(3)
    faceDirection.copy(faceCentroid).sub(meshPosition).normalize()
    centroids.push(faceCentroid.clone())

    const faceExtrusion = 0.45
    const x4 = x1 + faceDirection.x * faceExtrusion
    const y4 = y1 + faceDirection.y * faceExtrusion
    const z4 = z1 + faceDirection.z * faceExtrusion
    const x5 = x2 + faceDirection.x * faceExtrusion
    const y5 = y2 + faceDirection.y * faceExtrusion
    const z5 = z2 + faceDirection.z * faceExtrusion
    const x6 = x3 + faceDirection.x * faceExtrusion
    const y6 = y3 + faceDirection.y * faceExtrusion
    const z6 = z3 + faceDirection.z * faceExtrusion

    // 三棱柱：底三角 x1x2x3 + 顶三角 x4x5x6 + 三个侧面（逐字移植参考）
    const instanceGeometry = new THREE.BufferGeometry()
    const attributeArray = new Float32Array([
      x1, y1, z1,
      x3, y3, z3,
      x2, y2, z2,

      x1, y1, z1,
      x2, y2, z2,
      x4, y4, z4,

      x2, y2, z2,
      x5, y5, z5,
      x4, y4, z4,

      x2, y2, z2,
      x3, y3, z3,
      x5, y5, z5,

      x3, y3, z3,
      x6, y6, z6,
      x5, y5, z5,

      x3, y3, z3,
      x1, y1, z1,
      x6, y6, z6,

      x1, y1, z1,
      x4, y4, z4,
      x6, y6, z6,

      x4, y4, z4,
      x5, y5, z5,
      x6, y6, z6,
    ])
    instanceGeometry.setAttribute(
      'position',
      new THREE.Float32BufferAttribute(attributeArray, 3)
    )

    // a_base：24 个顶点各自映射到标准三角的三个顶点（x1→B1、x2→B2、x3→B3，
    // x4/x5/x6 归位到 B1/B2/B3）。平铺时（radialGain=0）只剩前盖三角为有效 +Z 面，
    // 其余塌缩为退化三角形被剔除，恰好渲染成一个平面三角。
    const baseArray = new Float32Array([
      B1[0], B1[1], B1[2], B3[0], B3[1], B3[2], B2[0], B2[1], B2[2],
      B1[0], B1[1], B1[2], B2[0], B2[1], B2[2], B1[0], B1[1], B1[2],
      B2[0], B2[1], B2[2], B2[0], B2[1], B2[2], B1[0], B1[1], B1[2],
      B2[0], B2[1], B2[2], B3[0], B3[1], B3[2], B2[0], B2[1], B2[2],
      B3[0], B3[1], B3[2], B3[0], B3[1], B3[2], B2[0], B2[1], B2[2],
      B3[0], B3[1], B3[2], B1[0], B1[1], B1[2], B3[0], B3[1], B3[2],
      B1[0], B1[1], B1[2], B1[0], B1[1], B1[2], B3[0], B3[1], B3[2],
      B1[0], B1[1], B1[2], B2[0], B2[1], B2[2], B3[0], B3[1], B3[2],
    ])
    instanceGeometry.setAttribute('a_base', new THREE.Float32BufferAttribute(baseArray, 3))

    instanceGeometry.translate(-faceCentroid.x, -faceCentroid.y, -faceCentroid.z)

    const instanceGeometryID = facesMesh.addGeometry(instanceGeometry)
    const instanceID = facesMesh.addInstance(instanceGeometryID)
    instanceMatrix.makeTranslation(faceCentroid.x, faceCentroid.y, faceCentroid.z)
    facesMesh.setMatrixAt(instanceID, instanceMatrix)
  }

  facesMesh.geometry.computeVertexNormals()
  innerMesh.add(facesMesh)

  // ---------- 平铺网格目标 ----------
  const targets: GridTarget[] = []
  const UP_QUAT = new THREE.Quaternion() // 上半三角（标准朝向）
  const DOWN_QUAT = new THREE.Quaternion().setFromAxisAngle(
    new THREE.Vector3(0, 0, 1),
    Math.PI
  )

  function buildGridTargets() {
    targets.length = 0
    const half = numFaces / 2 // 40 个菱形（每个由 2 个三角拼成）
    const aspect =
      (container.clientWidth || window.innerWidth) /
      (container.clientHeight || window.innerHeight)
    const fov = (camera.fov * Math.PI) / 180
    const worldH = 2 * Math.tan(fov / 2) * camera.position.z
    const worldW = worldH * aspect
    // cols 必须整除 half：rows=half/cols 才能整除，否则最后一行缺菱形，
    // 右下角露出覆盖层黑底（如宽高比≈2 的最大化浏览器窗口会算出 9×5，缺 5 块）。
    // 在 half 的因子里选 cols/rows 最接近 aspect 的一组，保持格子接近正方形。
    let cols = 1
    let bestScore = Infinity
    for (let d = 1; d <= half; d++) {
      if (half % d !== 0) continue
      const score = Math.abs(Math.log(d / (half / d) / aspect))
      if (score < bestScore) {
        bestScore = score
        cols = d
      }
    }
    const rows = half / cols
    const cellW = worldW / cols
    const cellH = worldH / rows
    const cellSize = Math.max(cellW, cellH) * 1.06

    let idx = 0
    for (let r = 0; r < rows && idx < numFaces; r++) {
      for (let c = 0; c < cols && idx < numFaces; c++) {
        const cx = ((c + 0.5) / cols) * worldW - worldW / 2
        const cy = worldH / 2 - ((r + 0.5) / rows) * worldH
        for (let h = 0; h < 2 && idx < numFaces; h++, idx++) {
          targets.push({
            pos: new THREE.Vector3(cx, cy, 0),
            quat: h === 0 ? UP_QUAT : DOWN_QUAT,
            scale: cellSize,
          })
        }
      }
    }
  }

  // ---------- 平铺：每帧把实例矩阵从「球心」插值到「网格」 ----------
  const tmpPos = new THREE.Vector3()
  const tmpQuatA = new THREE.Quaternion()
  const tmpQuatB = new THREE.Quaternion()
  const tmpScale = new THREE.Vector3()
  const tmpMatrix = new THREE.Matrix4()

  function applyFlatten(progress: number) {
    for (let n = 0; n < numFaces; n++) {
      // buildGridTargets() 保证 target 与 centroids 数量一致且已填充
      const target = targets[n]!
      tmpPos.lerpVectors(centroids[n]!, target.pos, progress)
      tmpQuatA.identity()
      tmpQuatB.copy(target.quat)
      tmpQuatA.slerp(tmpQuatB, progress)
      const s = 1 + (target.scale - 1) * progress
      tmpScale.set(s, s, 1)
      tmpMatrix.compose(tmpPos, tmpQuatA, tmpScale)
      facesMesh.setMatrixAt(n, tmpMatrix)
    }
  }

  // ---------- 状态机：spin → assemble → flatten → done ----------
  let state: IntroState = 'spin'
  let flattenProgress: { p: number } | null = null
  let assembleTimer = 0

  /** 点击后碎片先严丝合缝拼成完整球，定格一拍再平铺开 */
  function startAssemble() {
    if (state !== 'spin') return
    state = 'assemble'
    gsap.to(effectStrength, { value: 0, duration: 0.2, overwrite: true })
    // 自旋角先卷绕到 (-π, π] 再平滑归零（球/世界同系，便于平铺矩阵计算），
    // 球封合时恰好停稳；也避免长时间停留后归零时倒转多圈
    innerMesh.rotation.y = wrapAngle(innerMesh.rotation.y)
    gsap.to(innerMesh.rotation, {
      y: 0,
      duration: ASSEMBLE_DURATION,
      ease: 'power2.out',
      overwrite: true,
    })
    gsap.to(assembleGain, {
      value: 1,
      duration: ASSEMBLE_DURATION,
      ease: 'power3.inOut',
      overwrite: true,
      onComplete: () => {
        assembleTimer = window.setTimeout(startFlatten, ASSEMBLE_HOLD * 1000)
      },
    })
  }

  function startFlatten() {
    state = 'flatten'
    buildGridTargets()
    flattenProgress = { p: 0 }
    gsap.to(flattenProgress, {
      p: 1,
      duration: FLATTEN_DURATION,
      ease: 'power2.inOut',
      onUpdate: () => {
        if (flattenProgress) applyFlatten(flattenProgress.p)
      },
      onComplete: () => {
        state = 'done'
        opts.onReveal()
      },
    })
    gsap.to(radialGain, { value: 0, duration: FLATTEN_DURATION, ease: 'power2.inOut' })
    gsap.to(flattenMix, { value: 1, duration: FLATTEN_DURATION, ease: 'power2.inOut' })
  }

  // ---------- 回归模式：首帧即满屏马赛克，稍后反向拼回小球 ----------
  let returnTimer = 0
  if (opts.mode === 'return') {
    state = 'return'
    radialGain.value = 0
    flattenMix.value = 1
    innerMesh.rotation.y = 0
    buildGridTargets()
    applyFlatten(1)
    // 先以完整马赛克亮相（宿主此时淡出故障闪烁层），随后反向拼球
    returnTimer = window.setTimeout(() => {
      flattenProgress = { p: 1 }
      gsap.to(flattenProgress, {
        p: 0,
        duration: FLATTEN_DURATION,
        ease: 'power2.inOut',
        onUpdate: () => {
          if (flattenProgress) applyFlatten(flattenProgress.p)
        },
        onComplete: () => {
          // 碎片恰好封合成完整球：定格一拍，随后裂开成自旋的碎片球
          assembleTimer = window.setTimeout(() => {
            state = 'spin'
            gsap.to(assembleGain, {
              value: 0,
              duration: RETURN_CRACK_DURATION,
              ease: 'power2.inOut',
              overwrite: true,
            })
          }, RETURN_SEAL_HOLD * 1000)
        },
      })
      gsap.to(radialGain, { value: 1, duration: FLATTEN_DURATION, ease: 'power2.inOut' })
      gsap.to(flattenMix, { value: 0, duration: FLATTEN_DURATION, ease: 'power2.inOut' })
      // 飞回途中逐渐拼合，抵达球位时恰好封合成完整球
      gsap.to(assembleGain, {
        value: 1,
        duration: FLATTEN_DURATION,
        ease: 'power2.inOut',
        overwrite: true,
      })
    }, 800)
  }

  // ---------- 交互：悬停扩散 + 点击爆开（射线拾取隐形内球） ----------
  const ndc = new THREE.Vector2()
  const raycaster = new THREE.Raycaster()

  function updateNdc(clientX: number, clientY: number) {
    const w = container.clientWidth || window.innerWidth
    const h = container.clientHeight || window.innerHeight
    ndc.set((clientX / w) * 2 - 1, -(clientY / h) * 2 + 1)
  }

  function raycastInner(): any[] {
    raycaster.setFromCamera(ndc, camera)
    return raycaster.intersectObject(innerMesh, false)
  }

  function setHover(value: boolean) {
    gsap.to(effectStrength, {
      value: value ? 1 : 0,
      duration: value ? 0.5 : 0.2,
      ease: 'power2.out',
      overwrite: true,
    })
  }

  function onPointerMove(e: PointerEvent) {
    if (state !== 'spin') return
    updateNdc(e.clientX, e.clientY)
    const hit = raycastInner()
    const isHover = hit.length > 0
    if (isHover) {
      gsap.to(hoverPointWS.value, {
        x: hit[0].point.x,
        y: hit[0].point.y,
        z: hit[0].point.z,
        duration: 0.5,
        ease: 'power2.out',
        overwrite: true,
      })
    }
    setHover(isHover)
  }

  function onPointerDown(e: PointerEvent) {
    if (state !== 'spin') return
    updateNdc(e.clientX, e.clientY)
    if (raycastInner().length > 0) {
      startAssemble()
    }
  }

  container.addEventListener('pointermove', onPointerMove)
  container.addEventListener('pointerdown', onPointerDown)

  // ---------- 动画循环 ----------
  let lastT = performance.now()
  let readyNotified = false
  renderer.setAnimationLoop(() => {
    if (disposed.current) return
    if (document.hidden) return
    if (!readyNotified) {
      // 首帧已渲染（小球可见），通知宿主淡出加载遮罩，避免黑屏空档
      readyNotified = true
      opts.onReady?.()
    }
    const now = performance.now()
    const dt = Math.min((now - lastT) / 1000, 0.05)
    lastT = now
    if (state === 'spin') innerMesh.rotation.y += dt * SPIN_SPEED
    renderPipeline.render()
  })

  // ---------- 尺寸响应 ----------
  const resizeObserver = new ResizeObserver(() => {
    const w = container.clientWidth || window.innerWidth
    const h = container.clientHeight || window.innerHeight
    camera.aspect = w / h
    camera.updateProjectionMatrix()
    renderer.setSize(w, h)
    // 平铺开始后视口尺寸变化：按新尺寸重建网格目标并按当前进度重铺，
    // 否则马赛克仍按旧视口铺放，边缘会露出黑底
    if (state === 'flatten' || state === 'done') {
      buildGridTargets()
      if (flattenProgress) applyFlatten(flattenProgress.p)
    }
  })
  resizeObserver.observe(container)

  // ---------- 释放 ----------
  function dispose() {
    if (disposed.current) return
    disposed.current = true
    window.clearTimeout(returnTimer)
    window.clearTimeout(assembleTimer)
    container.removeEventListener('pointermove', onPointerMove)
    container.removeEventListener('pointerdown', onPointerDown)
    resizeObserver.disconnect()
    gsap.killTweensOf(radialGain)
    gsap.killTweensOf(assembleGain)
    gsap.killTweensOf(flattenMix)
    gsap.killTweensOf(effectStrength)
    gsap.killTweensOf(hoverPointWS.value)
    gsap.killTweensOf(innerMesh.rotation)
    if (flattenProgress) gsap.killTweensOf(flattenProgress)
    renderer.setAnimationLoop(null)
    ClusterMaterial.dispose()
    InnerMaterial.dispose()
    facesMesh.dispose()
    innerGeometry.dispose()
    renderer.dispose()
    renderer.domElement.remove()
  }

  return { dispose }
}

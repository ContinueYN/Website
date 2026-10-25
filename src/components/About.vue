<template>
  <section id="about" class="about">
    <div class="header-container" @click="triggerFault">
      <div class="header" :ref="(el) => setHeaderRef(el, 0)">About</div>
      <div class="header" :ref="(el) => setHeaderRef(el, 1)">About</div>
      <div class="header" :ref="(el) => setHeaderRef(el, 2)">About</div>
      <div class="header" :ref="(el) => setHeaderRef(el, 3)">About</div>
    </div>
    <div class="container">
      <div
        v-for="(card, index) in cards"
        :key="index"
        ref="pokerRefs"
        class="poker"
        :class="`poker${index + 1}`"
        @mouseenter="handleCardHover(index)"
        @mouseleave="handleCardLeave(index)"
        @click="drawCard(index)"
      >
        <div class="card-face card-front">
          <div class="card-content">
            <div class="vertical-text">
              <span>{{ card.text.charAt(0) }}</span>
              <span>{{ card.text.charAt(1) }}</span>
            </div>
          </div>
        </div>
        <div class="card-face card-back">
          <h3 class="back-title">{{ card.title }}</h3>
          <p class="back-desc">{{ card.description }}</p>
          <div class="back-tags">
            <span v-for="(tag, idx) in card.tags" :key="idx" class="back-tag">
              {{ tag }}
            </span>
          </div>
          <div class="back-divider"></div>
          <p class="back-details">{{ card.details }}</p>
        </div>
      </div>
      <div
        class="poker_top"
        :class="`poker5`"
        @click="handleTopClick"
      >
        <div class="mount">
          <div class="strip strip-left">
            <img src="@/assets/images/承因果.png" alt="承因果" draggable="false" />
          </div>
          <div class="seal" aria-hidden="true">
            <img src="@/assets/images/受命于天.png" alt="受命于天" draggable="false" />
          </div>
          <div class="strip strip-right">
            <img src="@/assets/images/顺天命.png" alt="顺天命" draggable="false" />
          </div>
        </div>
      </div>
    </div>

    <!-- 抽牌遮罩：落牌后压暗背景，点任意处（含飞行中的牌本身）原路放回 -->
    <div v-show="showFlight" ref="flightOverlayRef" class="flight-overlay" @click="returnCard"></div>
  </section>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import gsap from 'gsap'
import { MotionPathPlugin } from 'gsap/MotionPathPlugin'
import { useScrollLock } from '../composables/useScrollLock'

gsap.registerPlugin(MotionPathPlugin)

const { lock: lockScroll, unlock: unlockScroll } = useScrollLock()

const pokerRefs = ref([])
const pokerEles = ref([])
const imgIndex = ref(0)
const headerRefs = ref([])
const faultPlayer = ref(null)

const setHeaderRef = (el, index) => {
  if (el) {
    headerRefs.value[index] = el
  }
}

// 连点计数：窗口内点满 3 次触发全站故障；回归流程结束后（cluster-reset）重新武装
// 窗口取 3.5s：单击故障效果本身闪动约 0.6s，留足用户在两次闪烁之间落点的时间
const FAULT_WINDOW_MS = 3500
let faultClicks = 0
let lastFaultAt = 0
let stormFired = false

const onClusterReset = () => {
  stormFired = false
  faultClicks = 0
}

const cards = ref([
  {
    text: '雅好',
    title: '雅好',
    description: '敲键之暇，寄兴所好',
    tags: ['动漫游艺', '丝竹之乐', '格物新器'],
    details: '敲键之暇，吾常寓目于动漫游艺之境：剧之演出、戏之交互，每启吾设计之妙悟；一入丝竹，万虑俱消，首页之曲，即出吾之私藏。至若新出之 AI 利器、开源之奇物，必先试为快——盖好玩之物，多多益善，从不嫌多。'
  },
  {
    text: '秉性',
    title: '秉性',
    description: '好奇为引，然诺为骨，兼有求全之癖',
    tags: ['好奇若渴', '秋毫必察', '一诺千金'],
    details: '吾以「余诺」为号——「余」者，吾也；「诺」者，言也；合而为一，即「吾之诺言」。故平生最重然诺：凡有所诺，必力践之，此吾最珍之德也。遇未闻之物，奇心辄动，新技在前，必亲手一验而后快；行事则秋毫必察，为一像素之偏、一过渡之涩，屡改不厌。胸中常乐，纵代码生虫，亦安然入梦。'
  },
  {
    text: '历练',
    title: '历练',
    description: '始于「Hello World」一行，臻于 AI 全栈之境',
    tags: ['无师自通', '躬行实践', '与 AI 偕行'],
    details: '吾之起点，纯出自学：自「Hello World」一行始，赖文档、开源之社与亲手所营之项目，寸积铢累，乃有所成。使吾真正蜕变者，乃化虚想为完器之功——需求、设计、开发、部署，环环皆曾踬踣，步步亦皆有所得。今吾专志于 AI 原生之道，以新法构筑应用。所营何物，请移步下方 Projects，一探究竟。'
  },
  {
    text: '吾道',
    title: '吾道',
    description: '尽人事于当下，听天命于将来',
    tags: ['承因果', '尽人事', '顺天命'],
    details: '顶牌三语，即吾座右之铭也。承因果者，种何因、结何果，所写每行代码、所下每次抉择，俱自有数；尽人事者，凡事竭尽全力，不使留「本可以」之憾；顺天命者，成败荣辱，付诸时日。信因果者，其行事也必敬。'
  },
  {
    text: '远志',
    title: '远志',
    description: '日就月将，作有温度之数字之作',
    tags: ['深耕不辍', '回馈开源', '薪火相传'],
    details: '近者，愿于 AI 应用之道愈掘愈深，与更具挑战之役，每成一作，必打磨至吾心悦诚服；远者，愿以代码回馈开源之社，录平生所踣之坑，编次分享，俾后来者少行弯路。夫成长无捷径，然所行步步，皆作数也。'
  }
])

// —— 抽牌飞行 ——
// 点击卡牌：克隆一张固定定位的牌挂到 body（脱离牌堆容器的 transform/层叠上下文），
// 沿类抛物线飞向屏幕中心并在途中翻面露出背面内容；
// 点任意处：timeline.reverse() 从当前进度原路倒播放回，半途中断同样连续。
// 两段式抽牌：A 抽出（拽离牌堆，仍背面朝上）→ B 翻面送达（甩到牌堆上方途中翻开）
// 逆放回 = B 的倒放（翻回背面）+ A 的倒放（插回牌堆），动作符合现实顺序
const PULL_D = 0.3
const TOSS_D = 0.45

const clamp = (v, min, max) => (min > max ? (min + max) / 2 : Math.min(Math.max(v, min), max))

const showFlight = ref(false)
const flightOverlayRef = ref(null)

let flightTl = null
let overlayFade = null
let flightClone = null
let flightSource = null
let flightReturning = false

const deckAngleOf = (el, fallbackIndex) => {
  const tf = transformDatas[el?.nums] ?? transformDatas[fallbackIndex] ?? ''
  const m = /rotate\(([-\d.]+)deg\)/.exec(tf)
  return m ? parseFloat(m[1]) : 0
}

const drawCard = (index) => {
  if (flightTl) return
  const original = pokerEles.value[index]
  if (!original) return

  const rect = original.getBoundingClientRect()
  const W = original.offsetWidth
  const H = original.offsetHeight
  const startAngle = deckAngleOf(original, index)
  const targetScale = Math.max(1, Math.min(
    (window.innerHeight * 0.76) / H,
    (window.innerWidth * 0.88) / W,
    2
  ))
  // 旋转刚体的包围盒中心恒等于牌面中心：克隆以此定位，起始姿态与原牌视觉完全一致
  const startX = rect.left + rect.width / 2 - W / 2
  const startY = rect.top + rect.height / 2 - H / 2
  // 落点：牌堆容器中心（抽出来悬在牌堆上方翻开），并钳制在视口内——
  // 无论页面滚到哪、窗口多小，翻开的牌始终完整可见。
  // 注意 scale 围绕元素中心缩放：x/y 定位的是未缩放的左上角，
  // 中心 = x + W/2，故落点换算用 W/2 而非缩放后的半宽
  const pile = document.querySelector('#about .container')
  const pileRect = pile ? pile.getBoundingClientRect() : null
  const margin = 16
  const halfW = (W * targetScale) / 2
  const halfH = (H * targetScale) / 2
  const landCx = clamp(
    pileRect ? pileRect.left + pileRect.width / 2 : window.innerWidth / 2,
    margin + halfW,
    window.innerWidth - margin - halfW
  )
  const landCy = clamp(
    pileRect ? pileRect.top + pileRect.height / 2 : window.innerHeight / 2,
    margin + halfH,
    window.innerHeight - margin - halfH
  )
  const endX = landCx - W / 2
  const endY = landCy - H / 2
  // A 抽出：沿牌面自身朝向把牌拽出牌堆（保持背面朝上、原倾斜、原大小）
  const angleRad = (startAngle * Math.PI) / 180
  const pullDist = Math.min(H * 0.4, 150)
  const pullX = startX + Math.sin(angleRad) * pullDist
  const pullY = startY - Math.cos(angleRad) * pullDist

  flightClone = original.cloneNode(true)
  flightClone.classList.add('about-flight-card')
  flightClone.style.cssText = ''
  flightClone.addEventListener('click', returnCard)
  document.body.appendChild(flightClone)

  original.style.visibility = 'hidden'
  flightSource = original

  showFlight.value = true
  lockScroll()
  window.addEventListener('keydown', onFlightKeydown)

  gsap.set(flightClone, {
    x: startX,
    y: startY,
    rotation: startAngle,
    rotationY: 0,
    scale: 1,
    transformPerspective: 1200,
    transformOrigin: '50% 50%'
  })

  flightTl = gsap.timeline({
    defaults: { ease: 'power1.inOut' },
    onReverseComplete: restoreCard
  })

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    // 弱动效：去掉弧线甩动，只保留抽出与直线送达翻面
    flightTl
      .to(flightClone, { x: pullX, y: pullY, duration: PULL_D, ease: 'power2.out' }, 0)
      .to(flightClone, { x: endX, y: endY, rotation: 0, scale: targetScale, duration: TOSS_D, ease: 'power1.inOut' }, PULL_D)
      .to(flightClone, { rotationY: 180, duration: TOSS_D * 0.8, ease: 'power2.inOut' }, PULL_D + 0.05)
  } else {
    // B 段弧线：从拽出点甩向落点，弧顶向外上拱
    const bulgeX = -Math.sign(endX - pullX) * Math.min(Math.abs(endX - pullX) * 0.3, 120)
    const bulgeY = -Math.min(Math.abs(endY - pullY) * 0.25, 110)

    flightTl
      // A 抽出：快速拽出牌堆，末端减速停住（像捏着牌抽离那一瞬）
      .to(flightClone, { x: pullX, y: pullY, duration: PULL_D, ease: 'power2.out' }, 0)
      // B 翻面送达：小弧线甩到牌堆上方，途中翻面、摆正、放大
      .to(flightClone, {
        motionPath: {
          path: [
            { x: pullX, y: pullY },
            { x: (pullX + endX) / 2 + bulgeX, y: (pullY + endY) / 2 + bulgeY },
            { x: endX, y: endY }
          ],
          curviness: 1.3
        },
        duration: TOSS_D,
        ease: 'power1.inOut'
      }, PULL_D)
      .to(flightClone, { rotation: 0, duration: TOSS_D * 0.8, ease: 'power2.out' }, PULL_D)
      .to(flightClone, { rotationY: 180, duration: TOSS_D * 0.85, ease: 'power2.inOut' }, PULL_D + 0.04)
      .to(flightClone, { scale: targetScale, duration: TOSS_D, ease: 'power1.inOut' }, PULL_D)
  }

  // 落定后再压暗背景：注意力先跟着牌走
  if (flightOverlayRef.value) {
    overlayFade = gsap.fromTo(flightOverlayRef.value,
      { opacity: 0 },
      { opacity: 1, duration: 0.4, delay: PULL_D + TOSS_D * 0.55 }
    )
  }
}

const returnCard = () => {
  if (!flightTl || flightReturning) return
  flightReturning = true
  if (overlayFade) {
    overlayFade.kill()
    overlayFade = null
  }
  if (flightOverlayRef.value) {
    gsap.to(flightOverlayRef.value, { opacity: 0, duration: 0.28, overwrite: 'auto' })
  }
  flightTl.reverse()
}

const restoreCard = () => {
  if (flightClone) {
    flightClone.remove()
    flightClone = null
  }
  if (flightSource) {
    const el = flightSource
    // 先对齐克隆落点（含悬停抽出的位移），显现后下一帧再平滑滑回牌堆槽位
    const slot = transformDatas[el.nums] ?? ''
    el.style.transition = 'none'
    el.style.transform = `${slot} translate(0, -3rem)`
    el.style.visibility = ''
    requestAnimationFrame(() => {
      el.style.transition = 'transform 0.3s ease'
      el.style.transform = slot
    })
    flightSource = null
  }
  flightTl = null
  flightReturning = false
  showFlight.value = false
  unlockScroll()
  window.removeEventListener('keydown', onFlightKeydown)
}

const onFlightKeydown = (e) => {
  if (e.key === 'Escape') returnCard()
}

const cleanupFlight = () => {
  window.removeEventListener('keydown', onFlightKeydown)
  if (overlayFade) {
    overlayFade.kill()
    overlayFade = null
  }
  if (flightTl) {
    flightTl.kill()
    flightTl = null
  }
  if (flightClone) {
    flightClone.remove()
    flightClone = null
  }
  if (flightSource) {
    flightSource.style.visibility = ''
    flightSource.style.transform = transformDatas[flightSource.nums] ?? ''
    flightSource = null
  }
  if (showFlight.value) {
    showFlight.value = false
    unlockScroll()
  }
}

const transformDatas = [
  "rotate(-10deg)",
  "rotate(-6deg) translate(35%, -12%)",
  "rotate(-2deg) translate(65%, -19%)",
  "rotate(2deg) translate(95%, -26%)",
  "rotate(6deg) translate(125%, -23%)"
]

const init = () => {
  pokerEles.value = pokerRefs.value
  
  pokerEles.value.forEach((obj, index) => {
    obj.nums = index
  })
  
  imgIndex.value = 5
}

const move = () => {
  pokerEles.value.forEach((ele) => {
    let nums = ele.nums
    if (nums + 1 >= pokerEles.value.length) {
      nums = 0
      ele.style.transition = ""
      const lastCard = cards.value.pop()
      cards.value.unshift(lastCard)
      imgIndex.value++
      if (imgIndex.value >= 9) {
        imgIndex.value = 0
      }
    } else {
      nums += 1
      ele.style.transition = "transform 0.3s ease"
    }
    ele.style.zIndex = nums
    ele.style.transform = transformDatas[nums]
    ele.nums = nums
  })
}

const handleCardHover = (index) => {
  // 鼠标移入：沿卡片自身朝向抽出一小段距离
  const el = pokerEles.value[index]
  if (el) {
    el.style.transition = 'transform 0.35s cubic-bezier(0.22, 1, 0.36, 1)'
    const base = el.style.transform || transformDatas[el.nums] || transformDatas[index]
    el.style.transform = `${base} translate(0, -3rem)`
  }
}

const handleCardLeave = (index) => {
  // 鼠标移出：卡片滑回原位
  const el = pokerEles.value[index]
  if (el && el.nums !== undefined) {
    el.style.transition = 'transform 0.3s ease'
    el.style.transform = transformDatas[el.nums]
  }
}

const handleTopClick = () => {
  move()
}

const triggerFault = () => {
  if (stormFired) return

  // 2.5s 内连点 3 次：触发全站故障 → 碎开 → 拼回 3D 小球（由 App.vue 接管）
  const now = Date.now()
  faultClicks = now - lastFaultAt <= FAULT_WINDOW_MS ? faultClicks + 1 : 1
  lastFaultAt = now
  if (faultClicks >= 3) {
    stormFired = true
    faultClicks = 0
    window.dispatchEvent(new Event('glitch-storm'))
    return
  }

  if (faultPlayer.value) {
    clearInterval(faultPlayer.value)
  }
  
  setTimeout(() => {
    if (faultPlayer.value) {
      clearInterval(faultPlayer.value)
    }
    headerRefs.value.forEach((header) => {
      if (header) {
        header.classList.remove("header-fault")
        header.style.transform = ''
        header.style.clipPath = ''
      }
    })
  }, 550)

  // 跳幅/裁剪收敛：文字保持在原位附近闪烁，保证连点时仍可命中（3 次触发全站故障）
  faultPlayer.value = setInterval(() => {
    headerRefs.value.forEach((header) => {
      if (header) {
        header.classList.add("header-fault")
        header.style.transform = `translate(${Math.random() * 24 - 12}%,${Math.random() * 16 - 8}%)`
        let x = Math.random() * 60
        let y = Math.random() * 30
        let h = Math.random() * 40 + 60
        let w = Math.random() * 30 + 30
        header.style.clipPath = `polygon(${x}% ${y}%, ${x + w}% ${y}%, ${x + w}% ${y + h}%, ${x}% ${y + h}%)`
      }
    })
  }, 30)
}

onMounted(() => {
  init()
  window.addEventListener('cluster-reset', onClusterReset)
})

onBeforeUnmount(() => {
  window.removeEventListener('cluster-reset', onClusterReset)
  cleanupFlight()
})
</script>

<style scoped>
* {
  font-size: 2vmin;
  margin: 0;
  padding: 0;
}

.about {
  padding: 0;
  background: transparent;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
}

.header-container {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 5rem;
  cursor: pointer;
  z-index: 100;
}

.header {
  position: absolute;
  font-size: 4rem;
  font-family: Impact, sans-serif;
  font-weight: 800;
  margin-bottom: 5rem;
  color: var(--text-main);
  letter-spacing: 0.5rem;
  user-select: none;
}

.header-fault::after,
.header-fault::before {
  content: "About";
  position: absolute;
  left: 0;
  top: 0;
  mix-blend-mode: screen;
}

.header-fault::after {
  color: #ff0000;
  transform: translateX(2%);
}

.header-fault::before {
  color: #0000ff;
  transform: translateX(-2%);
}

/* 悬停：About 四周浮现故障风格的线条（青/品红错位边框 + 扫描条），提示可点击 */
.header-container::before,
.header-container::after {
  content: "";
  position: absolute;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.18s ease;
}

.header-container::before {
  inset: -0.9rem -1.5rem;
  z-index: -1;
  /* 上下左右各两条错位的青/品红短线，模拟信号错乱的取景框 */
  background:
    linear-gradient(90deg, rgba(0, 255, 255, 0.85), rgba(0, 255, 255, 0.85)) 0 0 / 42% 2px,
    linear-gradient(90deg, rgba(255, 0, 255, 0.85), rgba(255, 0, 255, 0.85)) 100% 0 / 48% 2px,
    linear-gradient(90deg, rgba(0, 255, 255, 0.6), rgba(0, 255, 255, 0.6)) 0 100% / 55% 2px,
    linear-gradient(90deg, rgba(255, 0, 255, 0.6), rgba(255, 0, 255, 0.6)) 100% 100% / 50% 2px,
    linear-gradient(180deg, rgba(0, 255, 255, 0.75), rgba(0, 255, 255, 0.75)) 0 0 / 2px 46%,
    linear-gradient(180deg, rgba(255, 0, 255, 0.75), rgba(255, 0, 255, 0.75)) 100% 0 / 2px 52%,
    linear-gradient(180deg, rgba(255, 0, 255, 0.55), rgba(255, 0, 255, 0.55)) 0 100% / 2px 55%,
    linear-gradient(180deg, rgba(0, 255, 255, 0.55), rgba(0, 255, 255, 0.55)) 100% 100% / 2px 50%;
  background-repeat: no-repeat;
  animation: about-frame-jitter 0.28s steps(2, end) infinite;
}

.header-container::after {
  left: 0;
  right: 0;
  top: 0;
  height: 2px;
  z-index: -1;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.7), transparent);
  box-shadow: 0 0 8px rgba(0, 255, 255, 0.8);
  animation: about-scan-sweep 0.9s linear infinite;
}

.header-container:hover::before,
.header-container:hover::after {
  opacity: 1;
}

@keyframes about-frame-jitter {
  0% {
    transform: translate(0, 0);
  }
  50% {
    transform: translate(1.5px, -1px);
  }
  100% {
    transform: translate(-1px, 1.5px);
  }
}

@keyframes about-scan-sweep {
  0% {
    top: -10%;
    opacity: 0;
  }
  12% {
    opacity: 1;
  }
  88% {
    opacity: 1;
  }
  100% {
    top: 110%;
    opacity: 0;
  }
}

/* 悬停时叠加的 About 图层错位出红/蓝图影（RGB 分离感）；
   点击故障期间由 JS 内联 transform 接管，互不冲突 */
.header-container:hover .header:nth-child(2) {
  color: rgba(255, 0, 80, 0.55);
  transform: translateX(3px);
}

.header-container:hover .header:nth-child(3) {
  color: rgba(0, 200, 255, 0.55);
  transform: translateX(-3px);
}

.container {
  position: relative;
  width: 45rem;
  height: 25rem;
  margin-top: 10rem;
}

.poker,
.poker_top {
  position: absolute;
  width: 20rem;
  height: 26rem;
  box-shadow: -5px -7px 5px rgba(130, 130, 130, 0.5);
  border-radius: 1.5rem;
  background: var(--about-card);
  transform-origin: bottom left;
}

/* 双面牌：overflow / backdrop-filter 会把 preserve-3d 压扁，
   裁切与毛玻璃必须下放到各个 face 上；顶牌无 3D 子元素，留在自身 */
.poker {
  cursor: pointer;
  transition: filter 0.3s ease, transform 0.3s ease;
  transform-style: preserve-3d;
}

.poker_top {
  overflow: hidden;
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  transition: 0.3s ease;
  cursor: pointer;
  z-index: 1000;
}

.poker:hover {
  filter: brightness(1.2);
  /* 悬浮抽出时的主题光晕（位移由 JS 沿卡片自身朝向设置） */
  box-shadow:
    0 20px 60px rgba(0, 0, 0, 0.28),
    0 0 28px var(--primary-light);
}

/* 正反两面绝对定位铺满，各带 backface-visibility：
   每个面只在朝向观众时物理可见，翻面任意速度下正反面文字都不会互透 */
.card-face {
  position: absolute;
  inset: 0;
  border-radius: 1.5rem;
  overflow: hidden;
  background: var(--about-card);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
}

.card-back {
  transform: rotateY(180deg);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2.6rem 2rem 2rem;
}

.back-title {
  font-size: 1.9rem;
  font-weight: 900;
  background: var(--gradient-primary);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  filter: drop-shadow(0 0 1.2rem rgba(167, 254, 215, 0.45));
  margin-bottom: 0.4rem;
}

.back-desc {
  font-size: 0.95rem;
  line-height: 1.6;
  color: var(--text-secondary);
  text-align: center;
  margin-bottom: 0.9rem;
}

.back-tags {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.45rem;
  margin-bottom: 0.8rem;
}

.back-tag {
  padding: 0.28rem 0.75rem;
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--primary-dark);
  background: rgba(167, 254, 215, 0.14);
  border: 1px solid var(--primary-color);
  border-radius: 2rem;
  box-shadow: 0 0 8px rgba(167, 254, 215, 0.25);
  white-space: nowrap;
}

.back-divider {
  width: 82%;
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--primary-color), transparent);
  margin-bottom: 0.8rem;
}

.back-details {
  font-size: 0.82rem;
  line-height: 1.95;
  color: var(--text-secondary);
  text-align: justify;
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding: 0 0.2rem;
  scrollbar-width: none;
}

.poker .card-content {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding-left: 3rem;
}

.poker .vertical-text {
  display: flex;
  flex-direction: column;
  gap: 1vmin;
}

.poker .vertical-text span {
  font-size: 10vmin;
  font-weight: 900;
  /* 浅色模式牌面为白色，文字用黑色保证可读 */
  color: #17222c;
  text-shadow: 0 0 1vmin rgba(255, 255, 255, 0.45);
  line-height: 1;
  display: block;
}

/* 深色模式覆盖为白字：作用域只给末段 span 加 [data-v]，.dark(html) 作为祖先限定符直接可用 */
.dark .poker .vertical-text span {
  color: #fff;
  text-shadow: 0 0 1vmin rgba(0, 0, 0, 0.5);
}

/* 顶牌上的书法条幅装饰（装裱卷轴风，跟随主题色） */
.mount {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1.2rem;
  padding: 0 1rem;
  pointer-events: none;
}

/* 去掉横幅边框与黄条，书法图片直接浮在牌面上 */
.strip {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 74%;
  max-width: 42%;
  padding: 0;
}

.strip-left {
  transform: translateY(-1.5rem);
}

.strip-right {
  transform: translateY(1.5rem);
}

.strip img {
  height: 100%;
  max-width: 100%;
  width: auto;
  display: block;
  object-fit: contain;
  transition: transform 0.3s ease;
}

/* 朱红印章（受命于天图片） */
.seal {
  flex-shrink: 0;
  width: 3.6rem;
  height: 3.6rem;
  display: flex;
  align-items: center;
  justify-content: center;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.28));
}

.seal img {
  width: 100%;
  height: 100%;
  display: block;
  object-fit: contain;
}

.poker1 {
  transform: rotate(-10deg);
}

.poker2 {
  transform: rotate(-6deg) translate(35%, -12%);
}

.poker3 {
  transform: rotate(-2deg) translate(65%, -19%);
}

.poker4 {
  transform: rotate(2deg) translate(95%, -26%);
}

.poker5 {
  transform: rotate(6deg) translate(125%, -23%);
}

/* 抽牌遮罩：落牌后压暗页面，点击任意处原路放回（无关闭按钮） */
.flight-overlay {
  position: fixed;
  inset: 0;
  background: rgba(5, 9, 13, 0.55);
  z-index: 3500;
  cursor: pointer;
  opacity: 0;
}

@media (max-width: 768px) {
  /* 移动端地址栏收起/展开时避免高度跳动 */
  .about {
    min-height: 100svh;
    min-height: 100dvh;
  }

  .header {
    font-size: 2.5rem;
  }
  
  .container {
    width: 90vw;
    height: 50vw;
  }
  
  .poker,
  .poker_top {
    width: 40vw;
    height: 52vw;
  }
  
  .poker .vertical-text span {
    font-size: 15vw;
  }

  .mount {
    gap: 0.8rem;
    padding: 0 0.6rem;
  }

  .strip {
    height: 66%;
  }

  .strip-left {
    transform: translateY(-1rem);
  }

  .strip-right {
    transform: translateY(1rem);
  }

  /* 小屏时缩小印章，保证两条幅并排放得下 */
  .seal {
    width: 2.2rem;
    height: 2.2rem;
  }

  /* 小屏牌面宽 40vw：牌背文字按牌宽等比缩放
    （桌面 rem 值以 20rem 牌宽标定，比例一一对应） */
  .card-back {
    padding: 5vw 4vw 4vw;
  }

  .back-title {
    font-size: 3.7vw;
    margin-bottom: 1.2vw;
  }

  .back-desc {
    font-size: 1.85vw;
    margin-bottom: 2.2vw;
  }

  .back-tags {
    gap: 1vw;
    margin-bottom: 2.2vw;
  }

  .back-tag {
    font-size: 1.5vw;
    padding: 0.6vw 1.6vw;
  }

  .back-divider {
    margin-bottom: 2.2vw;
  }

  .back-details {
    font-size: 1.6vw;
    line-height: 2;
  }
}
</style>

<style>
/* 抽牌飞行的克隆牌挂在 body 下（脱离组件容器），需全局样式。
   克隆同时保有 .poker 类，scoped 的 .poker[data-v] 特异度更高，
   position/left 等必须 !important 才能压过 absolute 定位——否则固定定位失效，
   坐标按视口算、渲染按文档流走，页面滚得越多牌偏得越远 */
.about-flight-card {
  position: fixed !important;
  left: 0 !important;
  top: 0 !important;
  margin: 0;
  z-index: 3600;
  cursor: pointer;
  will-change: transform;
  /* 掐掉 scoped .poker 继承的 transform 过渡：GSAP 逐帧写内联 transform，
     叠 CSS transition 会逐帧插值拖尾，动画发粘失真 */
  transition: none !important;
}

/* 飞行/翻面展示态不吃牌堆的悬停增亮与光晕（指针划过翻开的牌会闪，
   与翻面效果冲突），改用恒定的悬浮投影 */
.about-flight-card,
.about-flight-card:hover {
  filter: none !important;
  box-shadow: 0 24px 80px rgba(0, 0, 0, 0.45) !important;
}
</style>

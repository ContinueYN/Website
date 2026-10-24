<template>
  <Teleport to="body">
    <div class="glitch-storm" :class="{ 'glitch-leaving': leaving }" aria-hidden="true">
      <!-- 蓝粉渐变基底：与马赛克（skyBlue→pinkPurple）同色系，从透明渐浓到不透明，
           实现「逐渐闪烁成蓝粉背景」，并遮住回归版 cluster-intro 的 WebGPU 初始化黑屏空档 -->
      <div class="glitch-base"></div>
      <div ref="slicesRef" class="glitch-slices"></div>
      <div class="glitch-scanlines"></div>
      <div class="glitch-flash"></div>
      <div class="glitch-vignette"></div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'

/**
 * GlitchStorm —— 全站故障闪烁覆盖层（Teleport 到 body，独立于 #app 渲染）
 *
 * About 标题连点 3 次后由 App.vue 挂载，两层手段叠加制造「整页被撕碎」的错乱感：
 *  1. 覆盖层：横竖不一的不透明撕裂条（黑色条遮住内容 = 页面被撕掉一块）+
 *     彩色错位条 + 扫描线 + 频闪 + 蓝粉基底渐浓
 *  2. 页面本体：前 600ms 给 #app 逐帧随机滤镜（invert/hue-rotate/高对比），
 *     整个页面真实闪变（600ms 后清除，避开 650ms 挂载的回归转场，不破坏 fixed 定位）
 *
 * 回归版 ClusterIntro 首帧就绪时宿主置 leaving=true 淡出本层，
 * 露出满屏马赛克反向拼回 3D 小球。
 */
defineProps<{ leaving?: boolean }>()

const slicesRef = ref<HTMLElement | null>(null)
let timer = 0
let appEl: HTMLElement | null = null
let t0 = 0

const SLICE_COUNT = 14
/** 撕裂条配色：黑/白为主（不透明→视觉等同撕掉内容），青/品红半透明作 RGB 错乱 */
const SLICE_COLORS = [
  'rgba(0, 0, 0, 0.9)',
  'rgba(0, 0, 0, 0.65)',
  'rgba(255, 255, 255, 0.65)',
  'rgba(0, 255, 255, 0.3)',
  'rgba(255, 0, 255, 0.3)',
  'rgba(0, 255, 128, 0.2)',
]
/** 页面本体滤镜帧序列：none 占比最高，避免连帧过曝 */
const APP_FILTERS = [
  'none',
  'none',
  'none',
  'invert(1) hue-rotate(90deg)',
  'invert(1) hue-rotate(90deg)',
  'hue-rotate(180deg) saturate(3)',
  'contrast(2.2) brightness(1.4)',
]

function rand(n: number) {
  return Math.random() * n
}

function pick<T>(arr: readonly T[]): T {
  return arr[Math.floor(rand(arr.length))] as T
}

onMounted(() => {
  const host = slicesRef.value
  if (!host) return
  appEl = document.getElementById('app')
  t0 = Date.now()

  const slices: HTMLElement[] = []
  for (let i = 0; i < SLICE_COUNT; i++) {
    const el = document.createElement('div')
    el.className = 'glitch-slice'
    host.appendChild(el)
    slices.push(el)
  }

  timer = window.setInterval(() => {
    for (const el of slices) {
      // 部分条随机隐藏，避免每帧满屏糊死
      if (Math.random() < 0.3) {
        el.style.opacity = '0'
        continue
      }
      el.style.opacity = String(0.7 + rand(0.3))
      // 横竖不一：55% 全宽横条，45% 全高竖条
      if (Math.random() < 0.55) {
        el.style.left = '0'
        el.style.right = '0'
        el.style.top = `${rand(98)}%`
        el.style.bottom = ''
        el.style.width = ''
        el.style.height = `${1.5 + rand(8)}%`
        el.style.transform = `translateX(${rand(40) - 20}px)`
      } else {
        el.style.top = '0'
        el.style.bottom = '0'
        el.style.left = `${rand(98)}%`
        el.style.right = ''
        el.style.height = ''
        el.style.width = `${0.5 + rand(3.5)}%`
        el.style.transform = `translateY(${rand(40) - 20}px)`
      }
      // 小概率出现巨型黑条：整块内容瞬间被「撕掉」
      if (Math.random() < 0.08) {
        el.style.left = '0'
        el.style.right = '0'
        el.style.top = `${rand(70)}%`
        el.style.bottom = ''
        el.style.width = ''
        el.style.height = `${20 + rand(35)}%`
        el.style.background = 'rgba(5, 5, 20, 0.95)'
        el.style.opacity = '1'
      } else {
        el.style.background = pick(SLICE_COLORS)
      }
    }
    // 页面本体滤镜闪变：仅前 600ms（ClusterIntro 650ms 才挂载，不破坏其 fixed 定位）
    if (appEl) {
      if (Date.now() - t0 < 600) {
        appEl.style.filter = pick(APP_FILTERS)
      } else {
        appEl.style.filter = ''
      }
    }
  }, 55)
})

onBeforeUnmount(() => {
  window.clearInterval(timer)
  if (appEl) appEl.style.filter = ''
})
</script>

<style scoped>
.glitch-storm {
  position: fixed;
  inset: 0;
  /* 比回归版 cluster-intro(9998) 高一层：马赛克首帧就绪后从上层淡出，完成「碎开」交接 */
  z-index: 9999;
  pointer-events: none;
  overflow: hidden;
  transition: opacity 0.45s ease;
}

.glitch-storm.glitch-leaving {
  opacity: 0;
}

/* 渐入时序对齐回归流程：650ms 挂载转场 + WebGPU 初始化，~1.3s 完全不透明 */
.glitch-base {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, #87ceeb 0%, #dea3eb 100%);
  opacity: 0;
  animation: glitch-base-in 1.3s ease-in forwards;
}

.glitch-slices {
  position: absolute;
  inset: 0;
}

.glitch-slice {
  position: absolute;
  will-change: transform, opacity;
}

.glitch-scanlines {
  position: absolute;
  inset: -10% 0;
  background: repeating-linear-gradient(
    0deg,
    rgba(255, 255, 255, 0.06) 0 1px,
    transparent 1px 4px
  );
  animation: glitch-scan-drift 0.5s linear infinite;
}

.glitch-flash {
  position: absolute;
  inset: 0;
  background: rgba(0, 255, 255, 0.1);
  animation: glitch-flash-flicker 0.42s steps(1) infinite;
}

.glitch-vignette {
  position: absolute;
  inset: 0;
  box-shadow:
    inset 0 0 120px rgba(0, 255, 255, 0.18),
    inset 0 0 60px rgba(255, 0, 255, 0.12);
}

@keyframes glitch-scan-drift {
  from {
    transform: translateY(0);
  }
  to {
    transform: translateY(16px);
  }
}

@keyframes glitch-base-in {
  0% {
    opacity: 0;
  }
  40% {
    opacity: 0.3;
  }
  70% {
    opacity: 0.75;
  }
  100% {
    opacity: 1;
  }
}

@keyframes glitch-flash-flicker {
  0% {
    opacity: 0.55;
  }
  22% {
    opacity: 0;
  }
  26% {
    opacity: 0.8;
    background: rgba(255, 0, 255, 0.12);
  }
  30% {
    opacity: 0;
  }
  62% {
    opacity: 0.5;
    background: rgba(255, 255, 255, 0.08);
  }
  66% {
    opacity: 0;
  }
  100% {
    opacity: 0.4;
  }
}
</style>

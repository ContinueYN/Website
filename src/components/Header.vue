<template>
  <header class="header" :class="{ scrolled: isScrolled }">

    <!-- 液态玻璃 dock：初始仅一枚无背景的主题圆钮悬于顶部中心；
         指针进入后玻璃底浮现并向两侧延展出标签（左三右三夹住圆钮），
         下方再垂下一块液态玻璃面板展示诗句；
         滚动进度以圆环形式绕主题圆钮绘制 -->
    <nav
      class="nav-dock"
      :class="{ open: dockOpen }"
      @pointerenter="onDockPointerEnter"
      @pointerleave="onDockPointerLeave"
      @focusin="dockOpen = true"
      @focusout="onDockFocusOut"
    >
      <div class="dock-bar">
        <div class="dock-group left">
          <RouterLink to="/" class="dock-link" @click="onHomeClick">首页</RouterLink>
          <a href="#about" class="dock-link" @click.prevent="goSection('#about')">关于</a>
          <a href="#skills" class="dock-link" @click.prevent="goSection('#skills')">技能</a>
        </div>

        <button
          @click="onThemeClick"
          @pointerdown="onThemePointerDown"
          class="theme-toggle"
          aria-label="切换主题"
          :class="{ 'animating': isAnimating }"
        >
          <svg class="progress-ring" viewBox="0 0 100 100" aria-hidden="true">
            <defs>
              <linearGradient id="dockRingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" class="ring-stop-a" />
                <stop offset="55%" class="ring-stop-b" />
                <stop offset="100%" class="ring-stop-c" />
              </linearGradient>
            </defs>
            <circle class="ring-track" cx="50" cy="50" r="46" />
            <circle class="ring-fill" cx="50" cy="50" r="46" :style="ringStyle" />
          </svg>
          <div class="theme-icon-image">
            <img :src="currentIcon" :alt="isDark ? '切换到日间模式' : '切换到夜间模式'" class="theme-icon current" loading="lazy">
            <img :src="isDark ? lightIcon : darkIcon" :alt="isDark ? '日间模式' : '夜间模式'" class="theme-icon next" loading="lazy">
          </div>
        </button>

        <div class="dock-group right">
          <a href="#projects" class="dock-link" @click.prevent="goSection('#projects')">项目</a>
          <a href="#contact" class="dock-link" @click.prevent="goSection('#contact')">联系</a>
          <RouterLink to="/blog" class="dock-link" @click="onNavLink">文章</RouterLink>
        </div>
      </div>

      <div class="dock-panel">
        <div class="dock-panel-inner">
          <div class="dock-panel-card">
            <span class="poem-mark" aria-hidden="true">「</span>
            <p class="dock-poem">{{ poemContent || '行到水穷处，坐看云起时' }}</p>
            <span class="poem-mark" aria-hidden="true">」</span>
          </div>
        </div>
      </div>
    </nav>
  </header>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, computed } from 'vue'
import { RouterLink } from 'vue-router'

// 导入图片
import lightIcon from '../assets/images/light.png'
import darkIcon from '../assets/images/dark.png'

// 平滑滚动到指定元素
const scrollToSection = (sectionId) => {
  // 检查当前是否在首页
  if (window.location.pathname !== '/') {
    // 如果不在首页，先导航到首页，然后在页面加载后滚动到指定部分
    window.location.href = `/#${sectionId.substring(1)}`
  } else {
    // 如果在首页，直接滚动到指定部分
    const element = document.querySelector(sectionId)
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      })
    }
  }
}

const props = defineProps({
  isDark: Boolean
})

const emit = defineEmits(['toggle-theme'])

const dockOpen = ref(false)
const poemContent = ref('')
const isAnimating = ref(false)
const scrollProgress = ref(0)
const isScrolled = ref(false)

// 是否支持 hover：决定交互模型（悬停展开 vs 点按展开）
const canHover = ref(true)
let dockEl = null

// 计算当前显示的图标
const currentIcon = computed(() => {
  return props.isDark ? darkIcon : lightIcon
})

// 滚动进度圆环：绕主题圆钮一圈，dashoffset 随进度缩短
const RING_C = 2 * Math.PI * 46
const ringStyle = computed(() => ({
  strokeDasharray: `${RING_C}`,
  strokeDashoffset: `${RING_C * (1 - scrollProgress.value / 100)}`
}))

// ---------- dock 交互 ----------
// 指针设备：圆钮点击 = 切主题，展开交给 hover / 键盘焦点；
// 触屏设备：首次点按圆钮 = 展开，展开后再点 = 切主题，点外部 / 点链接 = 收起
const onThemeClick = () => {
  if (!canHover.value && !dockOpen.value) {
    dockOpen.value = true
    suppressThemeOnce = false
    return
  }
  if (suppressThemeOnce) {
    // 本次点按只负责展开（focusin 已把 dock 打开），不切主题
    suppressThemeOnce = false
    return
  }
  handleThemeToggle()
}

// 触屏首次点按圆钮：pointerdown → focusin（展开）→ click，
// 用此标记让 click 跳过切主题，只保留展开
let suppressThemeOnce = false

const onThemePointerDown = (e) => {
  if (!canHover.value && !dockOpen.value && e.pointerType === 'touch') {
    suppressThemeOnce = true
  }
}

const onDockPointerEnter = (e) => {
  if (e.pointerType !== 'touch') dockOpen.value = true
}

const onDockPointerLeave = (e) => {
  if (e.pointerType !== 'touch') dockOpen.value = false
}

const onDockFocusOut = (e) => {
  if (!e.currentTarget.contains(e.relatedTarget)) dockOpen.value = false
}

const goSection = (sectionId) => {
  scrollToSection(sectionId)
  if (!canHover.value) dockOpen.value = false
}

// 首页标签兼顔回顶职责：已在首页时点击平滑回顶（替代被删除的回顶按钮），
// 在其他页面则交给路由正常跳转
const onHomeClick = (e) => {
  if (window.location.pathname === '/') {
    e.preventDefault()
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
  if (!canHover.value) dockOpen.value = false
}

const onNavLink = () => {
  if (!canHover.value) dockOpen.value = false
}

// 触屏：点按 dock 之外收起
const onDocPointerDown = (e) => {
  if (dockOpen.value && dockEl && !dockEl.contains(e.target)) {
    dockOpen.value = false
    suppressThemeOnce = false
  }
}

// 修改主题切换处理函数
const handleThemeToggle = () => {
  if (isAnimating.value) return // 如果正在动画中，不执行

  isAnimating.value = true
  emit('toggle-theme')

  // 动画持续时间与CSS中保持一致
  setTimeout(() => {
    isAnimating.value = false
  }, 300) // 300ms与CSS transition时间匹配
}

// 加载诗词
const loadPoem = () => {
  if (window.jinrishici) {
    window.jinrishici.load(result => {
      poemContent.value = result.data.content
    })
  }
}

// 动态加载诗词SDK
const loadPoemSDK = () => {
  // 防止组件重复挂载时重复注入脚本
  if (window.jinrishici || document.querySelector('script[data-poem-sdk]')) {
    loadPoem()
    return
  }

  const script = document.createElement('script')
  script.src = 'https://sdk.jinrishici.com/v2/browser/jinrishici.js'
  script.charset = 'utf-8'
  script.dataset.poemSdk = ''
  script.onload = () => {
    loadPoem()
  }
  script.onerror = () => {
    // 加载失败时保持默认文案，不阻塞导航栏
  }
  document.head.appendChild(script)
}

const onScroll = () => {
  isScrolled.value = window.scrollY > 10

  // 计算滚动进度（圆环绕主题圆钮绘制）
  const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight
  const scrolled = (window.scrollY / windowHeight) * 100
  scrollProgress.value = Math.min(100, Math.max(0, scrolled))
}

onMounted(() => {
  loadPoemSDK()

  canHover.value = window.matchMedia('(hover: hover)').matches
  dockEl = document.querySelector('.nav-dock')

  window.addEventListener('scroll', onScroll, { passive: true })
  document.addEventListener('pointerdown', onDocPointerDown)
  onScroll()
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll)
  document.removeEventListener('pointerdown', onDocPointerDown)
})
</script>

<style scoped>
.header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  background: transparent;
  z-index: 3000;
  animation: appear 2s ease 0.1s 1 normal backwards;
  /* 顶栏大部分是透明留白，不拦截下方内容的点击；交互元素各自恢复 */
  pointer-events: none;
}

@keyframes appear {
  0% {
    opacity: 0;
    transform: translateY(-50px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

/* ---------- dock 容器：宽度和居中都由内容驱动，
   标签延展时每帧重排 margin auto 始终保持顶部居中，向两边对称生长 ---------- */
.nav-dock {
  position: relative;
  width: fit-content;
  margin: 0.9rem auto 0;
  pointer-events: auto;
}

.dock-bar {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.3rem;
  border-radius: 999px;
  transition: padding 0.55s cubic-bezier(0.22, 1, 0.36, 1);
}

.nav-dock.open .dock-bar {
  padding: 0.35rem 1.05rem;
}

/* 滚动后给收起态一枚淡玻璃小圆片，保证圆钮悬浮在内容上方仍可读；
   顶部初始（未滚动、未展开）保持完全无背景 */
.header.scrolled .dock-bar::before {
  opacity: 0.4;
}

/* 液态玻璃底：磨砂 + 半透明渐变边 + 高光描边，透明度渐入即"浮现" */
.dock-bar::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: var(--glass-bg);
  -webkit-backdrop-filter: blur(18px) saturate(1.6);
  backdrop-filter: blur(18px) saturate(1.6);
  border: 1px solid var(--glass-border);
  box-shadow: 0 4px 16px rgba(15, 23, 42, 0.08),
              inset 0 1px 0 rgba(255, 255, 255, 0.35);
  opacity: 0;
  transition: opacity 0.45s ease;
  pointer-events: none;
}

/* 顶部镜面高光：液态玻璃的反光条 */
.dock-bar::after {
  content: '';
  position: absolute;
  top: 2px;
  left: 12%;
  right: 12%;
  height: 34%;
  border-radius: 999px;
  background: linear-gradient(to bottom, rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0));
  opacity: 0;
  transition: opacity 0.5s ease 0.08s;
  pointer-events: none;
}

.nav-dock.open .dock-bar::before {
  opacity: 1;
}

.nav-dock.open .dock-bar::after {
  opacity: 0.6;
}

/* ---------- 标签：收起时宽度归零（不占位），展开时由内向外逐个弹出 ---------- */
.dock-group {
  display: flex;
  align-items: center;
}

.dock-link {
  display: flex;
  align-items: center;
  white-space: nowrap;
  max-width: 0;
  padding-inline: 0;
  opacity: 0;
  overflow: hidden;
  pointer-events: none;
  text-decoration: none;
  color: var(--text-secondary);
  font-weight: 500;
  font-size: 0.95rem;
  transition:
    max-width 0.55s cubic-bezier(0.22, 1, 0.36, 1),
    padding 0.55s cubic-bezier(0.22, 1, 0.36, 1),
    opacity 0.32s ease,
    transform 0.55s cubic-bezier(0.22, 1, 0.36, 1),
    color 0.25s ease,
    filter 0.3s ease;
}

/* 左侧标签从圆钮方向滑出，右侧镜像，形成"向两边延展"的动势 */
.dock-group.left .dock-link {
  transform: translateX(18px);
}

.dock-group.right .dock-link {
  transform: translateX(-18px);
}

.nav-dock.open .dock-link {
  max-width: 6rem;
  padding-inline: 0.95rem;
  opacity: 1;
  transform: translateX(0);
  pointer-events: auto;
}

/* 电脑端：标签默认重模糊成"点"，指针扫过才对焦显示文字；
   触屏没有 hover，保持清晰可读。filter 不参与弹出 stagger（延迟恒 0） */
@media (hover: hover) {
  .nav-dock.open .dock-link {
    filter: blur(5px);
  }

  .nav-dock.open .dock-link:hover,
  .nav-dock.open .dock-link:focus-visible {
    filter: blur(0);
  }
}

/* 逐个弹出：紧邻圆钮的先出现，最外侧最后，两侧对称 */
.nav-dock.open .dock-group.left .dock-link:nth-child(3),
.nav-dock.open .dock-group.right .dock-link:nth-child(1) {
  transition-delay: 0.05s, 0.05s, 0.09s, 0.05s, 0s, 0s;
}

.nav-dock.open .dock-group.left .dock-link:nth-child(2),
.nav-dock.open .dock-group.right .dock-link:nth-child(2) {
  transition-delay: 0.12s, 0.12s, 0.16s, 0.12s, 0s, 0s;
}

.nav-dock.open .dock-group.left .dock-link:nth-child(1),
.nav-dock.open .dock-group.right .dock-link:nth-child(3) {
  transition-delay: 0.19s, 0.19s, 0.23s, 0.19s, 0s, 0s;
}

.nav-dock.open .dock-link:hover {
  color: var(--primary-color);
}

/* ---------- 主题圆钮：收起态的主角 ---------- */
.theme-toggle {
  position: relative;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.4rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: transform 0.3s ease;
}

.theme-toggle:hover {
  transform: scale(1.1);
}

/* 滚动进度圆环：绕圆钮一圈，从 12 点方向顺时针增长；
   底轨保持极淡，滚动时渐变弧线覆盖上来 */
.progress-ring {
  position: absolute;
  inset: -6px;
  width: calc(100% + 12px);
  height: calc(100% + 12px);
  transform: rotate(-90deg);
  pointer-events: none;
  overflow: visible;
}

.progress-ring circle {
  fill: none;
  stroke-width: 4;
}

.ring-track {
  stroke: var(--primary-color);
  opacity: 0.14;
}

.ring-fill {
  stroke: url(#dockRingGrad);
  stroke-linecap: round;
  transition: stroke-dashoffset 0.15s linear;
}

.ring-stop-a { stop-color: #0e9f8e; }
.ring-stop-b { stop-color: #22c3a6; }
.ring-stop-c { stop-color: #f6b93b; }

.dark .ring-stop-a { stop-color: #8b5cf6; }
.dark .ring-stop-b { stop-color: #a78bfa; }
.dark .ring-stop-c { stop-color: #fbbf24; }

/* 主题切换按钮动画状态 */
.theme-toggle.animating {
  pointer-events: none;
}

.theme-toggle.animating .theme-icon.current {
  transform: scale(0.7) !important;
  opacity: 0 !important;
}

.theme-toggle.animating .theme-icon.next {
  opacity: 1 !important;
  transform: scale(1.5) !important;
}

/* 主题图标容器 */
.theme-icon-image {
  position: relative;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 主题图标样式 */
.theme-icon {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: contain;
  transition: all 0.3s ease;
}

/* 当前显示的图标 - 悬浮效果 */
.theme-icon.current {
  opacity: 1;
  transform: scale(1) rotate(0deg);
}

.theme-toggle:hover .theme-icon.current {
  transform: scale(1.2) rotate(15deg);
  filter: brightness(0.4) contrast(1.2);
}

/* 下一个图标切换效果 */
.theme-icon.next {
  opacity: 0;
  transform: scale(1);
}

/* 点击时的切换效果 */
.theme-toggle:active .theme-icon.current {
  opacity: 0;
  transform: scale(0.7);
}

.theme-toggle:active .theme-icon.next {
  opacity: 1;
  transform: scale(1.5);
}

/* ---------- 诗句面板：从横条下方"滴落"的液态玻璃 ----------
   grid 0fr→1fr 撑开高度；卡片自带 margin-top 的空隙
   属于 hover 容器的盒子，指针从横条移到面板不会中途收起 */
.dock-panel {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.14s;
}

.nav-dock.open .dock-panel {
  grid-template-rows: 1fr;
}

.dock-panel-inner {
  min-height: 0;
  overflow: hidden;
  display: flex;
  justify-content: center;
}

.dock-panel-card {
  position: relative;
  margin-top: 0.6rem;
  max-width: min(78vw, 620px);
  padding: 0.85rem 1.7rem;
  border-radius: 22px;
  background: var(--glass-bg);
  -webkit-backdrop-filter: blur(22px) saturate(1.5);
  backdrop-filter: blur(22px) saturate(1.5);
  border: 1px solid var(--glass-border);
  box-shadow: 0 6px 22px rgba(15, 23, 42, 0.1),
              inset 0 1px 0 rgba(255, 255, 255, 0.3);
  display: flex;
  align-items: baseline;
  justify-content: center;
  gap: 0.4rem;
  transform-origin: 50% 0;
  opacity: 0;
  transform: translateY(-12px) scaleY(0.92);
  filter: blur(5px);
  transition:
    opacity 0.4s ease 0.18s,
    transform 0.55s cubic-bezier(0.22, 1, 0.36, 1) 0.18s,
    filter 0.45s ease 0.18s;
}

.nav-dock.open .dock-panel-card {
  opacity: 1;
  transform: none;
  filter: none;
}

.dock-poem {
  margin: 0;
  font-size: 1.02rem;
  letter-spacing: 0.12em;
  line-height: 1.7;
  text-align: center;
  color: var(--text-primary);
  font-family: 'Kaiti SC', 'STKaiti', 'KaiTi', 'Noto Serif SC', serif;
}

.poem-mark {
  color: var(--primary-color);
  font-size: 0.9rem;
  opacity: 0.8;
  font-family: 'Kaiti SC', 'STKaiti', 'KaiTi', 'Noto Serif SC', serif;
}

/* ---------- 深色模式 ---------- */
.dark .dock-bar::before {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.28),
              inset 0 1px 0 rgba(255, 255, 255, 0.1);
}

.dark .dock-bar::after {
  background: linear-gradient(to bottom, rgba(255, 255, 255, 0.26), rgba(255, 255, 255, 0));
}

.dark .dock-panel-card {
  box-shadow: 0 6px 22px rgba(0, 0, 0, 0.3),
              inset 0 1px 0 rgba(255, 255, 255, 0.08);
}

/* ---------- 移动端：dock 改为纵向堆叠（圆钮在上，标签两行三列），点按展开 ---------- */
@media (max-width: 768px) {
  .nav-dock {
    margin-top: 0.6rem;
  }

  .dock-bar {
    flex-direction: column;
    border-radius: 30px;
  }

  /* 圆钮置顶，两组标签在其下各占一行、居中换行 */
  .dock-bar .theme-toggle {
    order: -1;
  }

  .dock-group {
    flex-wrap: wrap;
    justify-content: center;
  }

  .dock-group .dock-link {
    font-size: 0.92rem;
  }

  .nav-dock.open .dock-group .dock-link {
    max-width: 5.5rem;
    padding-inline: 0.55rem;
  }

  .nav-dock.open .dock-bar {
    padding: 0.45rem 0.7rem;
  }

  .dock-panel-card {
    padding: 0.7rem 1.1rem;
    border-radius: 18px;
  }

  .dock-poem {
    font-size: 0.92rem;
  }

  .theme-icon-image {
    width: 28px;
    height: 28px;
  }
}

/* 减少动态：所有 dock 过渡就近乎瞬时完成 */
@media (prefers-reduced-motion: reduce) {
  .dock-bar,
  .dock-bar::before,
  .dock-bar::after,
  .dock-link,
  .dock-panel,
  .dock-panel-card {
    transition-duration: 0.01ms !important;
    transition-delay: 0s !important;
  }
}
</style>

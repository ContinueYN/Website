<template>
  <section id="skills" class="skills">
    <div class="container">
      <p class="skills-overline">MY SKILLS</p>

      <!-- 帷幕舞台 -->
      <div
        ref="stageRef"
        class="curtain-stage"
        :class="{ open: isOpen, visible: isVisible }"
        @mouseenter="isOpen = true"
        @mouseleave="isOpen = false"
        @click="toggleCurtain"
      >
        <!-- 中心 SKILL 大字（帷幕展开后浮现，点击启动终端） -->
        <div class="curtain-center">
          <button
            type="button"
            class="curtain-title"
            :class="{ 'is-open': isOpen }"
            @click.stop="openTerminal"
            aria-label="启动技能终端"
          >
            <span class="curtain-title-text">SKILL</span>
            <span class="curtain-title-hint">点击启动技能终端</span>
          </button>
        </div>

        <!-- 四片帷幕 -->
        <div class="curtain-panel panel-b" aria-hidden="true"></div>
        <div class="curtain-panel panel-c" aria-hidden="true"></div>
        <div class="curtain-panel panel-d" aria-hidden="true"></div>
        <div class="curtain-panel panel-e" aria-hidden="true"></div>
      </div>
    </div>

    <!-- 技能终端：CRT 开机动画 + 居中输出 + 命令交互 -->
    <Teleport to="body">
      <Transition name="term" :duration="{ enter: 520, leave: 320 }">
        <div v-if="terminalVisible" class="term-root">
          <!-- 深空遮罩：点击空白处关闭 -->
          <div class="term-mask" @click="closeTerminal" aria-hidden="true"></div>

          <div
            class="term-window"
            role="dialog"
            aria-modal="true"
            aria-label="技能终端"
            @click="onWindowClick"
          >
            <!-- 四角 HUD 括号 -->
            <i class="hud hud-tl" aria-hidden="true"></i>
            <i class="hud hud-tr" aria-hidden="true"></i>
            <i class="hud hud-bl" aria-hidden="true"></i>
            <i class="hud hud-br" aria-hidden="true"></i>

            <!-- 顶栏：快捷关闭按钮位于正中间 -->
            <header class="term-header">
              <span class="term-header-tag tag-left">yuno@sys · ~/skills</span>
              <i class="term-header-line line-left" aria-hidden="true"></i>
              <button
                type="button"
                class="term-close"
                @click.stop="closeTerminal"
                aria-label="关闭终端"
              >
                ×
              </button>
              <i class="term-header-line line-right" aria-hidden="true"></i>
              <span class="term-header-tag tag-right">UTF-8 · ZSH</span>
            </header>

            <!-- 屏幕：扫描线 + 巡逻光束 + 居中内容 -->
            <div class="term-screen">
              <div class="term-body" ref="bodyRef" @wheel.passive="scrollStick" @touchmove.passive="scrollStick">
                <div
                  v-for="(line, i) in lines"
                  :key="i"
                  class="term-line"
                  :class="'t-' + line.t"
                >
                  <template v-if="line.t === 'rule'">
                    <span class="term-rule" aria-hidden="true"></span>
                  </template>
                  <template v-else-if="line.t === 'kv'">
                    <span class="term-kv-k">{{ line.key }}</span>
                    <span class="term-kv-v">{{ line.val }}</span>
                  </template>
                  <template v-else-if="line.t === 'item'">
                    <span class="term-item-k">{{ line.key }}</span>
                    <span class="term-item-v">{{ line.text }}</span>
                  </template>
                  <template v-else-if="line.t === 'in'">
                    <span class="term-in-prompt">visitor@yuno:~$</span>
                    <span class="term-in-cmd">{{ line.text }}</span>
                  </template>
                  <template v-else>
                    <span v-if="line.label" class="term-line-label">{{ line.label }}</span>
                    <span class="term-line-text">{{ line.text }}</span>
                  </template>
                </div>
              </div>

              <!-- 输入行（同样居中） -->
              <div class="term-input-row" :class="{ muted: !bootDone }">
                <span class="term-prompt">visitor@yuno<span class="term-prompt-sep">:~$</span></span>
                <input
                  ref="inputRef"
                  v-model="inputText"
                  class="term-input"
                  type="text"
                  :disabled="!bootDone"
                  placeholder="help"
                  autocomplete="off"
                  autocapitalize="off"
                  spellcheck="false"
                  aria-label="终端命令输入"
                  @keydown="onInputKeydown"
                />
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </section>
</template>

<script setup>
import { ref, nextTick, onMounted, onBeforeUnmount } from 'vue'
import { useScrollLock } from '../composables/useScrollLock'

const { lock: lockScroll, unlock: unlockScroll } = useScrollLock()

const stageRef = ref(null)
const isOpen = ref(false)
const isVisible = ref(false)

// ============ 终端状态 ============
const terminalVisible = ref(false)
const bootDone = ref(false)
const lines = ref([])
const inputText = ref('')
const bodyRef = ref(null)
const inputRef = ref(null)
const history = ref([])
const historyIndex = ref(0)

const pad = (n) => String(n).padStart(2, '0')
const prefersReducedMotion = () =>
  window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches

// 会话号：每次开/关终端自增，让进行中的异步打字链失效
let session = 0
const timers = new Set()
const later = (fn, ms) => {
  const id = setTimeout(() => {
    timers.delete(id)
    fn()
  }, ms)
  timers.add(id)
  return id
}
const sleep = (ms) => new Promise((resolve) => later(resolve, ms))
const clearTimers = () => {
  timers.forEach(clearTimeout)
  timers.clear()
}

// ============ 能力数据 ============
const skillCategories = [
  {
    id: 'dev',
    name: '开发技术',
    description: '从单体到微服务，从数据库到监控告警，构建可靠的后端基础设施能力。',
    skills: [
      '熟练运用 AI 辅助编程，能根据项目需求快速上手 Java、Python、Go 等语言，利用 Hutool、Lombok 等工具库提升编码效率，确保代码规范与可维护性。',
      '具备微服务架构设计思维，能借助 AI 快速理解 Spring Cloud、MyBatis 等框架生态，独立完成从单体拆分为微服务的技术选型与落地治理。',
      '熟悉 MySQL 数据库设计和 SQL 调优，实践过分库分表、索引优化，能使用 Druid 进行 SQL 监控和慢查询分析。',
      '熟悉 Redis 缓存中间件，实践过 Caffeine 多级缓存架构、分布式锁、缓存雪崩/穿透解决方案、哨兵集群搭建。',
      '熟悉 Docker 容器化和 Nginx 反向代理部署，能编写 Dockerfile 打包项目并通过 Serverless 平台快速上线。',
      '熟悉 Prometheus + Grafana + 阿里云 ARMS 监控告警体系，能构建从网关到数据库的全链路追踪和 JVM 诊断大盘。',
      '掌握 SEO 搜索引擎优化和 GEO 生成式引擎优化，能通过结构化内容和 TDK 优化等手段提升搜索收录和 AI 推荐排名。'
    ]
  },
  {
    id: 'ai',
    name: 'AI 应用开发',
    description: '拥抱 AI 原生开发，构建企业级智能体与 RAG 知识库应用。',
    skills: [
      '熟悉 Spring AI、LangChain4j 等 AI 开发框架，独立开发过涉及 RAG、工具调用、MCP、多 Agent 协作的企业级 AI 智能体应用。',
      '掌握 Prompt 工程和优化技巧，能基于 PGvector 向量数据库构建 RAG 知识库，实现文档 ETL、向量检索和查询增强的完整流程。',
      '能利用 Cursor / Claude Code / GitHub Copilot 等 AI 编程工具开发全栈项目，掌握 MCP Server 和 Agent Skills 的开发和发布。',
      '熟悉 Vibe Coding、SDD、Harness Engineering 等多种 AI 编程模式，能利用 Spec-Kit、OpenSpec 等工具驱动 AI 完成大型项目。'
    ]
  }
]

// ============ 命令表 ============
const COMMAND_ALIASES = {
  help: 'help', '?': 'help', 帮助: 'help',
  ls: 'ls', list: 'ls', 能力: 'ls', modules: 'ls',
  dev: 'dev', 开发技术: 'dev',
  ai: 'ai', aiapp: 'ai', 'ai应用': 'ai', 'ai应用开发': 'ai',
  clear: 'clear', cls: 'clear', 清空: 'clear',
  exit: 'exit', quit: 'exit', q: 'exit', 退出: 'exit'
}
const COMPLETIONS = ['help', 'ls', 'dev', 'ai', 'clear', 'exit']

const helpLines = () => [
  { t: 'title', text: '可用命令' },
  { t: 'kv', key: 'help', val: '查看所有命令' },
  { t: 'kv', key: 'ls', val: '列出能力模块（开发技术 / AI 应用开发）' },
  { t: 'kv', key: 'dev', val: '显示完整「开发技术」能力清单' },
  { t: 'kv', key: 'ai', val: '显示完整「AI 应用开发」能力清单' },
  { t: 'kv', key: 'clear', val: '清空终端屏幕' },
  { t: 'kv', key: 'exit', val: '退出终端' }
]

const lsLines = () => [
  { t: 'title', text: '能力模块' },
  ...skillCategories.map((cat) => ({
    t: 'kv',
    key: `[${cat.id}]`,
    val: `${cat.name} — ${cat.skills.length} 项能力`
  })),
  { t: 'dim', text: '输入 dev / ai 查看完整清单' }
]

const moduleLines = (cat) => [
  { t: 'rule' },
  { t: 'title', text: `${cat.name} · ${cat.id.toUpperCase()}` },
  { t: 'desc', text: cat.description },
  { t: 'rule' },
  ...cat.skills.map((skill, i) => ({ t: 'item', key: pad(i + 1), text: skill })),
  { t: 'rule' }
]

// ============ 打字机 / 输出引擎 ============
const scrollBottom = () => {
  nextTick(() => {
    const el = bodyRef.value
    if (el) el.scrollTop = el.scrollHeight
  })
}

// 手动滚动时暂停自动吸底，避免抢滚动条
const userScrolling = ref(false)
const scrollStick = () => {
  const el = bodyRef.value
  if (!el) return
  const nearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 48
  userScrolling.value = !nearBottom
}

async function typeLine(line, cps = 110) {
  const my = session
  const idx = lines.value.push({ ...line, text: line.text ? '' : line.text }) - 1
  scrollBottom()
  const full = line.text || ''
  if (!full || prefersReducedMotion()) {
    lines.value[idx].text = full
    scrollBottom()
    await sleep(90)
    return
  }
  for (let i = 1; i <= full.length; i++) {
    if (session !== my) return
    lines.value[idx].text = full.slice(0, i)
    if (i % 2 === 0) scrollBottom()
    await sleep(1000 / cps)
  }
}

async function respond(list, stagger = 28) {
  const my = session
  for (const line of list) {
    if (session !== my) return
    lines.value.push(line)
    if (!userScrolling.value) scrollBottom()
    await sleep(stagger)
  }
}

// ============ 开机序列 ============
async function boot() {
  const my = session
  bootDone.value = false
  lines.value = []
  await typeLine({ t: 'ok', label: '[ OK ]', text: 'YUNO.SYS v3.0 内核加载完成' })
  await typeLine({ t: 'ok', label: '[ OK ]', text: '挂载能力模块 · dev / ai' })
  await typeLine({ t: 'ok', label: '[ OK ]', text: '安全信道已建立 · TLS 1.3' })
  await typeLine({ t: 'dim', text: ' ' })
  await typeLine({ t: 'accent', text: '欢迎访问, visitor' })
  await typeLine({ t: 'accent', text: '输入 help 查看所有命令' })
  if (session !== my) return
  bootDone.value = true
  userScrolling.value = false
  focusInput()
}

// ============ 开 / 关终端 ============
const openTerminal = () => {
  session++
  clearTimers()
  terminalVisible.value = true
  lockScroll()
  boot()
}

const closeTerminal = () => {
  session++
  clearTimers()
  terminalVisible.value = false
  bootDone.value = false
  unlockScroll()
}

// ============ 输入处理 ============
const focusInput = () => {
  if (window.matchMedia && window.matchMedia('(pointer: fine)').matches) {
    nextTick(() => inputRef.value?.focus())
  }
}

const onWindowClick = () => {
  const selection = window.getSelection()
  if (selection && String(selection).length) return
  focusInput()
}

const submit = () => {
  const raw = inputText.value
  const cmd = raw.trim().toLowerCase()
  lines.value.push({ t: 'in', text: raw })
  scrollBottom()
  inputText.value = ''

  if (!cmd) return
  history.value.push(raw.trim())
  historyIndex.value = history.value.length

  const action = COMMAND_ALIASES[cmd]
  if (!action) {
    respond([
      { t: 'err', text: `command not found: ${cmd}` },
      { t: 'dim', text: '输入 help 查看可用命令' }
    ])
    return
  }

  if (action === 'help') respond(helpLines())
  else if (action === 'ls') respond(lsLines())
  else if (action === 'dev') respond(moduleLines(skillCategories[0]))
  else if (action === 'ai') respond(moduleLines(skillCategories[1]))
  else if (action === 'clear') {
    lines.value = []
    userScrolling.value = false
  } else if (action === 'exit') {
    respond([{ t: 'dim', text: '正在断开会话…' }])
    later(closeTerminal, 520)
  }
}

const onInputKeydown = (e) => {
  if (e.key === 'Enter') {
    e.preventDefault()
    submit()
  } else if (e.key === 'ArrowUp') {
    e.preventDefault()
    if (historyIndex.value > 0) {
      historyIndex.value--
      inputText.value = history.value[historyIndex.value]
    }
  } else if (e.key === 'ArrowDown') {
    e.preventDefault()
    if (historyIndex.value < history.value.length) {
      historyIndex.value++
      inputText.value = history.value[historyIndex.value] || ''
    }
  } else if (e.key === 'Tab') {
    e.preventDefault()
    const v = inputText.value.trim().toLowerCase()
    if (!v) return
    const hit = COMPLETIONS.find((c) => c.startsWith(v))
    if (hit) inputText.value = hit
  }
}

const onKeydown = (e) => {
  if (e.key === 'Escape' && terminalVisible.value) closeTerminal()
}

// ============ 帷幕舞台 ============
const toggleCurtain = () => {
  isOpen.value = !isOpen.value
}

let observer = null

onMounted(() => {
  // 舞台进入视口时淡入上浮（只播放一次）
  observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        isVisible.value = true
        obs.disconnect()
      }
    })
  }, { threshold: 0.15 })
  if (stageRef.value) observer.observe(stageRef.value)

  window.addEventListener('keydown', onKeydown)
})

onBeforeUnmount(() => {
  if (observer && typeof observer.disconnect === 'function') observer.disconnect()
  observer = null
  window.removeEventListener('keydown', onKeydown)
  clearTimers()
})
</script>

<style scoped>
.skills {
  padding: 6rem 0;
  background: transparent;
}

.skills-overline {
  text-align: center;
  font-size: 0.85rem;
  font-weight: 600;
  letter-spacing: 0.5em;
  text-indent: 0.5em;
  color: var(--text-muted);
  margin-bottom: 1.4rem;
}

/* ============ 帷幕舞台 ============ */
.curtain-stage {
  --curtain-fabric:
    repeating-linear-gradient(105deg, rgba(255, 255, 255, 0.13) 0 2px, transparent 2px 14px),
    repeating-linear-gradient(-75deg, rgba(255, 255, 255, 0.07) 0 2px, transparent 2px 10px),
    linear-gradient(135deg, var(--glass-bg), rgba(255, 255, 255, 0.1));

  position: relative;
  width: 100%;
  max-width: 1000px;
  height: clamp(320px, 62vw, 560px);
  max-height: 72vh;
  margin: 0 auto;
  border-radius: 20px;
  overflow: hidden;
  cursor: pointer;
  border: 1px solid var(--glass-border);
  background:
    radial-gradient(circle at 50% 46%, var(--primary-light), transparent 62%),
    var(--bg-card);
  box-shadow: var(--shadow-lg);
  user-select: none;
  opacity: 0;
  transform: translateY(30px);
  transition: opacity 0.7s ease, transform 0.7s ease;
}

.curtain-stage.visible {
  opacity: 1;
  transform: translateY(0);
}

/* 深色模式：面料换成靛紫透明织物 */
.dark .curtain-stage {
  --curtain-fabric:
    repeating-linear-gradient(105deg, rgba(255, 255, 255, 0.08) 0 2px, transparent 2px 14px),
    repeating-linear-gradient(-75deg, rgba(255, 255, 255, 0.05) 0 2px, transparent 2px 10px),
    linear-gradient(135deg, rgba(139, 92, 246, 0.25), rgba(16, 21, 51, 0.45));
}

/* ============ 四片帷幕 ============ */
.curtain-panel {
  position: absolute;
  width: 100%;
  height: 100%;
  background: var(--curtain-fabric);
  border: 1px solid var(--glass-border);
  box-shadow: 0 8px 28px rgba(0, 0, 0, 0.18);
  opacity: 0.92;
  overflow: hidden;
  will-change: transform, opacity;
  transition: transform 0.55s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.55s ease;
}

.panel-b { left: -40%; transform: rotateZ(100deg); }
.panel-c { left: -40%; transform: rotateZ(-100deg); }
.panel-d { right: -40%; transform: rotateZ(105deg); }
.panel-e { right: -40%; transform: rotateZ(-100deg); }

/* 展开：向两侧滑开并淡出 */
.curtain-stage.open .panel-b { left: -60%; opacity: 0; }
.curtain-stage.open .panel-c { left: -66%; opacity: 0; }
.curtain-stage.open .panel-d { right: -60%; opacity: 0; }
.curtain-stage.open .panel-e { right: -66%; opacity: 0; }

/* ============ 中心 SKILL 大字 ============ */
.curtain-center {
  position: absolute;
  inset: 0;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
}

.curtain-title {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.2rem;
  padding: 1.5rem 3rem;
  background: transparent;
  border: none;
  cursor: pointer;
  opacity: 0;
  transform: scale(0.6);
  visibility: hidden;
  transition:
    opacity 0.45s ease,
    transform 0.45s cubic-bezier(0.34, 1.56, 0.64, 1),
    visibility 0.45s;
}

.curtain-stage.open .curtain-title {
  opacity: 1;
  transform: scale(1);
  visibility: visible;
  pointer-events: auto;
}

.curtain-title-text {
  font-family: var(--font-display);
  font-weight: 900;
  font-size: clamp(3rem, 9vw, 6.2rem);
  letter-spacing: 0.18em;
  line-height: 1;
  background: var(--gradient-primary);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  filter: drop-shadow(0 6px 22px rgba(0, 0, 0, 0.22));
  transition: transform 0.3s ease;
}

.curtain-title:hover .curtain-title-text {
  transform: scale(1.04);
}

.curtain-title-hint {
  font-size: 0.95rem;
  letter-spacing: 0.3em;
  color: var(--text-secondary);
}

/* ================================================================ */
/* ============ 技能终端（CRT 风格，内容全部居中） ================== */
/* ================================================================ */
.term-root {
  /* 终端始终深色，霓虹强调色跟随站点主题 */
  --ta: var(--primary-light);
  --ta-deep: var(--primary-color);
  --t-fg: #a9c4d4;
  --t-bright: #eaf7ff;
  --t-bg-0: #0a1520;
  --t-bg-1: #060c15;
  --t-bg-2: #04080f;
  --font-term: 'Cascadia Code', 'JetBrains Mono', 'Fira Code', 'SF Mono', Consolas,
    'Courier New', monospace;

  position: fixed;
  inset: 0;
  z-index: 4000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
}

.term-mask {
  position: absolute;
  inset: 0;
  background: rgba(2, 8, 16, 0.62);
  backdrop-filter: blur(6px) saturate(120%);
  -webkit-backdrop-filter: blur(6px) saturate(120%);
}

/* ============ 终端窗体 ============ */
.term-window {
  position: relative;
  width: min(880px, 94vw);
  height: min(640px, 82vh);
  display: flex;
  flex-direction: column;
  border-radius: 12px;
  font-family: var(--font-term);
  background:
    radial-gradient(90% 55% at 50% 0%, color-mix(in srgb, var(--ta) 9%, transparent), transparent 70%),
    radial-gradient(120% 120% at 50% 115%, rgba(10, 30, 40, 0.55), transparent 60%),
    linear-gradient(180deg, var(--t-bg-0), var(--t-bg-1) 70%, var(--t-bg-2));
  border: 1px solid color-mix(in srgb, var(--ta) 32%, transparent);
  box-shadow:
    0 24px 80px rgba(0, 0, 0, 0.55),
    0 0 56px color-mix(in srgb, var(--ta) 14%, transparent),
    inset 0 0 60px rgba(0, 0, 0, 0.45);
  overflow: hidden;
}

/* ============ 四角 HUD 括号 ============ */
.hud {
  position: absolute;
  width: 18px;
  height: 18px;
  border: 2px solid var(--ta);
  opacity: 0.85;
  filter: drop-shadow(0 0 5px var(--ta));
  pointer-events: none;
  z-index: 5;
}

.hud-tl { top: -3px; left: -3px; border-right: none; border-bottom: none; border-top-left-radius: 6px; }
.hud-tr { top: -3px; right: -3px; border-left: none; border-bottom: none; border-top-right-radius: 6px; }
.hud-bl { bottom: -3px; left: -3px; border-right: none; border-top: none; border-bottom-left-radius: 6px; }
.hud-br { bottom: -3px; right: -3px; border-left: none; border-top: none; border-bottom-right-radius: 6px; }

/* ============ 顶栏：关闭按钮位于正中间 ============ */
.term-header {
  position: relative;
  flex: none;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 1px solid color-mix(in srgb, var(--ta) 22%, transparent);
  background: color-mix(in srgb, var(--ta) 7%, transparent);
}

/* 关闭按钮两侧的对称渐隐光线 */
.term-header-line {
  position: absolute;
  top: 50%;
  height: 1px;
  width: calc(50% - 64px);
  background: linear-gradient(90deg, transparent, color-mix(in srgb, var(--ta) 45%, transparent));
  pointer-events: none;
}

.line-left { left: 14px; }
.line-right { right: 14px; transform: scaleX(-1); }

.term-header-tag {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  font-size: 0.66rem;
  letter-spacing: 0.16em;
  color: color-mix(in srgb, var(--ta) 62%, #8aa);
  white-space: nowrap;
}

.tag-left { left: 18px; }
.tag-right { right: 18px; }

/* 快捷关闭按钮：终端顶部正中间 */
.term-close {
  position: relative;
  z-index: 2;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 1px solid color-mix(in srgb, var(--ta) 55%, transparent);
  background: rgba(0, 0, 0, 0.4);
  color: var(--ta);
  font-size: 1.35rem;
  line-height: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  text-shadow: 0 0 8px var(--ta);
  box-shadow:
    0 0 12px color-mix(in srgb, var(--ta) 30%, transparent),
    inset 0 0 6px color-mix(in srgb, var(--ta) 18%, transparent);
  transition: all 0.28s ease;
}

.term-close:hover {
  background: #ff4757;
  border-color: #ff6b81;
  color: #fff;
  text-shadow: none;
  box-shadow: 0 0 20px rgba(255, 71, 87, 0.65);
  transform: rotate(90deg);
}

/* ============ 屏幕（扫描线 + 巡逻光束） ============ */
.term-screen {
  position: relative;
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
}

/* 横向扫描线 */
.term-screen::before {
  content: '';
  position: absolute;
  inset: 0;
  z-index: 3;
  pointer-events: none;
  background: repeating-linear-gradient(
    0deg,
    rgba(255, 255, 255, 0.03) 0 1px,
    transparent 1px 3px
  );
}

/* 缓慢巡检的竖向光束 */
.term-screen::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  top: -120px;
  height: 110px;
  z-index: 2;
  pointer-events: none;
  background: linear-gradient(
    180deg,
    transparent,
    color-mix(in srgb, var(--ta) 5%, transparent),
    transparent
  );
  animation: term-beam 7s linear infinite;
}

@keyframes term-beam {
  0% { transform: translateY(0); }
  100% { transform: translateY(calc(100vh)); }
}

/* ============ 输出区：一反常规，全部居中 ============ */
.term-body {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  overscroll-behavior: contain;
  padding: 1.5rem 1.25rem 1rem;
  text-align: center;
  font-size: 0.92rem;
  line-height: 1.9;
  color: var(--t-fg);
  -webkit-mask-image: linear-gradient(transparent, #000 26px, #000 calc(100% - 10px), transparent);
  mask-image: linear-gradient(transparent, #000 26px, #000 calc(100% - 10px), transparent);
  scrollbar-width: thin;
  scrollbar-color: color-mix(in srgb, var(--ta) 35%, transparent) transparent;
}

.term-body::-webkit-scrollbar {
  width: 5px;
}

.term-body::-webkit-scrollbar-thumb {
  background: color-mix(in srgb, var(--ta) 35%, transparent);
  border-radius: 999px;
}

.term-line {
  animation: term-line-in 0.18s ease both;
}

@keyframes term-line-in {
  from {
    opacity: 0;
    transform: translateY(3px);
  }
}

/* 普通输出 */
.t-text {
  color: var(--t-fg);
}

/* 弱化 / 注释 */
.t-dim {
  color: rgba(150, 180, 195, 0.5);
}

/* 强调（霓虹发光） */
.t-accent {
  color: var(--ta);
  text-shadow: 0 0 10px color-mix(in srgb, var(--ta) 60%, transparent);
}

/* 开机自检行 */
.t-ok .term-line-label {
  color: #37d67a;
  text-shadow: 0 0 8px rgba(55, 214, 122, 0.4);
  margin-right: 0.6em;
}

.t-ok .term-line-text {
  color: var(--t-fg);
}

/* 错误 */
.t-err {
  color: #ff6b6b;
  text-shadow: 0 0 8px rgba(255, 80, 80, 0.35);
}

/* 章节标题：两侧菱形装饰 */
.t-title {
  color: var(--ta);
  letter-spacing: 0.28em;
  text-indent: 0.28em;
  text-shadow: 0 0 12px color-mix(in srgb, var(--ta) 55%, transparent);
  margin: 0.7em 0 0.3em;
}

.t-title::before,
.t-title::after {
  content: '◆';
  font-size: 0.55em;
  opacity: 0.75;
  margin: 0 0.9em;
  vertical-align: 0.22em;
}

/* 描述行 */
.t-desc {
  color: rgba(150, 180, 195, 0.62);
  font-style: italic;
  max-width: 56ch;
  margin: 0 auto;
}

/* 分隔光线 */
.t-rule {
  display: block;
  width: min(420px, 72%);
  height: 1px;
  margin: 0.9em auto;
  background: linear-gradient(
    90deg,
    transparent,
    color-mix(in srgb, var(--ta) 45%, transparent),
    transparent
  );
}

/* 命令说明对（key 列右对齐定宽，整行居中） */
.t-kv {
  display: flex;
  justify-content: center;
  gap: 1.3em;
}

.term-kv-k {
  color: var(--ta);
  text-shadow: 0 0 8px color-mix(in srgb, var(--ta) 45%, transparent);
  min-width: 7ch;
  text-align: right;
}

.term-kv-v {
  color: var(--t-fg);
  text-align: left;
}

/* 能力条目（编号 + 正文，整块居中） */
.t-item {
  display: flex;
  justify-content: center;
  gap: 1em;
  max-width: 62ch;
  margin: 0.35em auto;
}

.term-item-k {
  flex: none;
  color: color-mix(in srgb, var(--ta) 75%, #9ab);
  text-shadow: 0 0 8px color-mix(in srgb, var(--ta) 35%, transparent);
  font-variant-numeric: tabular-nums;
}

.term-item-v {
  text-align: center;
  color: var(--t-fg);
}

/* 用户输入回显 */
.t-in {
  color: var(--t-bright);
}

.term-in-prompt {
  color: color-mix(in srgb, var(--ta) 65%, #9ab);
  margin-right: 0.7em;
}

.term-in-cmd {
  color: var(--t-bright);
  text-shadow: 0 0 6px color-mix(in srgb, var(--ta) 30%, transparent);
}

/* ============ 输入行（居中） ============ */
.term-input-row {
  flex: none;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.7em;
  padding: 0.95rem 1.25rem calc(0.95rem + env(safe-area-inset-bottom, 0px));
  border-top: 1px dashed color-mix(in srgb, var(--ta) 22%, transparent);
  background: color-mix(in srgb, var(--ta) 4%, transparent);
  transition: opacity 0.3s ease;
}

.term-input-row.muted {
  opacity: 0.35;
}

.term-prompt {
  color: var(--ta);
  text-shadow: 0 0 10px color-mix(in srgb, var(--ta) 50%, transparent);
  white-space: nowrap;
}

.term-prompt-sep {
  color: color-mix(in srgb, var(--ta) 65%, #9ab);
}

.term-input {
  background: transparent;
  border: none;
  outline: none;
  color: var(--t-bright);
  caret-color: var(--ta);
  font-family: inherit;
  font-size: 0.95rem;
  width: min(46ch, 58vw);
  text-align: left;
}

.term-input::placeholder {
  color: rgba(150, 180, 195, 0.35);
}

.term-input:disabled {
  cursor: not-allowed;
}

/* ============ CRT 开机 / 关机动画 ============ */
.term-enter-active .term-window {
  animation: crt-on 0.5s cubic-bezier(0.2, 0.8, 0.25, 1) both;
}

.term-leave-active .term-window {
  animation: crt-off 0.3s ease both;
}

.term-enter-from .term-mask {
  opacity: 0;
}

.term-enter-active .term-mask {
  transition: opacity 0.45s ease;
}

.term-leave-to .term-mask {
  opacity: 0;
}

.term-leave-active .term-mask {
  transition: opacity 0.3s ease;
}

@keyframes crt-on {
  0% {
    transform: scale(1, 0.004);
    filter: brightness(4) saturate(1.6);
    opacity: 0.9;
  }
  50% {
    transform: scale(1, 0.004);
    filter: brightness(4);
  }
  62% {
    transform: scale(1.02, 0.55);
    filter: brightness(1.8);
  }
  100% {
    transform: scale(1, 1);
    filter: brightness(1);
  }
}

@keyframes crt-off {
  0% {
    transform: scale(1, 1);
    filter: brightness(1);
    opacity: 1;
  }
  45% {
    transform: scale(1, 0.004);
    filter: brightness(4);
    opacity: 1;
  }
  100% {
    transform: scale(0.6, 0.004);
    filter: brightness(6);
    opacity: 0;
  }
}

/* ============ 响应式 ============ */
@media (max-width: 768px) {
  .skills {
    padding: 4rem 0;
  }

  .curtain-stage {
    height: clamp(280px, 78vw, 440px);
  }

  .curtain-title-hint {
    font-size: 0.85rem;
    letter-spacing: 0.18em;
  }

  .term-root {
    padding: 0.75rem;
  }

  .term-window {
    width: 100%;
    height: 84vh;
    height: 84dvh;
    border-radius: 10px;
  }

  .term-header {
    height: 44px;
  }

  /* 顶栏左右标签太挤，仅留光线与中央关闭钮 */
  .term-header-tag {
    display: none;
  }

  .term-header-line {
    width: calc(50% - 54px);
  }

  .term-body {
    font-size: 0.85rem;
    line-height: 1.8;
    padding: 1.1rem 0.9rem 0.8rem;
  }

  .term-input {
    font-size: 16px; /* 防 iOS 聚焦缩放 */
  }

  .term-item-v {
    text-align: center;
  }
}

@media (prefers-reduced-motion: reduce) {
  .curtain-stage,
  .curtain-panel,
  .curtain-title,
  .term-window,
  .term-screen::after,
  .term-line,
  .term-close {
    animation: none !important;
    transition: none !important;
  }
}
</style>

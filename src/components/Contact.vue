<template>
  <section id="contact" class="contact">
    <!-- 背景装饰 -->
    <div class="contact-bg-decoration">
      <div class="floating-shapes">
        <div class="shape shape-1"></div>
        <div class="shape shape-2"></div>
        <div class="shape shape-3"></div>
        <div class="shape shape-4"></div>
        <div class="shape shape-5"></div>
      </div>
      <div class="sakura-petals">
        <div class="petal" v-for="n in 15" :key="n" :style="{
          left: `${Math.random() * 100}%`,
          animationDelay: `${Math.random() * 5}s`,
          animationDuration: `${3 + Math.random() * 2}s`
        }"></div>
      </div>
    </div>

    <div class="container">
      <div class="contact-stage">
        <!-- 圆钮表单卡：四个字段默认是圆形按钮，点击后延展成输入框 -->
        <form
          ref="cardRef"
          class="contact-card"
          novalidate
          @submit.prevent="handleSubmit"
        >
          <!-- 卡内液体：初始没过姓名球，展开某栏即被撑到该栏下方，收起又涨回 -->
          <div class="card-liquid" aria-hidden="true">
            <i
              ref="poolRef"
              class="card-pool"
              :class="{ stir: stirred }"
            ><i class="pool-stir"><i class="pool-slosh"></i></i></i>
          </div>

          <p class="card-caption">想发什么到我的邮箱？</p>

          <!-- Honeypot 反垃圾字段：真实用户不可见，机器人填写后提交会被 Web3Forms 丢弃 -->
          <input
            type="text"
            name="botcheck"
            v-model="form.botcheck"
            class="hp-field"
            tabindex="-1"
            autocomplete="off"
          >

          <div
            v-for="f in fields"
            :key="f.key"
            :ref="(el) => setRowRef(el, f.key)"
            class="field-row"
            :class="{ 'row-open-msg': f.key === 'message' && expanded === 'message' }"
          >
            <div
              class="morph"
              :class="{
                open: expanded === f.key,
                'is-message': f.key === 'message',
                shake: shakeField === f.key
              }"
            >
              <button
                type="button"
                class="morph-btn"
                :tabindex="expanded === f.key ? -1 : 0"
                :aria-label="`展开「${f.label}」输入框`"
                @click="expand(f.key)"
              >
                <span class="morph-label">{{ f.label }}</span>
              </button>

              <div class="morph-clip">
                <!-- 液体层：静止层贴壁打底；晃动层平时微荡，展开瞬间水平冲撞 -->
                <div class="morph-liquid" aria-hidden="true">
                  <i class="liquid-still"></i>
                  <i class="liquid-stir"><i class="liquid-slosh"></i></i>
                </div>
                <textarea
                  v-if="f.type === 'textarea'"
                  :ref="(el) => setFieldRef(el, f.key)"
                  v-model="form[f.key]"
                  class="morph-input morph-textarea"
                  :placeholder="f.placeholder"
                  rows="3"
                  :tabindex="expanded === f.key ? 0 : -1"
                  :aria-label="f.label"
                  @blur="onFieldBlur"
                  @keydown.esc="onEsc"
                ></textarea>
                <input
                  v-else
                  :ref="(el) => setFieldRef(el, f.key)"
                  v-model="form[f.key]"
                  :type="f.type"
                  class="morph-input"
                  :placeholder="f.placeholder"
                  :tabindex="expanded === f.key ? 0 : -1"
                  :aria-label="f.label"
                  @blur="onFieldBlur"
                  @keydown.esc="onEsc"
                >
              </div>
            </div>
          </div>

          <button type="submit" class="btn-submit" :disabled="loading" @click="stirPool">
            <span class="btn-body">
              <span v-if="loading">发送中...</span>
              <span v-else>发送消息</span>
            </span>
            <div class="btn-shine"></div>
          </button>
        </form>

        <!-- 竖排大标题：整串 ~~CONTACT~~ 一起旋转，紧贴卡片右侧，自上而下阅读 -->
        <h2 class="side-title" aria-label="CONTACT">~~CONTACT~~</h2>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, reactive, nextTick, onMounted, onBeforeUnmount } from 'vue'

interface ContactForm {
  name: string
  email: string
  subject: string
  message: string
  botcheck: string
}

type FieldKey = 'name' | 'email' | 'subject' | 'message'

const fields: Array<{
  key: FieldKey
  label: string
  placeholder: string
  type: 'text' | 'email' | 'textarea'
}> = [
  { key: 'name', label: '姓名', placeholder: '请输入您的姓名', type: 'text' },
  { key: 'email', label: '邮箱', placeholder: '请输入您的邮箱', type: 'email' },
  { key: 'subject', label: '主题', placeholder: '请输入主题', type: 'text' },
  { key: 'message', label: '消息', placeholder: '想说的都写在这里…', type: 'textarea' }
]

const form = reactive<ContactForm>({
  name: '',
  email: '',
  subject: '',
  message: '',
  botcheck: ''
})

// 当前展开的字段（一次只展开一个；失焦即收起，内容保留但不可见）
const expanded = ref<FieldKey | null>(null)
const shakeField = ref<FieldKey | null>(null)
const loading = ref(false)

// ============ 卡内液体：液面跟随展开字段升降 ============
const cardRef = ref<HTMLFormElement | null>(null)
const poolRef = ref<HTMLElement | null>(null)

const rowRefs: Partial<Record<FieldKey, HTMLElement | null>> = {}
const setRowRef = (el: unknown, key: FieldKey) => {
  rowRefs[key] = (el as HTMLElement | null) || null
}

// 液面规则：初始没过姓名球上方（球泡在水里）；展开某栏即撑到该栏下方；收起涨回初始
const setLevel = (key: FieldKey | null) => {
  const card = cardRef.value
  const pool = poolRef.value
  const row = rowRefs[key ?? 'name']
  if (!card || !pool || !row) return

  const cardTop = card.getBoundingClientRect().top
  const rowRect = row.getBoundingClientRect()

  let level: number
  if (!key) {
    // 收起态：液面高过姓名球顶，姓名球浸没在液体里
    level = rowRect.top - cardTop - 10
  } else {
    level = rowRect.bottom - cardTop + 2
    // 消息栏展开时行高会增高，液面目标需加上增高量（行高过渡中即开始移动，曲线一致）
    if (key === 'message') {
      const rem = parseFloat(getComputedStyle(document.documentElement).fontSize)
      const delta = window.matchMedia('(max-width: 768px)').matches ? 4.9 : 5.2
      level += delta * rem
    }
  }

  pool.style.top = `${Math.round(level)}px`
}

// 按压发送按钮：搅动一次液面
const stirred = ref(false)
let stirTimer = 0
const stirPool = () => {
  stirred.value = false
  requestAnimationFrame(() => { stirred.value = true })
  window.clearTimeout(stirTimer)
  stirTimer = window.setTimeout(() => { stirred.value = false }, 1500)
}

const onResize = () => setLevel(expanded.value)

onMounted(() => nextTick(() => setLevel(null)))
onMounted(() => window.addEventListener('resize', onResize))
onBeforeUnmount(() => window.removeEventListener('resize', onResize))

const fieldRefs: Partial<Record<FieldKey, HTMLInputElement | HTMLTextAreaElement | null>> = {}
const setFieldRef = (el: unknown, key: FieldKey) => {
  fieldRefs[key] = (el as HTMLInputElement | HTMLTextAreaElement | null) || null
}

const expand = (key: FieldKey) => {
  if (expanded.value === key) return
  expanded.value = key
  nextTick(() => {
    fieldRefs[key]?.focus()
    setLevel(key)
  })
}

const onFieldBlur = () => {
  expanded.value = null
  nextTick(() => setLevel(null))
}

const onEsc = (e: KeyboardEvent) => {
  ;(e.target as HTMLInputElement | HTMLTextAreaElement).blur()
}

// 未通过校验的字段：展开 + 抖动提示
const reject = (key: FieldKey) => {
  expand(key)
  shakeField.value = key
  window.setTimeout(() => {
    if (shakeField.value === key) shakeField.value = null
  }, 600)
}

// Web3Forms 访问密钥：https://web3forms.com/
// 也可以放入环境变量 VITE_WEB3FORMS_ACCESS_KEY（.env.development / .env.production）
const WEB3FORMS_ACCESS_KEY = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY || '096a318a-081f-403d-8087-bf1501030837'

const handleSubmit = async () => {
  if (loading.value) return

  if (!form.name.trim()) return reject('name')
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) return reject('email')
  if (!form.subject.trim()) return reject('subject')
  if (!form.message.trim()) return reject('message')

  loading.value = true

  try {
    // Web3Forms：无需后端，直接向表单服务提交，邮件会发到你在 web3forms.com 确认过的收件邮箱
    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        access_key: WEB3FORMS_ACCESS_KEY,
        name: form.name,
        email: form.email,
        subject: form.subject,
        message: form.message,
        botcheck: form.botcheck
      })
    })

    const result = await response.json()

    if (result.success) {
      alert('消息发送成功！我会尽快回复您。')
      // 重置表单并收起所有字段
      Object.assign(form, {
        name: '',
        email: '',
        subject: '',
        message: '',
        botcheck: ''
      })
      expanded.value = null
    } else {
      alert(result.message || '发送失败，请重试')
    }
  } catch (error) {
    console.error('提交表单失败:', error)
    alert('网络错误，请检查网络连接或稍后重试')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
/* Honeypot 字段对用户完全不可见 */
.hp-field {
  position: absolute;
  left: -9999px;
  width: 1px;
  height: 1px;
  opacity: 0;
  pointer-events: none;
}

.contact {
  padding: 5rem 0;
  background: transparent;
  position: relative;
  overflow: hidden;
}

/* ============ 背景装饰 ============ */
.contact-bg-decoration {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  overflow: hidden;
  z-index: 0;
}

.floating-shapes .shape {
  position: absolute;
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(255, 183, 197, 0.3), rgba(224, 195, 252, 0.3));
  filter: blur(20px);
  animation: float 6s ease-in-out infinite;
}

.shape-1 {
  width: 200px;
  height: 200px;
  top: -50px;
  left: -50px;
  animation-delay: 0s;
}

.shape-2 {
  width: 150px;
  height: 150px;
  top: 50%;
  right: -30px;
  animation-delay: 1s;
}

.shape-3 {
  width: 120px;
  height: 120px;
  bottom: 10%;
  left: 10%;
  animation-delay: 2s;
}

.shape-4 {
  width: 180px;
  height: 180px;
  top: 30%;
  left: 50%;
  animation-delay: 3s;
}

.shape-5 {
  width: 100px;
  height: 100px;
  bottom: -30px;
  right: 20%;
  animation-delay: 4s;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0) rotate(0deg);
  }
  50% {
    transform: translateY(-20px) rotate(10deg);
  }
}

.sakura-petals {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
}

.petal {
  position: absolute;
  width: 10px;
  height: 10px;
  background: linear-gradient(135deg, #ffb7c5, #ff9eb5);
  border-radius: 50% 0 50% 50%;
  opacity: 0.6;
  top: -10px;
  animation: sakura-fall linear infinite;
}

@keyframes sakura-fall {
  0% {
    top: -10px;
    transform: translateX(0) rotate(0deg);
    opacity: 0.6;
  }
  100% {
    top: 100vh;
    transform: translateX(100px) rotate(720deg);
    opacity: 0;
  }
}

/* ============ 舞台：卡片 + 竖排标题 ============ */
.container {
  position: relative;
  z-index: 1;
}

.contact-stage {
  display: flex;
  align-items: stretch;
  justify-content: center;
  gap: clamp(0.9rem, 2.5vw, 1.8rem);
  max-width: 680px;
  margin: 0 auto;
}

/* ============ 表单卡片 ============ */
.contact-card {
  position: relative;
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: clamp(1.6rem, 4vw, 2.6rem) clamp(1.2rem, 4vw, 2.4rem);
  border-radius: clamp(1.8rem, 6vw, 3rem);
  background: var(--glass-bg);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  border: 1px solid var(--glass-border);
  box-shadow: var(--shadow-lg);
}

.card-caption {
  margin: 0 0 0.4rem;
  font-family: var(--font-display);
  font-size: clamp(1.1rem, 2.6vw, 1.35rem);
  font-weight: 700;
  letter-spacing: 0.08em;
  color: var(--text-primary);
  text-align: center;
}

/* ============ 卡内液体：液面跟随展开字段升降 ============ */
.card-liquid {
  position: absolute;
  inset: 0;
  border-radius: inherit;
  overflow: hidden;
  pointer-events: none;
  z-index: 2;
}

/* 液池外壳：上下锚定（top 由 JS 按当前展开栏设置，bottom 贴卡片底），
   top 过渡即液面升降 */
.card-pool {
  position: absolute;
  left: -12%;
  width: 124%;
  top: 30%;
  bottom: 0;
  border-radius: 42% 42% 0 0 / 6% 6% 0 0;
  transition: top 0.55s cubic-bezier(0.22, 1, 0.36, 1);
}

/* 搅动层：按压缩放按钮时液面倾斜涨落晃一次（与内层待机荡漾分离，避免动画覆盖） */
.pool-stir {
  position: absolute;
  inset: 0;
  border-radius: inherit;
  transform-origin: 50% 100%;
}

.card-pool.stir .pool-stir {
  animation: pool-stir 1.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* 液池本体：平时液面轻微荡漾 + 轻微涨落 */
.pool-slosh {
  position: absolute;
  inset: 0;
  border-radius: inherit;
  transform-origin: 50% 100%;
  background: linear-gradient(180deg,
    color-mix(in srgb, var(--primary-light) 28%, transparent),
    color-mix(in srgb, var(--primary-color) 46%, transparent) 55%,
    color-mix(in srgb, var(--primary-color) 54%, transparent));
  animation: pool-sway 6s ease-in-out infinite alternate;
}

/* 液面高光 */
.pool-slosh::before {
  content: '';
  position: absolute;
  top: 2.5%;
  left: 18%;
  right: 18%;
  height: 4%;
  border-radius: 50%;
  background: linear-gradient(180deg,
    color-mix(in srgb, var(--primary-light) 50%, transparent),
    transparent);
  filter: blur(3px);
}

@keyframes pool-sway {
  from { transform: translateX(-1.2%) scaleY(1.04); }
  to { transform: translateX(1.2%) scaleY(0.98); }
}

/* 按压发送按钮 → 液面倾斜涨落被搅动 */
@keyframes pool-stir {
  0% { transform: translateX(0) skewX(0deg) scaleY(1); }
  18% { transform: translateX(4%) skewX(1.2deg) scaleY(1.07); }
  38% { transform: translateX(-3.2%) skewX(-1deg) scaleY(0.95); }
  56% { transform: translateX(2%) skewX(0.6deg) scaleY(1.04); }
  72% { transform: translateX(-1.1%) skewX(-0.4deg) scaleY(0.97); }
  86% { transform: translateX(0.5%) skewX(0.2deg) scaleY(1.02); }
  100% { transform: translateX(0) skewX(0deg) scaleY(1); }
}

/* ============ 字段行：默认圆钮，点击延展 ============ */
.field-row {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 5.8rem;
  transition: height 0.45s cubic-bezier(0.22, 1, 0.36, 1);
}

/* 消息字段展开时行高变大，其余行高恒定避免跳动 */
.field-row.row-open-msg {
  height: 11rem;
}

.morph {
  position: relative;
  width: 5.4rem;
  height: 5.4rem;
  border-radius: 999px;
  /* 更透的液态玻璃：底色减淡 + 背景模糊托底 */
  background: color-mix(in srgb, var(--bg-card) 52%, transparent);
  backdrop-filter: blur(8px) saturate(140%);
  -webkit-backdrop-filter: blur(8px) saturate(140%);
  border: 1.5px solid var(--glass-border);
  transition:
    width 0.55s cubic-bezier(0.22, 1, 0.36, 1),
    height 0.45s cubic-bezier(0.22, 1, 0.36, 1),
    margin-top 0.45s cubic-bezier(0.22, 1, 0.36, 1),
    border-radius 0.55s cubic-bezier(0.22, 1, 0.36, 1),
    border-color 0.3s ease,
    box-shadow 0.35s ease;
}

.morph.open {
  width: min(420px, 100%);
  height: 4.1rem;
  /* 下移一点，给上浮的字段名留出头顶空间 */
  margin-top: 1.15rem;
  border-radius: 999px;
  border-color: var(--primary-color);
  box-shadow: 0 6px 24px color-mix(in srgb, var(--primary-color) 22%, transparent);
}

.morph.is-message.open {
  height: 9.4rem;
  border-radius: 1.6rem;
}

/* 未通过校验：抖动 */
.morph.shake {
  animation: morph-shake 0.55s ease;
}

@keyframes morph-shake {
  0%, 100% { transform: translateX(0); }
  20% { transform: translateX(-9px); }
  40% { transform: translateX(8px); }
  60% { transform: translateX(-5px); }
  80% { transform: translateX(3px); }
}

/* 圆钮本体：展开时被输入框覆盖，不可再点 */
.morph-btn {
  position: absolute;
  inset: 0;
  width: 100%;
  border: none;
  background: transparent;
  cursor: pointer;
  padding: 0;
  -webkit-tap-highlight-color: transparent;
}

.morph:not(.open) .morph-btn:hover {
  border-radius: inherit;
  box-shadow:
    0 0 0 4px color-mix(in srgb, var(--primary-color) 14%, transparent),
    0 10px 24px color-mix(in srgb, var(--primary-color) 20%, transparent);
}

.morph:not(.open) .morph-btn:focus-visible {
  outline: 2px solid var(--primary-color);
  outline-offset: 3px;
  border-radius: inherit;
}

/* 字段名：圆态居中大字，展开后上浮到输入框正上方（不占框内空间） */
.morph-label {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.18rem;
  font-weight: 600;
  letter-spacing: 0.12em;
  color: var(--text-primary);
  pointer-events: none;
  transition:
    inset 0.45s cubic-bezier(0.22, 1, 0.36, 1),
    transform 0.45s cubic-bezier(0.22, 1, 0.36, 1),
    font-size 0.45s cubic-bezier(0.22, 1, 0.36, 1),
    color 0.3s ease,
    letter-spacing 0.45s ease;
}

.morph.open .morph-label {
  inset: auto;
  top: -0.98rem;
  left: 50%;
  transform: translateX(-50%);
  font-size: 0.72rem;
  letter-spacing: 0.22em;
  color: var(--primary-color);
  white-space: nowrap;
}

/* 裁剪层：收起时把输入内容裁在圆框之内；事件穿透给圆钮 */
.morph-clip {
  position: absolute;
  inset: 0;
  border-radius: inherit;
  overflow: hidden;
  pointer-events: none;
}

/* ============ 液体层（底部晃动，不旋转） ============ */
/* 装液体的容器：跟随圆/胶囊外形裁剪 */
.morph-liquid {
  position: absolute;
  inset: 0;
  border-radius: inherit;
  overflow: hidden;
  pointer-events: none;
}

/* 静止层：贴壁打底，保证液体始终贴着左右壁 */
.liquid-still,
.liquid-slosh {
  position: absolute;
  left: -25%;
  width: 150%;
  height: 200%;
  top: 56%;
}

.liquid-still {
  border-radius: 46% 46% 0 0 / 9% 9% 0 0;
  background: linear-gradient(180deg,
    color-mix(in srgb, var(--primary-light) 30%, transparent),
    color-mix(in srgb, var(--primary-color) 48%, transparent));
}

/* 晃动层：略高于静止层。晃动动画在外层容器上（与内层待机动画分离，
   避免同元素两个动画互相覆盖——否则待机动画永不重启，会一直压住晃动） */
.liquid-stir {
  position: absolute;
  left: -25%;
  width: 150%;
  height: 200%;
  top: 52%;
  /* 以底中心为原点：涨落沿液面上下，倾斜绕底摆动 */
  transform-origin: 50% 100%;
}

.morph.open .liquid-stir {
  animation: liquid-slosh 1.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* 内层液体本体：平时液面微微荡漾 + 轻微涨落 */
.liquid-slosh {
  position: absolute;
  inset: 0;
  transform-origin: 50% 100%;
  border-radius: 46% 46% 0 0 / 8% 8% 0 0;
  background: linear-gradient(180deg,
    color-mix(in srgb, var(--primary-light) 40%, transparent),
    color-mix(in srgb, var(--primary-color) 56%, transparent));
  animation: liquid-idle 7s ease-in-out infinite alternate;
}

/* 液面高光（提亮放大，晃动时肉眼可见） */
.liquid-slosh::before {
  content: '';
  position: absolute;
  top: 1%;
  left: 18%;
  right: 18%;
  height: 6%;
  border-radius: 50%;
  background: linear-gradient(180deg,
    color-mix(in srgb, var(--primary-light) 70%, transparent),
    transparent);
  filter: blur(1.5px);
}

@keyframes liquid-idle {
  from { transform: translateX(-3%) scaleY(1.03); }
  to { transform: translateX(3%) scaleY(0.98); }
}

/* 展开瞬间：液体涌向一侧（液面倾斜）再反弹回落，伴随整体涨落 */
@keyframes liquid-slosh {
  0% { transform: translateX(0) skewX(0deg) scaleY(1); }
  18% { transform: translateX(15%) skewX(6deg) scaleY(1.14); }
  38% { transform: translateX(-12%) skewX(-5deg) scaleY(0.9); }
  56% { transform: translateX(7.5%) skewX(3deg) scaleY(1.08); }
  72% { transform: translateX(-4%) skewX(-2deg) scaleY(0.95); }
  86% { transform: translateX(2%) skewX(1deg) scaleY(1.03); }
  100% { transform: translateX(0) skewX(0deg) scaleY(1); }
}

/* 输入框：展开时淡入可输入，内容居中显示 */
.morph-input {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  padding: 0 1.4rem;
  border: none;
  outline: none;
  background: transparent;
  color: var(--text-primary);
  font-family: inherit;
  font-size: 1rem;
  line-height: 1.6;
  text-align: center;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.28s ease 0.14s;
}

.morph.open .morph-input {
  opacity: 1;
  pointer-events: auto;
}

.morph-textarea {
  padding: 1.25rem 1.2rem 0.6rem;
  resize: none;
}

.morph-input::placeholder {
  color: var(--text-muted);
}

/* ============ 发送按钮：漂浮在液体里的浮标 ============ */
.btn-submit {
  position: relative;
  overflow: hidden;
  margin-top: 0.4rem;
  padding: 0.95rem 3.2rem;
  border: none;
  border-radius: 2rem;
  background: var(--gradient-primary);
  color: #fff;
  font-size: 1.05rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 5px 20px color-mix(in srgb, var(--primary-color) 35%, transparent);
  transition: transform 0.3s ease, box-shadow 0.3s ease, opacity 0.3s ease;
}

/* 文字随波轻浮：像漂在液面上的浮标 */
.btn-body {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: btn-bob 3.2s ease-in-out infinite alternate;
}

@keyframes btn-bob {
  from { transform: translateY(0.5px); }
  to { transform: translateY(-3.5px); }
}

.btn-submit:hover:not(:disabled) {
  transform: translateY(-4px);
  box-shadow: 0 8px 30px color-mix(in srgb, var(--primary-color) 55%, transparent);
}

/* 按压：往液面下压一截 */
.btn-submit:active:not(:disabled) {
  transform: translateY(2px);
}

/* 发送中：沉入液体，文字随之微微下沉 */
.btn-submit:disabled .btn-body {
  animation: btn-sink 0.6s ease forwards;
}

@keyframes btn-sink {
  to { transform: translateY(3px); opacity: 0.85; }
}

.btn-submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-shine {
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  animation: shine 3s ease-in-out infinite;
}

@keyframes shine {
  0% { left: -100%; }
  100% { left: 100%; }
}

/* ============ 竖排大标题 ~~CONTACT~~（整串一起旋转） ============ */
.side-title {
  writing-mode: vertical-rl;
  margin: 0;
  padding: 0.4rem 0;
  font-family: var(--font-display);
  font-size: clamp(1.9rem, 3.8vw, 2.7rem);
  font-weight: 700;
  line-height: 1.05;
  letter-spacing: 0.16em;
  user-select: none;
  background: var(--gradient-primary);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  filter: drop-shadow(0 4px 14px color-mix(in srgb, var(--primary-color) 30%, transparent));
}

/* ============ 响应式 ============ */
@media (max-width: 768px) {
  .contact {
    padding: 3.5rem 0;
  }

  .contact-card {
    gap: 0.7rem;
  }

  .field-row {
    height: 5.1rem;
  }

  .field-row.row-open-msg {
    height: 10rem;
  }

  .morph {
    width: 4.6rem;
    height: 4.6rem;
  }

  .morph.open {
    height: 3.9rem;
    margin-top: 1.05rem;
  }

  .morph.is-message.open {
    height: 8.4rem;
    border-radius: 1.4rem;
  }

  .morph-label {
    font-size: 1.05rem;
  }

  .morph.open .morph-label {
    top: -0.92rem;
  }

  .morph-input {
    font-size: 16px; /* 防 iOS 聚焦缩放 */
  }

  .side-title {
    font-size: 1.5rem;
    letter-spacing: 0.12em;
  }

  .shape-1, .shape-2, .shape-4 {
    display: none;
  }
}

@media (prefers-reduced-motion: reduce) {
  .morph,
  .morph-label,
  .field-row,
  .morph-input,
  .btn-submit,
  .btn-body,
  .shape,
  .petal,
  .btn-shine,
  .liquid-slosh,
  .liquid-stir,
  .pool-slosh,
  .pool-stir {
    animation: none !important;
    transition: none !important;
  }
}
</style>

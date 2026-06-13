<template>
  <see-config>
    <view class="container">
      <text class="title">{{ t('text.demo.basic') }}</text>
      <view class="content">
        <see-text :text="t('text.demo.noOvertime')"></see-text>
      </view>
      <text class="title">{{ t('text.demo.theme') }}</text>
      <view class="content">
        <see-text :text="t('text.demo.default')" />
        <see-text :text="t('text.demo.primary')" type="primary" />
        <see-text :text="t('text.demo.error')" type="error" />
        <see-text :text="t('text.demo.warning')" type="warning" />
        <see-text :text="t('text.demo.success')" type="success" />
        <see-text :text="t('text.demo.customColor')" color="#52f7bd" />
      </view>
      <text class="title">{{ t('text.demo.link') }}</text>
      <view class="content">
        <see-text :text="t('text.demo.docLink')" type="primary" mode="link" href="https://www.baidu.com" />
        <view class="gap-12"></view>
        <see-text :text="t('text.demo.needLink')" type="warning" mode="link" href="https://www.baidu.com" />
      </view>
      <text class="title">{{ t('text.demo.phone') }}</text>
      <view class="content">
        <see-text text="18888888888" type="primary" mode="phone" phone-number="18888888888" />
        <view class="gap-12"></view>
        <see-text :text="t('text.demo.customText')" type="primary" mode="phone" phone-number="19999999999" />
      </view>
      <text class="title">{{ t('text.demo.price') }}</text>
      <view class="content flex-start">
        <see-text :text="t('text.demo.thousand')" />
        <see-text text="1000" type="primary" mode="price" />
        <view class="gap-12"></view>
        <see-text :text="t('text.demo.scrollAmount')" />
        <see-text :text="price" is-count-up mode="price" type="primary" :size="16" />
        <see-button size="mini" is-ripple @tap="price++">{{ t('text.demo.plusOne') }}</see-button>
        <view class="gap-12"></view>
      </view>
      <text class="title">{{ t('text.demo.date') }}</text>
      <view class="content flex-start">
        <see-text :text="t('text.demo.strTimestamp')" />
        <see-text type="primary" mode="date" date="1672502400000" date-format="YYYY-MM-DD" />
        <view class="gap-12"></view>
        <see-text :text="t('text.demo.numTimestamp')" />
        <see-text type="primary" mode="date" :date="1715668235000" date-format="YYYY-MM-DD HH:mm:ss" />
        <view class="gap-12"></view>
        <see-text :text="t('text.demo.showWeek')" />
        <see-text type="primary" mode="date" :date="1715668235000" :date-format="t('text.demo.formatWithWeek')" />
        <view class="gap-12"></view>
        <see-text :text="t('text.demo.dateForm')" />
        <see-text type="primary" mode="date" :date="new Date()" :date-format="t('text.demo.formatDateObj')" />
        <view class="gap-12"></view>
        <see-text :text="t('text.demo.realtime')" />
        <see-text type="primary" mode="date" :date="currentTime" :date-format="t('text.demo.formatRealtime')" />
      </view>
      <text class="title">{{ t('text.demo.timeago') }}</text>
      <view class="content flex-start">
        <see-text :text="t('text.demo.currPlus1s')" />
        <see-text type="primary" mode="timeago" :date="Date.now() + 1000" date-format="YYYY-MM-DD" />
        <view class="gap-12"></view>
        <see-text :text="t('text.demo.currMinus30s')" />
        <see-text type="primary" mode="timeago" :date="Date.now() - 30 * 1000" date-format="YYYY-MM-DD" />
        <view class="gap-12"></view>
        <see-text :text="t('text.demo.currMinus30m')" />
        <see-text type="primary" mode="timeago" :date="Date.now() - 30 * 60 * 1000" date-format="YYYY-MM-DD" />
        <view class="gap-12"></view>
        <see-text :text="t('text.demo.currMinus5h')" />
        <see-text type="primary" mode="timeago" :date="Date.now() - 5 * 3600 * 1000" date-format="YYYY-MM-DD" />
        <view class="gap-12"></view>
        <see-text :text="t('text.demo.currMinus3d')" />
        <see-text type="primary" mode="timeago" :date="Date.now() - 3 * 86400 * 1000" date-format="YYYY-MM-DD" />
        <view class="gap-12"></view>
        <see-text :text="t('text.demo.currMinus15d')" />
        <see-text type="primary" mode="timeago" :date="Date.now() - 15 * 86400 * 1000" date-format="YYYY-MM-DD" />
        <view class="gap-12"></view>
        <see-text :text="t('text.demo.currMinus150d')" />
        <see-text type="primary" mode="timeago" :date="Date.now() - 150 * 86400 * 1000" date-format="YYYY-MM-DD" />
        <view class="gap-12"></view>
        <see-text :text="t('text.demo.currMinus800d')" />
        <see-text type="primary" mode="timeago" :date="Date.now() - 800 * 86400 * 1000" date-format="YYYY-MM-DD" />
      </view>
      <text class="title">{{ t('text.demo.typewriter') }}</text>
      <view class="content flex-start">
        <see-text
          ref="textRef"
          mode="text"
          :text="t('text.demo.typing')"
          :is-text-up="true"
          :text-up="{ speed: 120, autoStart: false, showCursor: true }"
          @on-text-up-complete="handleComplete"
        />
        <view class="gap-12"></view>
        <view class="flex-sb">
          <see-button is-ripple :title="t('text.demo.startTyping')" @tap="start" />
          <see-button
            is-ripple
            :title="isStop ? t('text.demo.pause') : t('text.demo.continue')"
            :type="isStop ? 'warning' : 'primary'"
            :is-disabled="!isStart"
            @tap="stopResume"
          />
          <see-button :title="t('text.demo.showAll')" @tap="showAll" />
        </view>
      </view>
    </view>
  </see-config>
</template>

<script lang="ts" setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useI18n, useNavbarI18n } from '@/uni_modules/see-u-ui'

const { t } = useI18n()
useNavbarI18n('navbar.text')

const currentTime = ref(new Date())
let timer: ReturnType<typeof setInterval> | null = null

onMounted(() => {
  timer = setInterval(() => (currentTime.value = new Date()), 30)
})

onUnmounted(() => {
  if (timer) {
    clearInterval(timer)
    timer = null
  }
})

const price = ref(9999999999999.99)

/** 打字机效果 */
const textRef = ref()
const isStop = ref(true)
const isStart = ref(false)

const start = () => {
  textRef.value?.startTyping()
  isStart.value = true
  isStop.value = true
}

const stopResume = () => {
  if (isStop.value) {
    textRef.value?.stopTyping()
  } else textRef.value?.resumeTyping()
  isStop.value = !isStop.value
}

const showAll = () => {
  textRef.value?.showAllText()
}

const handleComplete = () => {
  console.log('打字完成！')
  isStart.value = false
}
</script>

<style lang="scss" scoped>
.gap-12 {
  width: 100%;
  height: 12px;
}
.flex-start {
  justify-content: flex-start !important;
}
.flex-sb {
  width: 100%;
  display: flex;
  justify-content: space-between;
}
.container {
  width: 100vw;
  overflow: hidden;
  padding: 12px;
  box-sizing: border-box;

  .title {
    font-size: 18px;
    color: #999;
  }
  .content {
    margin-top: 6px;
    margin-bottom: 24px;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
}
</style>

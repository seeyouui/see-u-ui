<template>
  <see-config>
    <view class="container">
      <text class="title">{{ t('badge.demo.basic') }}</text>
      <view class="content">
        <see-badge value="5" type="error"></see-badge>
        <view class="ml-12" />
        <see-badge value="99" type="primary"></see-badge>
      </view>

      <text class="title">{{ t('badge.demo.dot') }}</text>
      <view class="content">
        <see-badge :is-dot="true" type="error"></see-badge>
        <view class="ml-12" />
        <see-badge :is-dot="true" type="success"></see-badge>
        <view class="ml-12" />
        <see-badge :is-dot="true" type="warning"></see-badge>
      </view>

      <text class="title">{{ t('badge.demo.theme') }}</text>
      <view class="content flex-sb">
        <see-badge value="1" type="info"></see-badge>
        <see-badge value="2" type="primary"></see-badge>
        <see-badge value="3" type="error"></see-badge>
        <see-badge value="4" type="warning"></see-badge>
        <see-badge value="5" type="success"></see-badge>
      </view>

      <text class="title">{{ t('badge.demo.customColor') }}</text>
      <view class="content">
        <see-badge value="8" bg-color="#ff6b6b" color="#ffffff"></see-badge>
        <view class="ml-12" />
        <see-badge value="9" bg-color="#52f7bd" color="#1a1a1a"></see-badge>
        <view class="ml-12" />
        <see-badge :is-dot="true" bg-color="#ffd700"></see-badge>
      </view>

      <text class="title">{{ t('badge.demo.overflow') }}</text>
      <view class="content">
        <see-badge value="150" max="99" number-type="overflow" type="error"></see-badge>
        <view class="ml-12" />
        <see-badge value="150" max="99" number-type="ellipsis" type="warning"></see-badge>
        <view class="ml-12" />
        <see-badge value="2500" number-type="limit" type="primary"></see-badge>
      </view>

      <text class="title">{{ t('badge.demo.numberFormat') }}</text>
      <view class="content flex-sb">
        <see-badge value="999" number-type="limit" type="success"></see-badge>
        <see-badge value="1500" number-type="limit" type="success"></see-badge>
        <see-badge value="125000" number-type="limit" type="success"></see-badge>
        <see-badge value="9999999" number-type="limit" type="success"></see-badge>
      </view>

      <text class="title">{{ t('badge.demo.shape') }}</text>
      <view class="content">
        <see-badge value="5" shape="circle" type="primary"></see-badge>
        <view class="ml-12" />
        <see-badge value="5" shape="horn" type="primary"></see-badge>
      </view>

      <text class="title">{{ t('badge.demo.inverted') }}</text>
      <view class="content">
        <see-badge value="5" type="primary" :inverted="false"></see-badge>
        <view class="ml-12" />
        <see-badge value="5" type="primary" :inverted="true"></see-badge>
      </view>

      <text class="title">{{ t('badge.demo.size') }}</text>
      <view class="content">
        <see-badge value="5" :size="10"></see-badge>
        <view class="ml-12" />
        <see-badge value="5" :size="14"></see-badge>
        <view class="ml-12" />
        <see-badge value="5" :size="18"></see-badge>
      </view>

      <text class="title">{{ t('badge.demo.dotSize') }}</text>
      <view class="content">
        <see-badge :is-dot="true" :dot-size="8" type="primary"></see-badge>
        <view class="ml-12" />
        <see-badge :is-dot="true" :dot-size="16" type="primary"></see-badge>
        <view class="ml-12" />
        <see-badge :is-dot="true" :dot-size="24" type="primary"></see-badge>
      </view>

      <text class="title">{{ t('badge.demo.animation') }}</text>
      <view class="content flex-sb">
        <see-badge value="5" animation-type="scale" type="primary"></see-badge>
        <see-badge value="5" animation-type="fade" type="primary"></see-badge>
        <see-badge value="5" animation-type="bounce" type="primary"></see-badge>
        <see-badge value="5" :animate="false" type="primary"></see-badge>
      </view>

      <text class="title">{{ t('badge.demo.offset') }}</text>
      <view class="content flex-sb">
        <view class="box">
          <see-badge :is-dot="true" absolute value="3" :offset="[0, 0]" type="error"></see-badge>
        </view>
        <view class="box">
          <see-badge absolute value="1" :offset="[12, 12]" type="error"></see-badge>
        </view>
        <view class="box">
          <see-badge absolute value="2" :offset="[24, 24]" type="error"></see-badge>
        </view>
      </view>

      <text class="title">{{ t('badge.demo.realtime') }}</text>
      <view class="content">
        <see-text :text="t('badge.demo.messageCount')" />
        <see-badge :value="messageCount" max="99" type="primary"></see-badge>
        <view class="flex-sb">
          <see-button size="mini" is-ripple type="primary" @tap="addMessage">+1</see-button>
          <see-button size="mini" is-ripple type="warning" @tap="reduceMessage">-1</see-button>
          <see-button size="mini" is-ripple type="error" @tap="clearMessage">{{ t('badge.demo.clear') }}</see-button>
        </view>
      </view>
    </view>
  </see-config>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useI18n, useNavbarI18n } from '@/uni_modules/see-u-ui'

const { t } = useI18n()
useNavbarI18n('navbar.badge')

const messageCount = ref(5)

const addMessage = () => {
  messageCount.value++
}

const reduceMessage = () => {
  if (messageCount.value > 0) {
    messageCount.value--
  }
}

const clearMessage = () => {
  messageCount.value = 0
}
</script>

<style lang="scss" scoped>
.ml-12 {
  margin-left: 12px;
}
.gap-12 {
  width: 100%;
  height: 12px;
}

.flex-sb {
  width: 100%;
  display: flex;
  justify-content: space-between !important;
  margin-top: 12px;
}

.box {
  width: 100px;
  height: 100px;
  background-color: #909193;
  border-radius: 15px;
  position: relative;
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
    justify-content: flex-start;
  }
}
</style>

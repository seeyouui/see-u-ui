<template>
  <see-config>
    <view class="container">
      <text class="title">基础用法（4位数字验证码）</text>
      <view class="content">
        <see-code v-model="code1" @on-complete="onComplete1" />
        <text class="tips">当前值：{{ code1 }}</text>
      </view>

      <text class="title">6位验证码</text>
      <view class="content">
        <see-code v-model="code2" :length="6" @on-complete="onComplete2" />
        <text class="tips">当前值：{{ code2 }}</text>
      </view>

      <text class="title">方框类型（box）</text>
      <view class="content">
        <see-code v-model="code3" type="box" />
      </view>

      <text class="title">底线类型（line）</text>
      <view class="content">
        <see-code v-model="code4" type="line" />
      </view>

      <text class="title">下划线类型（bottom）</text>
      <view class="content">
        <see-code v-model="code5" type="bottom" />
      </view>

      <text class="title">遮罩模式</text>
      <view class="content">
        <see-code v-model="code6" is-mask />
        <text class="tips">输入内容将以圆点形式显示</text>
      </view>

      <text class="title">光标动画</text>
      <view class="content">
        <see-code v-model="code7" is-cursor />
        <text class="tips">聚焦时显示闪烁光标</text>
      </view>

      <text class="title">自动聚焦</text>
      <view class="content">
        <see-code v-model="code8" :is-focus="true" />
        <text class="tips">组件挂载后自动聚焦</text>
      </view>

      <text class="title">禁用状态</text>
      <view class="content">
        <see-code v-model="code9" is-disabled />
      </view>

      <text class="title">只读状态</text>
      <view class="content">
        <see-code v-model="code10" is-readonly />
      </view>

      <text class="title">不同尺寸</text>
      <view class="content">
        <see-code v-model="code11" size="small" />
        <text class="tips">小型 (small)</text>
      </view>
      <view class="content">
        <see-code v-model="code12" size="default" />
        <text class="tips">默认 (default)</text>
      </view>
      <view class="content">
        <see-code v-model="code13" size="large" />
        <text class="tips">大型 (large)</text>
      </view>

      <text class="title">自定义间距</text>
      <view class="content">
        <see-code v-model="code14" :gap="20" />
        <text class="tips">间距 20rpx</text>
      </view>

      <text class="title">字母键盘（text 类型）</text>
      <view class="content">
        <see-code v-model="code15" keyboard="text" :length="6" />
        <text class="tips">调用文本键盘输入字母</text>
      </view>

      <text class="title">组合用法：遮罩 + 光标 + 6位</text>
      <view class="content">
        <see-code v-model="code16" :length="6" is-mask is-cursor type="box" />
      </view>
    </view>
  </see-config>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const code1 = ref('')
const code2 = ref('')
const code3 = ref('')
const code4 = ref('')
const code5 = ref('')
const code6 = ref('')
const code7 = ref('')
const code8 = ref('')
const code9 = ref('1234')
const code10 = ref('5678')
const code11 = ref('')
const code12 = ref('')
const code13 = ref('')
const code14 = ref('')
const code15 = ref('')
const code16 = ref('')

const onComplete1 = (value: string) => {
  console.log('4位验证码输入完成：', value)
}

const onComplete2 = (value: string) => {
  console.log('6位验证码输入完成：', value)
}
</script>

<style lang="scss" scoped>
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
    margin-top: 12px;
    margin-bottom: 24px;
    flex-direction: column;
    align-items: flex-start;
  }
  .tips {
    margin-top: 8px;
    font-size: 12px;
    color: #999;
  }
}
</style>

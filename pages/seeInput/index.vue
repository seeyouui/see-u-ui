<template>
  <see-config>
    <view class="container">
      <text class="title">基础输入</text>
      <view class="content">
        <see-input v-model="basicText" placeholder="文本输入" />
        <see-input v-model="basicNumber" type="number" placeholder="数字输入" />
        <see-input v-model="basicPassword" type="password" placeholder="密码输入" />
      </view>

      <text class="title">带清除按钮</text>
      <view class="content">
        <see-input v-model="clearableValue" is-clearable placeholder="输入内容后点击清除" />
      </view>

      <text class="title">密码切换</text>
      <view class="content">
        <see-input v-model="passwordValue" type="password" is-show-password placeholder="点击切换密码可见" />
      </view>

      <text class="title">带前缀图标</text>
      <view class="content">
        <see-input v-model="prefixValue" prefix-icon="see-icon-search" placeholder="搜索" />
        <see-input v-model="phoneValue" prefix-icon="see-icon-phone" type="number" placeholder="手机号" />
      </view>

      <text class="title">带后缀图标</text>
      <view class="content">
        <see-input v-model="suffixValue" suffix-icon="see-icon-right" placeholder="带后缀图标" />
      </view>

      <text class="title">前后缀插槽</text>
      <view class="content">
        <see-input v-model="slotValue" placeholder="自定义前后缀">
          <template #prefix>
            <text style="font-size: 28rpx; color: #999; padding-right: 8rpx">https://</text>
          </template>
          <template #suffix>
            <text style="font-size: 28rpx; color: #999; padding-left: 8rpx">.com</text>
          </template>
        </see-input>
      </view>

      <text class="title">字数统计</text>
      <view class="content">
        <see-input v-model="limitValue" :maxlength="20" is-show-word-limit placeholder="最多输入20个字符" />
      </view>

      <text class="title">Formatter 格式化</text>
      <view class="content">
        <see-input v-model="phoneFormat" type="number" :maxlength="11" :formatter="phoneFormatter" placeholder="手机号格式化 (3-4-4)" />
        <see-input v-model="bankFormat" type="number" :maxlength="19" :formatter="bankFormatter" placeholder="银行卡号格式化 (每4位空格)" />
      </view>

      <text class="title">不同尺寸</text>
      <view class="content">
        <see-input v-model="sizeValue" size="small" placeholder="小型尺寸" />
        <see-input v-model="sizeValue" size="default" placeholder="默认尺寸" />
        <see-input v-model="sizeValue" size="large" placeholder="大型尺寸" />
      </view>

      <text class="title">禁用和只读</text>
      <view class="content">
        <see-input model-value="禁用状态" is-disabled />
        <see-input model-value="只读状态" is-readonly />
      </view>

      <text class="title">无边框</text>
      <view class="content">
        <see-input v-model="noBorderValue" :is-border="false" placeholder="无边框输入框" />
      </view>
    </view>
  </see-config>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const basicText = ref('')
const basicNumber = ref('')
const basicPassword = ref('')
const clearableValue = ref('可清除的内容')
const passwordValue = ref('')
const prefixValue = ref('')
const phoneValue = ref('')
const suffixValue = ref('')
const slotValue = ref('')
const limitValue = ref('')
const phoneFormat = ref('')
const bankFormat = ref('')
const sizeValue = ref('')
const noBorderValue = ref('')

/** 手机号格式化：3-4-4 */
const phoneFormatter = (value: string) => {
  const digits = value.replace(/\D/g, '')
  if (digits.length <= 3) return digits
  if (digits.length <= 7) return `${digits.slice(0, 3)} ${digits.slice(3)}`
  return `${digits.slice(0, 3)} ${digits.slice(3, 7)} ${digits.slice(7, 11)}`
}

/** 银行卡号格式化：每4位空格 */
const bankFormatter = (value: string) => {
  const digits = value.replace(/\D/g, '')
  return digits.replace(/(\d{4})(?=\d)/g, '$1 ')
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
    margin-top: 6px;
    margin-bottom: 24px;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
}
</style>

<template>
  <see-config>
    <view class="container">
      <text class="title">基础用法</text>
      <view class="content">
        <see-textarea v-model="basicValue" placeholder="请输入内容" />
      </view>

      <text class="title">自定义行数</text>
      <view class="content">
        <see-textarea v-model="rowsValue" :rows="5" placeholder="5行高度的文本域" />
      </view>

      <text class="title">自动增高</text>
      <view class="content">
        <see-textarea v-model="autoHeightValue" is-auto-height placeholder="输入内容自动增高" />
      </view>

      <text class="title">字数统计</text>
      <view class="content">
        <see-textarea v-model="limitValue" :maxlength="200" is-show-word-limit placeholder="最多输入200个字符" />
      </view>

      <text class="title">字数统计 + 自动增高</text>
      <view class="content">
        <see-textarea v-model="autoLimitValue" is-auto-height :maxlength="500" is-show-word-limit placeholder="自动增高 + 字数统计" />
      </view>

      <text class="title">带清除按钮</text>
      <view class="content">
        <see-textarea v-model="clearableValue" is-clearable placeholder="输入内容后可清除" />
      </view>

      <text class="title">不同尺寸</text>
      <view class="content">
        <see-textarea v-model="smallValue" size="small" placeholder="小型尺寸" />
        <see-textarea v-model="defaultValue" size="default" placeholder="默认尺寸" />
        <see-textarea v-model="largeValue" size="large" placeholder="大型尺寸" />
      </view>

      <text class="title">禁用和只读</text>
      <view class="content">
        <see-textarea model-value="这是禁用状态的文本域内容，不可编辑。" is-disabled />
        <see-textarea model-value="这是只读状态的文本域内容，不可编辑。" is-readonly />
      </view>

      <text class="title">无边框</text>
      <view class="content">
        <see-textarea v-model="noBorderValue" :is-border="false" placeholder="无边框文本域" />
      </view>

      <text class="title">键盘确认按钮</text>
      <view class="content">
        <see-textarea v-model="sendValue" confirm-type="send" placeholder="键盘确认按钮为「发送」" />
        <see-textarea v-model="nextValue" confirm-type="next" placeholder="键盘确认按钮为「下一个」" />
      </view>
    </view>
  </see-config>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const basicValue = ref('')
const rowsValue = ref('')
const autoHeightValue = ref('')
const limitValue = ref('')
const autoLimitValue = ref('')
const clearableValue = ref('可清除的内容')
const smallValue = ref('')
const defaultValue = ref('')
const largeValue = ref('')
const noBorderValue = ref('')
const sendValue = ref('')
const nextValue = ref('')
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
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
}

.info {
  font-size: 12px;
  color: #999;
}
</style>

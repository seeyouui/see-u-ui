<template>
  <see-config>
    <text class="title">{{ t('modal.demo.basic') }}</text>
    <view class="demo-content">
      <see-button :title="t('modal.demo.basicBtn')" type="primary" is-ripple @click="show1 = true" />
      <see-modal
        v-model:show="show1"
        :title="t('modal.demo.title')"
        :content="t('modal.demo.content')"
        @on-confirm="onConfirm"
        @on-cancel="onCancel"
      />
    </view>

    <text class="title">{{ t('modal.demo.noTitle') }}</text>
    <view class="demo-content">
      <see-button :title="t('modal.demo.noTitleBtn')" type="primary" is-ripple @click="show2 = true" />
      <see-modal v-model:show="show2" :is-show-header="false" :content="t('modal.demo.noTitleContent')" />
    </view>

    <text class="title">{{ t('modal.demo.noCancel') }}</text>
    <view class="demo-content">
      <see-button :title="t('modal.demo.noCancelBtn')" type="primary" is-ripple @click="show3 = true" />
      <see-modal
        v-model:show="show3"
        :title="t('modal.demo.title')"
        :content="t('modal.demo.confirmDelete')"
        :is-show-cancel-btn="false"
        confirm-type="danger"
        :confirm-text="t('modal.demo.deleteText')"
      />
    </view>

    <text class="title">{{ t('modal.demo.async') }}</text>
    <view class="demo-content">
      <see-button :title="t('modal.demo.asyncBtn')" type="primary" is-ripple @click="show4 = true" />
      <see-modal
        v-model:show="show4"
        :title="t('modal.demo.title')"
        :content="t('modal.demo.asyncContent')"
        :is-confirm-loading="isLoading"
        @on-confirm="handleAsyncConfirm"
      />
    </view>

    <text class="title">{{ t('modal.demo.custom') }}</text>
    <view class="demo-content">
      <see-button :title="t('modal.demo.customBtn')" type="primary" is-ripple @click="show5 = true" />
      <see-modal v-model:show="show5" :title="t('modal.demo.custom')">
        <view class="custom-content">
          <text class="custom-text">{{ t('modal.demo.slotContent') }}</text>
          <see-input :placeholder="t('modal.demo.placeholder')" />
        </view>
      </see-modal>
    </view>

    <text class="title">{{ t('modal.demo.imperative') }}</text>
    <view class="demo-content">
      <see-button :title="t('modal.demo.confirmBtn')" type="primary" is-ripple @click="showConfirm" />
    </view>
  </see-config>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { modal, toast, useI18n, useNavbarI18n } from '@/uni_modules/see-u-ui'

const { t } = useI18n()
useNavbarI18n('navbar.seeModal')

const show1 = ref(false)
const show2 = ref(false)
const show3 = ref(false)
const show4 = ref(false)
const show5 = ref(false)
const isLoading = ref(false)

const onConfirm = () => {
  toast.success(t('modal.demo.confirmed'))
}

const onCancel = () => {
  toast.info(t('modal.demo.cancelled'))
}

const handleAsyncConfirm = () => {
  isLoading.value = true
  setTimeout(() => {
    isLoading.value = false
    show4.value = false
    toast.success(t('modal.demo.completed'))
  }, 2000)
}

const showConfirm = async () => {
  const result = await modal.confirm(t('modal.demo.confirmAction'))
  if (result) {
    toast.success(t('modal.demo.confirmedText'))
  } else {
    toast.info(t('modal.demo.cancelledText'))
  }
}
</script>

<style lang="scss" scoped>
.title {
  display: block;
  padding: 20rpx 30rpx;
  font-size: 28rpx;
  color: var(--see-tips-color);
}
.demo-content {
  padding: 0 30rpx 30rpx;
}
.custom-content {
  padding: 20rpx 0;
}
.custom-text {
  font-size: 28rpx;
  color: var(--see-content-color);
  margin-bottom: 20rpx;
}
</style>

<template>
  <see-config>
    <text class="title">{{ t('actionSheet.demo.basic') }}</text>
    <view class="demo-content">
      <see-button :title="t('actionSheet.demo.basicBtn')" type="primary" is-ripple @click="show1 = true" />
      <see-action-sheet v-model:show="show1" :actions="basicActions" @on-select="onSelect" />
    </view>

    <text class="title">{{ t('actionSheet.demo.titleDesc') }}</text>
    <view class="demo-content">
      <see-button :title="t('actionSheet.demo.titleBtn')" type="primary" is-ripple @click="show2 = true" />
      <see-action-sheet
        v-model:show="show2"
        :title="t('actionSheet.demo.title')"
        :description="t('actionSheet.demo.description')"
        :actions="basicActions"
        @on-select="onSelect"
      />
    </view>

    <text class="title">{{ t('actionSheet.demo.danger') }}</text>
    <view class="demo-content">
      <see-button :title="t('actionSheet.demo.dangerBtn')" type="primary" is-ripple @click="show3 = true" />
      <see-action-sheet v-model:show="show3" :title="t('actionSheet.demo.confirmDelete')" :actions="dangerActions" @on-select="onSelect" />
    </view>

    <text class="title">{{ t('actionSheet.demo.disabled') }}</text>
    <view class="demo-content">
      <see-button :title="t('actionSheet.demo.disabledBtn')" type="primary" is-ripple @click="show4 = true" />
      <see-action-sheet v-model:show="show4" :actions="disabledActions" @on-select="onSelect" />
    </view>

    <text class="title">{{ t('actionSheet.demo.noCancel') }}</text>
    <view class="demo-content">
      <see-button :title="t('actionSheet.demo.noCancelBtn')" type="primary" is-ripple @click="show5 = true" />
      <see-action-sheet v-model:show="show5" :actions="basicActions" :is-show-cancel-btn="false" @on-select="onSelect" />
    </view>
  </see-config>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { toast, useI18n, useNavbarI18n } from '@/uni_modules/see-u-ui'
import type { ActionSheetAction } from '@/uni_modules/see-u-ui'

const { t } = useI18n()
useNavbarI18n('navbar.seeActionSheet')

const show1 = ref(false)
const show2 = ref(false)
const show3 = ref(false)
const show4 = ref(false)
const show5 = ref(false)

const basicActions: ActionSheetAction[] = [
  { name: t('actionSheet.demo.option1') },
  { name: t('actionSheet.demo.option2') },
  { name: t('actionSheet.demo.option3') }
]

const dangerActions: ActionSheetAction[] = [{ name: t('actionSheet.demo.edit') }, { name: t('actionSheet.demo.delete'), color: 'var(--see-error)' }]

const disabledActions: ActionSheetAction[] = [
  { name: t('actionSheet.demo.option1') },
  { name: t('actionSheet.demo.disabledOption'), isDisabled: true },
  { name: t('actionSheet.demo.option3') }
]

const onSelect = (action: ActionSheetAction, _index: number) => {
  toast.success(t('actionSheet.demo.selected', { name: action.name }))
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
</style>

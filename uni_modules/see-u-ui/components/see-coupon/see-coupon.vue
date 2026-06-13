<template>
  <view class="see-coupon" :class="couponClasses" @tap="onCardClick">
    <!-- 左侧：金额区 -->
    <view class="see-coupon__left">
      <view class="see-coupon__amount-wrap">
        <slot name="amount">
          <template v-if="props.discountText">
            <text class="see-coupon__discount">{{ props.discountText }}</text>
          </template>
          <template v-else>
            <text class="see-coupon__unit">{{ props.unit }}</text>
            <text class="see-coupon__amount">{{ props.amount }}</text>
          </template>
        </slot>
      </view>
      <text v-if="props.condition" class="see-coupon__condition">{{ props.condition }}</text>
    </view>

    <!-- 中间齿轮缺口装饰 -->
    <view class="see-coupon__divider">
      <view class="see-coupon__notch see-coupon__notch--top"></view>
      <view class="see-coupon__line"></view>
      <view class="see-coupon__notch see-coupon__notch--bottom"></view>
    </view>

    <!-- 右侧：信息区 -->
    <view class="see-coupon__right">
      <view class="see-coupon__info">
        <slot name="title">
          <text v-if="props.title" class="see-coupon__title">{{ props.title }}</text>
        </slot>
        <slot name="description">
          <text v-if="props.description" class="see-coupon__desc">{{ props.description }}</text>
        </slot>
        <text v-if="props.validDate" class="see-coupon__valid">{{ props.validDate }}</text>
      </view>
      <slot name="button">
        <view class="see-coupon__button" :class="{ 'see-coupon__button--disabled': isButtonDisabled }" @tap.stop="onButtonTap">
          {{ resolvedButtonText }}
        </view>
      </slot>
    </view>

    <!-- 右上角标签 -->
    <view v-if="props.tag" class="see-coupon__tag">{{ props.tag }}</view>

    <!-- 印章 -->
    <slot name="stamp">
      <view v-if="stampText" class="see-coupon__stamp">{{ stampText }}</view>
    </slot>
  </view>
</template>

<script lang="ts" setup>
/**
 * Coupon 优惠券
 * @description 电商优惠券卡片，左右两段（金额区 + 信息区），中间齿轮缺口装饰。支持多种状态与主题色。
 * @tutorial https://www.seeuui.cn/components/coupon/
 *
 * @property {String|Number} amount          主金额
 * @property {String}        unit            金额单位前缀（默认 ¥）
 * @property {String}        discountText    折扣文案（优先于 amount）
 * @property {String}        condition       使用条件
 * @property {String}        title           主标题
 * @property {String}        description     描述
 * @property {String}        validDate       有效期文案
 * @property {String}        buttonText      按钮文字
 * @property {Boolean}       isDisabled      是否禁用
 * @property {String}        status          状态：available / received / used / expired
 * @property {String}        type            主题色：primary / warning / success / error
 * @property {String}        tag             右上角标签
 *
 * @event {Function} onClick        点击整张卡片
 * @event {Function} onButtonClick  点击按钮
 */
import { computed } from 'vue'
import { useI18n } from '../../locale'
import type { SeeCouponProps, CouponStatus } from './type'

defineOptions({ name: 'SeeCoupon' })

const { t } = useI18n()

const props = withDefaults(defineProps<SeeCouponProps>(), {
  amount: '',
  unit: '¥',
  discountText: '',
  condition: '',
  title: '',
  description: '',
  validDate: '',
  buttonText: '',
  isDisabled: false,
  status: 'available' as CouponStatus,
  type: 'primary',
  tag: ''
})

const emit = defineEmits<{
  (e: 'onClick', payload: { amount?: string | number; status?: CouponStatus }): void
  (e: 'onButtonClick', payload: { amount?: string | number; status?: CouponStatus }): void
}>()

/** 印章文字 */
const stampText = computed(() => {
  if (props.status === 'used') return t('coupon.used')
  if (props.status === 'expired') return t('coupon.expired')
  return ''
})

/** 按钮是否禁用 */
const isButtonDisabled = computed(() => props.isDisabled || props.status !== 'available')

/** 按钮显示文字 */
const resolvedButtonText = computed(() => {
  if (props.status === 'received') return t('coupon.received')
  if (props.status === 'used') return t('coupon.used')
  if (props.status === 'expired') return t('coupon.expired')
  return props.buttonText || t('coupon.receive')
})

/** 容器 class */
const couponClasses = computed(() => ({
  [`see-coupon--${props.type}`]: !!props.type,
  'see-coupon--disabled': props.isDisabled || props.status === 'expired' || props.status === 'used'
}))

const onCardClick = () => {
  if (props.isDisabled) return
  emit('onClick', { amount: props.amount, status: props.status })
}

const onButtonTap = () => {
  if (isButtonDisabled.value) return
  emit('onButtonClick', { amount: props.amount, status: props.status })
}
</script>

<style lang="scss" scoped>
$primary: var(--see-primary, #3ca7ff);
$primary-dark: var(--see-primary-dark, #208ee8);
$primary-light: var(--see-primary-light, #e9f6ff);
$warning: var(--see-warning, #ffb645);
$warning-dark: var(--see-warning-dark, #f0a233);
$warning-light: var(--see-warning-light, #fff6e8);
$success: var(--see-success, #37d497);
$success-dark: var(--see-success-dark, #2bb881);
$success-light: var(--see-success-light, #f2fff9);
$error: var(--see-error, #ff6b6b);
$error-dark: var(--see-error-dark, #e85b5b);
$error-light: var(--see-error-light, #fff2f2);

.see-coupon {
  position: relative;
  display: flex;
  align-items: stretch;
  width: 100%;
  min-height: 180rpx;
  border-radius: 16rpx;
  overflow: hidden;
  background-color: var(--see-bg-color, #fff);
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.06);
  box-sizing: border-box;
  transition: opacity 0.2s ease;

  &--disabled {
    opacity: 0.55;
    pointer-events: none;
  }

  /* ---------- 左侧金额区 ---------- */
  &__left {
    flex: 0 0 236rpx;
    padding: 28rpx 18rpx;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: #fff;
    text-align: center;
    position: relative;
  }

  &__amount-wrap {
    display: flex;
    align-items: flex-start;
    justify-content: center;
    line-height: 1;
  }

  &__unit {
    font-size: 30rpx;
    font-weight: 600;
    color: #fff;
    margin-right: 2rpx;
    margin-top: 10rpx;
    opacity: 0.9;
  }

  &__amount {
    font-size: 72rpx;
    font-weight: 800;
    color: #fff;
    line-height: 0.9;
    letter-spacing: -2rpx;
  }

  &__discount {
    font-size: 56rpx;
    font-weight: 800;
    color: #fff;
    line-height: 0.95;
    letter-spacing: -1rpx;
  }

  &__condition {
    margin-top: 16rpx;
    padding-top: 14rpx;
    width: 80%;
    border-top: 2rpx solid rgba(255, 255, 255, 0.25);
    font-size: 22rpx;
    font-weight: 500;
    color: rgba(255, 255, 255, 0.85);
    line-height: 1.2;
  }

  /* ---------- 主题色 ---------- */
  &--primary &__left {
    background: linear-gradient(135deg, $primary, $primary-dark);
  }
  &--warning &__left {
    background: linear-gradient(135deg, $warning, $warning-dark);
  }
  &--success &__left {
    background: linear-gradient(135deg, $success, $success-dark);
  }
  &--error &__left {
    background: linear-gradient(135deg, $error, $error-dark);
  }

  /* ---------- 中间齿轮缺口 ---------- */
  &__divider {
    position: relative;
    width: 24rpx;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
  }

  &__notch {
    width: 24rpx;
    height: 24rpx;
    border-radius: 50%;
    background: #f5f6f7;
    flex-shrink: 0;
    &--top {
      margin-top: -12rpx;
    }
    &--bottom {
      margin-bottom: -12rpx;
    }
  }

  &__line {
    flex: 1;
    width: 2rpx;
    margin: 4rpx 0;
    background-image: linear-gradient(to bottom, #e5e5e5 50%, transparent 50%);
    background-size: 2rpx 12rpx;
    background-repeat: repeat-y;
  }

  /* ---------- 右侧信息区 ---------- */
  &__right {
    flex: 1;
    padding: 20rpx 24rpx;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16rpx;
    min-width: 0;
  }

  &__info {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 6rpx;
    min-width: 0;
  }

  &__title {
    font-size: 28rpx;
    font-weight: 600;
    color: var(--see-main-color, #2e2f33);
    line-height: 1.2;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &__desc {
    font-size: 22rpx;
    color: var(--see-content-color, #5a5c60);
    line-height: 1.2;
  }

  &__valid {
    font-size: 20rpx;
    color: var(--see-tips-color, #8c8e93);
    line-height: 1.2;
  }

  /* ---------- 按钮 ---------- */
  &__button {
    flex: 0 0 auto;
    padding: 12rpx 24rpx;
    border-radius: 28rpx;
    font-size: 24rpx;
    color: #fff;
    line-height: 1.2;
    white-space: nowrap;
    transition: opacity 0.2s ease;

    &--disabled {
      opacity: 0.5;
      pointer-events: none;
    }
  }

  &--primary &__button {
    background: $primary;
  }
  &--warning &__button {
    background: $warning;
  }
  &--success &__button {
    background: $success;
  }
  &--error &__button {
    background: $error;
  }

  /* ---------- 标签 ---------- */
  &__tag {
    position: absolute;
    top: 0;
    right: 0;
    padding: 4rpx 12rpx;
    font-size: 20rpx;
    color: #fff;
    background: rgba(0, 0, 0, 0.55);
    border-radius: 0 16rpx 0 12rpx;
    z-index: 1;
  }

  /* ---------- 印章 ---------- */
  &__stamp {
    position: absolute;
    top: 50%;
    right: 32rpx;
    transform: translateY(-50%) rotate(-18deg);
    padding: 8rpx 20rpx;
    border: 4rpx solid currentColor;
    border-radius: 12rpx;
    color: var(--see-error, #ff6b6b);
    font-size: 28rpx;
    font-weight: 700;
    letter-spacing: 4rpx;
    background: rgba(255, 255, 255, 0.75);
    pointer-events: none;
    z-index: 2;
  }
}
</style>

<template>
	<!-- #ifdef H5 -->
	<view :id="seeButtonId" :style="{ ...props.customStyle, borderRadius: props.radius + 'px' }" class="see-button" :class="[props.size]" @click="onTouchstart($event)">
		<!-- #endif -->
		<!-- #ifndef H5 -->
		<view :id="seeButtonId" :style="{ ...props.customStyle, borderRadius: props.radius + 'px' }" class="see-button" :class="[props.size]" @touchstart="onTouchstart($event)">
			<!-- #endif -->
			<button
				:style="{
					...props.customStyle,
					borderRadius: props.radius + 'px',
					background: props.color
				}"
				class="see-botton-class"
				:class="[
					props.size,
					props.isDisabled && `disabled-${props.type}`,
					props.isHollow ? `hollow-${props.type}` : props.type,
					`border-${props.type}-${props.border ?? 1}`
				]"
				:hover-class="getHoverClass"
				:disabled="props.isDisabled"
			>
				<text :style="{ color: props.textColor }" class="title">{{ props.title }}</text>
				<slot></slot>
			</button>
			<view
				v-if="props.isRipple"
				class="see-button-ripple"
				:class="{ active: active }"
				:style="{
					...props.rippleStyle,
					top: rippleTop + 'px',
					left: rippleLeft + 'px',
					width: field.finalWidth + 'px',
					height: field.finalWidth + 'px',
					'background-color': rippleColor,
					'--ripple-time': props.rippleTime + 'ms',
					'--mask-time': props.maskTime + 'ms'
				}"
			></view>
			<!-- #ifdef H5 -->
		</view>
		<!-- #endif -->
		<!-- #ifndef H5 -->
	</view>
	<!-- #endif -->
</template>

<script lang="ts">
/**
 * Button 按钮
 * @description 此组件基于uniapp官方button，进行二次封装
 * @tutorial https://www.seeuui.cn/components/button/
 *
 * @property {String}												title			标题
 * @property {"normal" | "large" | "small" | "mini"}				size			大小（默认normal）
 * @property {"info" | "primary" | "error" | "warning" | "success"}	type			按钮的预置样式，info，primary，error，warning，success (默认 'info' )
 * @property {Style}												color			按钮颜色(默认空，会覆盖type的颜色)
 * @property {Style}												textColor		标题颜色
 * @property {Boolean}												isRipple		是否启用水波纹（默认false）
 * @property {Number}												rippleTime		水波纹持续时间（默认500ms）
 * @property {Number}												maskTime		遮罩层持续时间（默认1000ms，建议为rippleTime的2倍）
 * @property {String}												rippleColor		水波纹颜色（默认rgba(0, 0, 0, .15)）
 * @property {Object}												rippleStyle		水波纹样式
 * @property {Object}												customStyle		按钮样式
 * @property {String | NULL}										hoverClass		点击按钮时样式
 * @property {1 | 0}												border			按钮边框（默认1，为0时无边框）
 * @property {Boolean}												isDisabled		是否禁用状态
 * @property {Number}												radius			圆角（默认4px）
 *
 * @example
 */
export default {
	name: 'SeeButton'
};
</script>
<script lang="ts" setup>
import { ref, computed, nextTick, getCurrentInstance } from 'vue';
import type { TouchEvent, ClientRectData, RippleItem } from './type';

let globalId = 0;
const instance = getCurrentInstance();

/** ---------- props ---------- */
const props = withDefaults(
	defineProps<{
		title?: string;
		size?: 'normal' | 'large' | 'small' | 'mini';
		type?: 'info' | 'primary' | 'error' | 'warning' | 'success';
		color?: string;
		textColor?: string;
		isRipple?: boolean;
		rippleTime?: number;
		maskTime?: number;
		isHollow?: boolean;
		rippleColor?: string;
		rippleStyle?: Record<string, any> | null;
		customStyle?: Record<string, any> | null;
		hoverClass?: string | null;
		border?: 1 | 0;
		isDisabled?: boolean;
		radius?: number;
	}>(),
	{
		title: '',
		size: 'normal',
		type: 'info',
		color: '',
		textColor: '',
		isRipple: false,
		rippleTime: 500,
		maskTime: 1000,
		isHollow: false,
		rippleColor: 'rgba(0, 0, 0, .15)',
		rippleStyle: null,
		customStyle: null,
		hoverClass: '',
		border: 1,
		isDisabled: false,
		radius: 4
	}
);

/** ---------- emits ---------- */
const emit = defineEmits<{
	(e: 'onTap'): void;
}>();

/** ---------- state ---------- */
globalId++;
const rippleTop = ref(0);
const rippleLeft = ref(0);
const active = ref(false);
const field = ref<any>({});
const seeButtonId = 'seeButton_' + globalId;

/** 水波动画队列 */
let rippleUniqueId = 0;
const rippleQueue = ref<RippleItem[]>([]);

/** ---------- methods ---------- */
/**
 * @title 生成按钮 hoverClass
 * @description 根据按钮的多种配置动态计算最终的 hover class。
 *
 * @returns {string} 最终用于组件的 hover class 名称
 */
const getHoverClass = computed(() => {
	if (props.isRipple) return 'none';
	if (props.hoverClass) return props.hoverClass;

	if (props.isHollow) {
		return `button-hover-${props.type}-hollow`;
	}

	return `button-hover-${props.type}`;
});

/**
 * @title 触摸开始事件（H5: click / App: touchstart）
 * @description 触发水波纹动画的入口函数。
 *
 * @param {Event} e 触摸或点击事件对象
 */
const onTouchstart = (e: any) => {
	active.value = false;
	nextTick(() => activeWaves(e));
};

/**
 * @title 启动水波纹效果
 * @description 根据触点坐标与按钮尺寸计算水波纹的位置与直径，然后启动动画。
 *
 * 平台兼容：
 * - 百度小程序：使用 changedTouches
 * - 支付宝小程序：使用 detail
 * - 其他平台：使用 touches
 *
 * @param {TouchEvent} e 触摸事件
 */
const activeWaves = (e: TouchEvent) => {
	getClientRect().then((data: ClientRectData) => {
		if (!data?.height) return;

		data.finalWidth = data.height > data.width ? data.height : data.width;
		if (!data.finalWidth) return;

		field.value = data;

		let touchesX: number;
		let touchesY: number;

		// #ifdef MP-BAIDU
		touchesX = e.changedTouches[0].clientX;
		touchesY = e.changedTouches[0].clientY;
		// #endif

		// #ifdef MP-ALIPAY
		touchesX = e.detail.clientX;
		touchesY = e.detail.clientY;
		// #endif

		// #ifndef MP-BAIDU || MP-ALIPAY
		touchesX = e.touches[0].clientX;
		touchesY = e.touches[0].clientY;
		// #endif

		rippleTop.value = touchesY - data.top - data.finalWidth / 2;
		rippleLeft.value = touchesX - data.left - data.finalWidth / 2;

		nextTick(() => (active.value = true));

		rippleQueue.value.push({
			id: rippleUniqueId++,
			x: touchesX - data.left - data.finalWidth / 2,
			y: touchesY - data.top - data.finalWidth / 2,
			size: data.finalWidth
		});
	});
};

// 新增：动画结束回调，替代 setTimeout
const removeRipple = (id: number) => {
	const index = rippleQueue.value.findIndex((item) => item.id === id);
	if (index > -1) rippleQueue.value.splice(index, 1);
};

/**
 * @title 获取按钮 DOM 位置与尺寸
 * @description Promise 包装的 uni.createSelectorQuery，用于获取按钮位置。
 *
 * @returns {Promise<ClientRectData>} 按钮的位置信息
 */
const getClientRect = () => {
	return new Promise((resolve) => {
		const query = uni.createSelectorQuery().in(instance);
		const id = '#' + seeButtonId;

		query
			.select(id)
			.boundingClientRect((data) => {
				resolve(data);
			})
			.exec();
	});
};
</script>

<style lang="scss" scoped>
/** ---------- disabled ---------- */
.disabled-info {
}
.disabled-primary {
	background-color: $see-primary-disabled !important;
}
.disabled-error {
	background-color: $see-error-disabled !important;
}
.disabled-warning {
	background-color: $see-warning-disabled !important;
}
.disabled-success {
	background-color: $see-success-disabled !important;
}
/** ---------- border ---------- */
.border-info-0,
.border-primary-0,
.border-error-0,
.border-warning-0,
.border-success-0 {
	box-shadow: none !important;
}
.border-info-1 {
	box-shadow: inset 0 0 0 1px #ebedf0 !important;
}

.border-primary-1 {
	box-shadow: inset 0 0 0 1px $see-primary !important;
}

.border-error-1 {
	box-shadow: inset 0 0 0 1px $see-error !important;
}

.border-warning-1 {
	box-shadow: inset 0 0 0 1px $see-warning !important;
}

.border-success-1 {
	box-shadow: inset 0 0 0 1px $see-success !important;
}
/** ---------- size ---------- */
.normal {
	min-width: 180rpx;
	min-height: 41px;
}
.small {
	min-width: 60px;
	min-height: 40px;
	font-size: 14px;
}
.mini {
	min-width: 30px;
	min-height: 20px;
	font-size: 10px;
}
.large {
	min-width: 100%;
	min-height: 41px;
}
/** ---------- type ---------- */
.info {
}
.primary {
	background-color: $see-primary;
	text {
		color: $see-primary-light;
	}
}
.error {
	background-color: $see-error;
	text {
		color: $see-error-light;
	}
}
.warning {
	background-color: $see-warning;
	text {
		color: $see-warning-light;
	}
}
.success {
	background-color: $see-success;
	text {
		color: $see-success-light;
	}
}
/** ---------- button-hover ---------- */
.button-hover-info {
	color: rgba(0, 0, 0, 0.6);
	background-color: #dedede;
}
.button-hover-primary {
	background-color: $see-primary-dark !important;
}

.button-hover-error {
	background-color: $see-error-dark !important;
}

.button-hover-warning {
	background-color: $see-warning-dark !important;
}

.button-hover-success {
	background-color: $see-success-dark !important;
}
/** ---------- hollow base ---------- */
.hollow-info,
.hollow-primary,
.hollow-error,
.hollow-warning,
.hollow-success {
	background-color: transparent !important;
	border: none !important;
}
:deep(.hollow-info)::after {
	border: none !important;
}
:deep(.hollow-primary)::after {
	border: none !important;
}
:deep(.hollow-error)::after {
	border: none !important;
}
:deep(.hollow-warning)::after {
	border: none !important;
}
:deep(.hollow-success)::after {
	border: none !important;
}
.hollow-info {
	border-color: #aaa;
	color: #666;
}
.hollow-info text {
	color: #666;
}
.hollow-primary {
	border-color: $see-primary;
	color: $see-primary;
}
.hollow-primary text {
	color: $see-primary;
}
.hollow-error {
	border-color: $see-error;
	color: $see-error;
}
.hollow-error text {
	color: $see-error;
}
.hollow-warning {
	border-color: $see-warning;
	color: $see-warning;
}
.hollow-warning text {
	color: $see-warning;
}
.hollow-success {
	border-color: $see-success;
	color: $see-success;
}
.hollow-success text {
	color: $see-success;
}
/** ---------- hollow hover ---------- */
.button-hover-info-hollow {
	background-color: rgba(0, 0, 0, 0.05) !important;
}
.button-hover-primary-hollow {
	background-color: rgba($see-primary, 0.1) !important;
}
.button-hover-error-hollow {
	background-color: rgba($see-error, 0.1) !important;
}
.button-hover-warning-hollow {
	background-color: rgba($see-warning, 0.1) !important;
}
.button-hover-success-hollow {
	background-color: rgba($see-success, 0.1) !important;
}
/** ---------- components ---------- */
.title {
}
.see-button {
	position: relative;
	overflow: hidden;

	display: inline-flex;
	width: auto;

	.see-button-ripple {
		position: absolute;
		border-radius: 100%;
		background-clip: padding-box;
		pointer-events: none;
		user-select: none;
		transform: scale(0);
		opacity: 1;
	}

	.active {
		opacity: 0;
		// transform: scale(2);
		// transition: opacity 1s ease-out, transform 0.5s ease-out;
		transform: scale(0);
		opacity: 1;
		/* 两个动画同时进行：扩散(ripple-grow) 和 消失(ripple-fade) */
		animation: ripple-grow var(--ripple-time) linear forwards, ripple-fade var(--mask-time) ease-out forwards;
	}
}
@keyframes ripple-grow {
	to {
		transform: scale(2);
	}
}

@keyframes ripple-fade {
	to {
		opacity: 0;
	}
}
.see-botton-class {
	display: inline-flex;
	width: auto;

	align-items: center;
	justify-content: center;
}
button::after {
	border: none !important;
}
</style>

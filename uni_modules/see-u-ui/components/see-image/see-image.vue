<template>
	<view class="see-image-wrapper" :style="{ ...props.customStyle }">
		<!-- 加载中状态 -->
		<view v-if="loading" class="see-image-loading">
			<text class="loading-text">{{ props.loadingText }}</text>
		</view>

		<!-- 错误状态 -->
		<view v-if="error && !props.showErrorImage" class="see-image-error">
			<text class="error-text">{{ props.errorText }}</text>
		</view>

		<!-- 图片容器 -->
		<view
			v-if="!error || props.showErrorImage"
			class="see-image-container"
			:style="{
				width: props.width,
				height: props.height,
				borderRadius: props.radius + 'px',
				overflow: 'hidden',
				position: 'relative'
			}"
			@click="onImageClick"
		>
			<!-- 主图片 -->
			<image
				class="see-image"
				:src="error && props.showErrorImage ? props.errorImage : props.src"
				:mode="props.mode"
				:lazy-load="props.lazyLoad"
				:show-menu-by-longpress="props.showMenuByLongpress"
				:style="{
					opacity: loading ? 0 : 1,
					transition: `opacity ${props.fadeInDuration}ms ease-in-out`,
					width: '100%',
					height: '100%'
				}"
				@load="onImageLoad"
				@error="onImageError"
				@longpress="onLongpress"
			/>

			<!-- 遮罩层 -->
			<view
				v-if="props.showMask"
				class="see-image-mask"
				:style="{
					backgroundColor: props.maskColor,
					opacity: props.maskOpacity
				}"
			/>

			<!-- 自定义内容插槽 -->
			<view v-if="$slots.default" class="see-image-slot">
				<slot></slot>
			</view>
		</view>

		<!-- 预览模式提示 -->
		<text v-if="props.previewMode" class="preview-tip">{{ props.previewTip }}</text>
	</view>
</template>

<script lang="ts" setup>
/**
 * Image 图片
 * @description 此组件基于uniapp官方image，进行二次封装，集成了加载动画、错误处理、图片预览、遮罩层等功能。
 * @tutorial https://www.seeuui.cn/components/image/
 *
 * @property {String}												src				图片源地址（必填）
 * @property {String}												width			图片宽度（默认100%）
 * @property {String}												height			图片高度（默认100%）
 * @property {"scaleToFill" | "aspectFit" | "aspectFill" | "widthFix" | "heightFix" | "top" | "bottom" | "center" | "left" | "right" | "top left" | "top right" | "bottom left" | "bottom right"}	mode	图片模式（默认scaleToFill）
 * @property {Number}												radius			圆角（默认0px）
 * @property {Boolean}												lazyLoad		是否开启懒加载（默认true）
 * @property {Boolean}												previewMode		是否开启预览模式（默认false）
 * @property {Boolean}												showMask		是否显示遮罩层（默认false）
 * @property {String}												maskColor		遮罩层颜色（默认#000）
 * @property {Number}												maskOpacity		遮罩层透明度（默认0.3）
 * @property {Number}												fadeInDuration	淡入动画时长（默认300ms）
 * @property {String}												loadingText		加载文本（默认加载中...）
 * @property {Boolean}												showErrorImage	是否显示错误图片（默认false）
 * @property {String}												errorImage		错误时显示的图片
 * @property {String}												errorText		错误文本（默认图片加载失败）
 * @property {Boolean}												showMenuByLongpress	长按显示菜单（默认true）
 * @property {Object}												customStyle		自定义样式
 * @property {String}												previewTip		预览模式提示文本（默认点击图片预览）
 *
 * @example
 */
import { ref, computed } from 'vue';

defineOptions({
	name: 'SeeImage'
});

/** ---------- props ---------- */
const props = withDefaults(
	defineProps<{
		src: string;
		width?: string;
		height?: string;
		mode?:
			| 'scaleToFill'
			| 'aspectFit'
			| 'aspectFill'
			| 'widthFix'
			| 'heightFix'
			| 'top'
			| 'bottom'
			| 'center'
			| 'left'
			| 'right'
			| 'top left'
			| 'top right'
			| 'bottom left'
			| 'bottom right';
		radius?: number;
		lazyLoad?: boolean;
		previewMode?: boolean;
		showMask?: boolean;
		maskColor?: string;
		maskOpacity?: number;
		fadeInDuration?: number;
		loadingText?: string;
		showErrorImage?: boolean;
		errorImage?: string;
		errorText?: string;
		showMenuByLongpress?: boolean;
		customStyle?: Record<string, any> | null;
		previewTip?: string;
	}>(),
	{
		src: '',
		width: '100%',
		height: '100%',
		mode: 'scaleToFill',
		radius: 0,
		lazyLoad: true,
		previewMode: false,
		showMask: false,
		maskColor: '#000',
		maskOpacity: 0.3,
		fadeInDuration: 300,
		loadingText: '加载中...',
		showErrorImage: false,
		errorImage: '',
		errorText: '图片加载失败',
		showMenuByLongpress: true,
		customStyle: null,
		previewTip: '点击图片预览'
	}
);

/** ---------- emits ---------- */
const emit = defineEmits<{
	(e: 'onLoad'): void;
	(e: 'onError'): void;
	(e: 'onClick'): void;
	(e: 'onLongpress'): void;
}>();

/** ---------- state ---------- */
const loading = ref(true);
const error = ref(false);

/** ---------- computed ---------- */
const imageList = computed(() => {
	return [props.src];
});

/** ---------- methods ---------- */
/**
 * @title 图片加载完成
 */
const onImageLoad = () => {
	loading.value = false;
	error.value = false;
	emit('onLoad');
};

/**
 * @title 图片加载失败
 */
const onImageError = () => {
	loading.value = false;
	error.value = true;
	emit('onError');
};

/**
 * @title 图片点击事件
 */
const onImageClick = () => {
	emit('onClick');

	if (props.previewMode) {
		uni.previewImage({
			urls: imageList.value,
			current: 0,
			showmenu: true
		});
	}
};

/**
 * @title 长按事件
 */
const onLongpress = () => {
	emit('onLongpress');
};

/** ---------- 暴露方法 ---------- */
defineExpose({
	// 重新加载图片
	reload: () => {
		loading.value = true;
		error.value = false;
	},
	// 获取加载状态
	getLoadingState: () => loading.value,
	// 获取错误状态
	getErrorState: () => error.value
});
</script>

<style lang="scss" scoped>
.see-image-wrapper {
	display: inline-block;
	position: relative;
}

/* 加载状态 */
.see-image-loading {
	display: flex;
	align-items: center;
	justify-content: center;
	background-color: #f5f5f5;
	color: #999;
	font-size: 14px;
	min-height: 100px;

	.loading-text {
		animation: loading-spin 1s linear infinite;
	}
}

@keyframes loading-spin {
	0% {
		transform: rotate(0deg);
	}
	100% {
		transform: rotate(360deg);
	}
}

/* 错误状态 */
.see-image-error {
	display: flex;
	align-items: center;
	justify-content: center;
	background-color: #f0f0f0;
	color: #ccc;
	font-size: 14px;
	min-height: 100px;
	border: 1px solid #e0e0e0;

	.error-text {
		text-align: center;
	}
}

/* 图片容器 */
.see-image-container {
	position: relative;
	display: inline-block;

	.see-image {
		display: block;
		width: 100%;
		height: 100%;
	}
}

/* 遮罩层 */
.see-image-mask {
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	pointer-events: none;
}

/* 自定义内容插槽 */
.see-image-slot {
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	display: flex;
	align-items: center;
	justify-content: center;
	pointer-events: none;
}

/* 预览模式提示 */
.preview-tip {
	display: block;
	margin-top: 8px;
	font-size: 12px;
	color: #999;
	text-align: center;
}
</style>

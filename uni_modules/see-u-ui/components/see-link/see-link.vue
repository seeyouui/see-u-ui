<template>
	<text :class="getClass" :style="getStyle" @click="onClick">{{ props.text }}</text>
</template>

<script lang="ts">
/**
 * Link 链接
 * @description 暂无说明
 * @tutorial https://www.seeuui.cn/components/link/
 *
 * @property {String | Number}										text			内容
 * @property {"info" | "primary" | "error" | "warning" | "success"}	type			文本的预置样式，info，primary，error，warning，success (默认 'info' )
 * @property {String}												color			自定义文本颜色（填写此值时，type失效。）
 * @property {String}												href			超链接
 * @property {Boolean}												isLine			是否添加下划线（默认false）
 * @property {String}												lineColor		下划线颜色（填写此字段后type失效）
 * @property {String | Number}										size			字体大小（px），默认16
 * @example
 */
export default {
	name: 'SeeLink'
};
</script>
<script lang="ts" setup>
import { nextTick, computed } from 'vue';

/** ---------- props ---------- */
const props = withDefaults(
	defineProps<{
		text?: string | number;
		type?: 'info' | 'primary' | 'error' | 'warning' | 'success';
		color?: string;
		href?: string;
		isLine?: boolean;
		lineColor?: string;
		size: string | number;
	}>(),
	{
		text: '',
		type: 'info',
		color: '',
		href: '',
		isLine: false,
		lineColor: '',
		size: 16
	}
);

/** ---------- emits ---------- */
const emit = defineEmits<{
	(e?: 'onClick'): void;
}>();

const getClass = computed(() => {
	const classes: string[] = [];
	// 当没有自定义颜色时，应用 type 类型 (primary/error/etc)
	if (!props.color) {
		classes.push(props.type);
	}
	// 是否添加下划线样式类
	if (props.isLine) {
		classes.push('href');
	}
	return classes.join(' ');
});

const getStyle = computed(() => {
	const style: Record<string, string> = {};

	if (props.color) {
		style.color = props.color;
	}

	// 如果有下划线且定义了下划线颜色，覆盖默认边框色
	if (props.isLine && props.lineColor) {
		style.borderBottomColor = props.lineColor;
	}

	// 添加字体大小
	style.fontSize = typeof props.size === 'number' ? `${props.size}px` : props.size;

	return style;
});

const onClick = () => {
	emit('onClick');
	if (props.href ?? '') {
		// #ifdef APP-PLUS
		plus.runtime.openURL(props.href);
		// #endif
		// #ifdef H5
		window.open(props.href);
		// #endif
		// #ifdef MP
		uni.setClipboardData({
			data: props.href,
			success: () => {
				uni.hideToast();
				nextTick(() => {
					uni.showToast({
						title: '链接已复制，请在浏览器打开',
						icon: 'none'
					});
				});
			}
		});
		// #endif
	}
};
</script>

<style lang="scss" scoped>
.info {
}
.primary {
	color: $see-primary;
}
.error {
	color: $see-error;
}
.warning {
	color: $see-warning;
}
.success {
	color: $see-success;
}

.href {
	border-bottom: 1px $see-primary solid;
}
</style>

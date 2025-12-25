<template>
	<view class="see-badge" :style="badgeWrapperStyle" @click="onClick">
		<slot></slot>

		<view v-if="isShow" class="see-badge__content" :class="[`badge-${props.shape}`, { 'is-dot': props.isDot }, { 'is-inverted': props.inverted }]" :style="badgeContentStyle">
			<text v-if="!props.isDot" class="see-badge__text">
				{{ displayValue }}
			</text>
		</view>
	</view>
</template>

<script lang="ts" setup>
/**
 * Badge 徽标数
 * @description 徽标数组件，用于显示未读消息数量、提示用户等场景。支持圆点形式和包含文字形式，拥有多种展示模式和丰富的自定义选项。
 * @tutorial https://www.seeuui.cn/components/badge/
 *
 * @property {String | Number}										value			展示的数字或文本内容
 * @property {'info' | 'primary' | 'error' | 'warning' | 'success'}	type			徽标主题类型（默认 'error'）
 * @property {String}												color			自定义文字颜色（优先级高于type）
 * @property {String}												bgColor			自定义背景颜色（优先级高于type）
 * @property {String | Number}										max				最大值，超过显示 '{max}+'
 * @property {Boolean}												isDot			是否只显示圆点，不显示数字（默认 false）
 * @property {Boolean}												show			是否显示徽标（默认 true）
 * @property {Boolean}												showZero		数值为0时是否显示（默认 false）
 * @property {'circle' | 'horn'}									shape			徽标形状，circle-四角均为圆角，horn-左下角为直角（默认 'circle'）
 * @property {'overflow' | 'ellipsis' | 'limit'}					numberType		数字显示方式（默认 'overflow'）
 * @property {[number, number]}										offset			徽标位置偏移 [top, right]，单位 rpx（默认 [0, 0]）
 * @property {Boolean}												absolute		是否使用绝对定位（默认 false）
 * @property {Boolean}												inverted		是否反转背景和文字颜色（默认 false）
 * @property {Number}												size			字体大小，单位 px（默认 12）
 * @property {Number}												dotSize			圆点大小，单位 rpx（默认 8）
 * @property {Boolean}												animate			是否启用显示隐藏动画（默认 true）
 * @property {String}												animationType	动画类型，scale-缩放，fade-淡入淡出，bounce-弹跳（默认 'scale'）
 * @property {Number}												animateDuration	动画时长，单位 ms（默认 300）
 * @example
 * <see-badge value="5" type="error"></see-badge>
 * <see-badge :isDot="true" type="success"></see-badge>
 */

import { computed } from 'vue';

defineOptions({
	name: 'SeeBadge'
});

interface BadgeProps {
	value?: string | number;
	type?: 'info' | 'primary' | 'error' | 'warning' | 'success';
	color?: string;
	bgColor?: string;
	max?: string | number;
	isDot?: boolean;
	show?: boolean;
	showZero?: boolean;
	shape?: 'circle' | 'horn';
	numberType?: 'overflow' | 'ellipsis' | 'limit';
	offset?: [number, number];
	absolute?: boolean;
	inverted?: boolean;
	size?: number;
	dotSize?: number;
}

const props = withDefaults(defineProps<BadgeProps>(), {
	value: '',
	type: 'error',
	color: '',
	bgColor: '',
	max: 99,
	isDot: false,
	show: true,
	showZero: false,
	shape: 'circle',
	numberType: 'overflow',
	offset: () => [0, 0],
	absolute: false,
	inverted: false,
	size: 8,
	dotSize: 18
});

const emit = defineEmits<{
	(e: 'onClick'): void;
}>();

/** 主题色配置 */
const themeColorMap = {
	info: { bg: '#919399', text: '#ffffff' },
	primary: '#0066cc',
	error: '#dd001b',
	warning: '#ff6600',
	success: '#19be6b'
};

/** 计算是否显示徽标 */
const isShow = computed(() => {
	if (!props.show) return false;

	if (props.isDot) return true;

	const val = props.value;
	if ((val === '' || val === 0) && !props.showZero) return false;

	return true;
});

/** 计算显示的值 */
const displayValue = computed(() => {
	if (props.isDot) return '';

	let val = props.value;
	const max = Number(props.max);

	// overflow 模式：超过最大值显示 '{max}+'
	if (props.numberType === 'overflow') {
		if (Number(val) > max) {
			return `${max}+`;
		}
		return String(val);
	}

	// ellipsis 模式：超过最大值显示 '{max}...'
	if (props.numberType === 'ellipsis') {
		if (Number(val) > max) {
			return `${max}...`;
		}
		return String(val);
	}

	// limit 模式：按 1000、10000 格式化显示
	if (props.numberType === 'limit') {
		const numVal = Number(val);
		if (numVal >= 10000) {
			return (numVal / 10000).toFixed(2).replace(/\.?0+$/, '') + 'w';
		}
		if (numVal >= 1000) {
			return (numVal / 1000).toFixed(2).replace(/\.?0+$/, '') + 'k';
		}
		return String(val);
	}

	return String(val);
});

/** 获取背景颜色 */
const getBgColor = (): string => {
	if (props.bgColor) return props.bgColor;

	const themeColor = themeColorMap[props.type];
	if (typeof themeColor === 'object') {
		return themeColor.bg;
	}
	return themeColor;
};

/** 获取文字颜色 */
const getTextColor = (): string => {
	if (props.color) return props.color;

	const themeColor = themeColorMap[props.type];
	if (typeof themeColor === 'object') {
		return themeColor.text;
	}
	return '#ffffff';
};

/** 计算徽标内容样式 */
const badgeContentStyle = computed(() => {
	let bgColor = getBgColor();
	let textColor = getTextColor();

	// 反转颜色
	if (props.inverted) {
		[bgColor, textColor] = [textColor, bgColor];
	}

	const style: Record<string, string | number> = {
		backgroundColor: props.inverted ? textColor : bgColor,
		color: props.inverted ? bgColor : textColor,
		fontSize: `${props.size}px`
	};

	// 绝对定位
	if (props.absolute) {
	    style.transform = 'translate(50%, -50%)'; 
	}

	// 圆点大小
	if (props.isDot) {
		style.width = `${props.dotSize}rpx`;
		style.height = `${props.dotSize}rpx`;
	}

	return style;
});

/** 计算徽标包裹层样式 */
const badgeWrapperStyle = computed(() => {
    const style: Record<string, string | number> = {
        display: 'inline-block'
    };

    if (props.absolute) {
        // 修改点 1：让 wrapper 自身变成绝对定位，去寻找父级 .box
        style.position = 'absolute'; 
        style.top = `${props.offset[0]}rpx`;
        style.right = `${props.offset[1]}rpx`;
        style.zIndex = 1; // 防止被遮挡
    }

    return style;
});

/** 点击事件 */
const onClick = () => {
	emit('onClick');
};

/** 暴露的方法 */
defineExpose({
	getValue: () => props.value,
	getDisplayValue: () => displayValue.value
});
</script>

<style lang="scss" scoped>
.see-badge {
	position: relative;
	display: inline-block;

	&__content {
		display: flex;
		align-items: center;
		justify-content: center;
		min-width: 14px;
		height: 14px;
		padding: 0 4px;
		border-radius: 10px;
		font-weight: 600;
		line-height: 1;
		white-space: nowrap;

		// 圆点样式
		&.is-dot {
			min-width: auto;
			padding: 0;
			border-radius: 50%;
		}

		// 圆形：四角均为圆角
		&.badge-circle {
			border-radius: 10px;

			&.is-dot {
				border-radius: 50%;
			}
		}

		// 角形：左下角为直角
		&.badge-horn {
			border-radius: 0 10px 10px 0;

			&.is-dot {
				border-radius: 50%;
			}
		}
	}

	&__text {
		font-size: inherit;
		font-weight: 600;
		line-height: 1;
	}
}
</style>
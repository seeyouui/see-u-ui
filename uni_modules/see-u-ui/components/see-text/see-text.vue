<template>
	<view class="see-text" @click="onClick">
		<!-- 普通文本 -->
		<text v-if="props.mode === 'text'" :class="getClass" :style="getStyle">
			{{ props.text }}
		</text>

		<!-- 链接 -->
		<see-link v-if="props.mode === 'link'" :text="props.text" :type="props.type" :href="props.href" :size="props.size"></see-link>

		<!-- 电话 -->
		<text v-if="props.mode === 'phone'" :class="getClass" :style="getStyle">
			{{ props.text }}
		</text>

		<!-- 金额 -->
		<text v-if="props.mode === 'price'" :class="getClass" :style="getStyle">
			{{ formatCurrency(props.text) }}
		</text>

		<!-- 日期 -->
		<text v-if="props.mode === 'date'" :class="getClass" :style="getStyle">
			{{ formatDate(props.date, props.dateFormat) }}
		</text>

		<!-- 时间距今 -->
		<text v-if="props.mode === 'timeago'" :class="getClass" :style="getStyle">
			{{ formatTimeAgo(props.date) }}
		</text>
	</view>
</template>

<script lang="ts">
/**
 * Text 文本
 * @description 文本组件，此组件集成了文本类在项目中的常用功能，包括设置主题，拨打电话，格式化日期，显示金额，超链接...等功能。 您大可不必在使用特殊文本时自己定义，text 组件几乎涵盖您能使用的大部分场景。
 * @tutorial https://www.seeuui.cn/components/text/
 *
 * @property {String | Number}												text			内容
 * @property {"text" | "link" | "phone" | "date" | "timeago" | "price"}		mode			文本处理的匹配模式text-普通文本，price-价格，phone-手机号，name-姓名，date-日期，link-链接（默认 'text'）
 * @property {"info" | "primary" | "error" | "warning" | "success"}			type			文本的预置样式，info，primary，error，warning，success (默认 'info' )
 * @property {String}														color			自定义文本颜色（填写此值时，type失效。）
 * @property {String}														href			超链接
 * @property {String}														phoneNumber		手机号
 * @property {String | Number | Date}										date			日期（时间戳格式）
 * @property {String}														dateFormat		日期格式（默认'YYYY-MM-DD'）
 * @property {String | Number}												size			字体大小（px），默认16
 * @example
 */
export default {
	name: 'SeeText'
};
</script>
<script lang="ts" setup>
import { computed, nextTick } from 'vue';
import SeeLink from '../see-link/see-link.vue';
import { formatDate } from '../../utils/hooks/useDateFormat';
import { formatTimeAgo } from '../../utils/hooks/useTimeAgo';
import { formatCurrency } from '../../utils/hooks/useCurrencyFormat';

/** ---------- props ---------- */
const props = withDefaults(
	defineProps<{
		text?: string | number;
		type?: 'info' | 'primary' | 'error' | 'warning' | 'success';
		mode?: 'text' | 'link' | 'phone' | 'date' | 'timeago' | 'price';
		color?: string;
		href?: string;
		phoneNumber?: string;
		date?: string | number | Date;
		dateFormat?: string;
		size: string | number;
	}>(),
	{
		text: '',
		type: 'info',
		mode: 'text',
		color: '',
		href: '',
		phoneNumber: '',
		date: '',
		dateFormat: 'YYYY-MM-DD',
		size: 16
	}
);

/** ---------- emits ---------- */
const emit = defineEmits<{
	(e?: 'onClick'): void;
}>();

const getClass = computed(() => {
	return props.color ? '' : props.type;
});

const getStyle = computed(() => {
	return {
		color: props.color,
		fontSize: typeof props.size === 'number'
					? `${props.size}px`
					: props.size
	};
});

const onClick = () => {
	emit('onClick');
	if (props.mode === 'phone') {
		// #ifndef H5
		uni.makePhoneCall({
			phoneNumber: props.phoneNumber
		});
		// #endif

		// #ifdef H5
		uni.showToast({
			title: 'H5不支持，请使用小程序或APP点击',
			icon: 'none'
		});
		// #endif
	}
};
</script>

<style lang="scss" scoped>
.see-text {
	display: inline-block;
}

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

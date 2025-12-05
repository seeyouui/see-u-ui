<template>
	<view class="see-text" @click="onClick">
		<!-- 普通文本 -->
		<text v-if="props.mode === 'text'" :class="getClass" :style="getStyle">
			{{ props.text }}
		</text>

		<!-- 链接 -->
		<see-link v-if="props.mode === 'link'" :text="props.text" :type="props.type" :href="props.href"></see-link>

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
export default {
  name: 'SeeText'
}
</script>
<script lang="ts" setup>
/**
 * Text 文本
 * @description 此组件基于uniapp官方button，进行二次封装
 * @tutorial http://113.44.242.235:9000/components/text/
 *
 * @property {String | Number}														text			内容
 * @property {"text" | "link" | "phone" | "date" | "timeago" | "price"}		mode			文本处理的匹配模式text-普通文本，price-价格，phone-手机号，name-姓名，date-日期，link-链接（默认 'text'）
 * @property {"info" | "primary" | "error" | "warning" | "success"}			type			文本的预置样式，info，primary，error，warning，success (默认 'info' )
 * @property {String}														color			自定义文本颜色（填写此值时，type失效。）
 * @property {String}														href			超链接
 * @property {String}														phoneNumber		手机号
 * @property {String | Number | Date}										date			日期（时间戳格式）
 * @property {String}														dateFormat		日期格式（默认'YYYY-MM-DD'）
 *
 * @example 
 */
import { computed, nextTick } from 'vue';
import SeeLink from '../SeeLink/index.vue';
import { formatDate } from '@/utils/hooks/useDateFormat';
import { formatTimeAgo } from '@/utils/hooks/useTimeAgo';
import { formatCurrency } from '@/utils/hooks/useCurrencyFormat';

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
	}>(),
	{
		text: '',
		type: 'info',
		mode: 'text',
		color: '',
		href: '',
		phoneNumber: '',
		date: '',
		dateFormat: 'YYYY-MM-DD'
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
		color: props.color
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

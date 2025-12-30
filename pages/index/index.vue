<template>
	<view class="content">
		<view class="content-detail">
			<view class="logo">
				<image src="/static/logo.png" alt="see-u-ui Logo" mode="heightFix"></image>
			</view>
			<view class="detail-text">
				<view class="title">SeeYouUI 1.0.13</view>
				<view class="subtitle">一个基于 uni-app 的组件库</view>
			</view>
		</view>
		<view class="content-detail">
			<text class="subtitle">SeeYouUI 是一个基于 uni-app 的高质量组件库，使用 TypeScript 开发，提供丰富组件与工具函数，帮助你快速构建跨平台应用。</text>
		</view>
		<view class="list" v-for="(item, index) in list" :key="index">
			<view class="list-title">
				<text>{{ item.title }}</text>
			</view>
			<view
				class="list-item"
				:style="key === 0 && 'border-top: 1px var(--see-border-four-color) solid'"
				v-for="(val, key) in item.componentsList"
				:key="key"
				@tap="clickItem(val.url)"
			>
				<text>{{ val.title }}</text>
			</view>
		</view>
	</view>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

type listType = Array<{
	title: string;
	componentsList: Array<{
		title: string;
		url: string;
	}>;
}>;

const list = ref<listType>([
	{
		title: '基础组件',
		componentsList: [
			{
				title: 'Color 色彩',
				url: '/pages/seeColor/index'
			},
			{
				title: 'Button 按钮',
				url: '/pages/seeButton/index'
			},
			{
				title: 'Text 文本',
				url: '/pages/seeText/index'
			},
			{
				title: 'Link 链接',
				url: '/pages/seeLink/index'
			},
			{
				title: 'Icon 图标',
				url: '/pages/seeIcon/index'
			},
			{
				title: 'Image 图片',
				url: '/pages/seeImage/index'
			},
			{
				title: 'Badge 徽标数',
				url: '/pages/seeBadge/index'
			},
			{
				title: 'Tag 标签',
				url: '/pages/seeTag/index'
			}
		]
	},
	{
		title: '表单组件',
		componentsList: [
			{
				title: 'Form 表单',
				url: '/pages/seeForm/index'
			},
			{
				title: 'Input 输入框',
				url: '/pages/seeInput/text'
			}
		]
	}
]);

const clickItem = (url: string) => uni.navigateTo({ url });
</script>

<style lang="scss" scoped>
.content {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	background: var(--see-bg-color);
}

.content-detail {
	width: 100%;
	display: flex;
	align-items: center;
	justify-content: flex-start;
	padding: 0 24px;
	padding-top: 0;
	box-sizing: border-box;
}

.detail-text {
	margin-left: 24px;
	height: 100%;
	display: flex;
	justify-content: flex-start;
	flex-direction: column;
}

.title {
	font-size: 24px;
	font-weight: bold;
}

.logo {
	height: 88px;
	margin-top: 12px;
	margin-bottom: 12px;
	image {
		width: 100%;
		height: 100%;
	}
}

.subtitle {
	font-size: 14px;
	color: #999;
}

.list {
	width: 100%;
	box-sizing: border-box;
}

.list-title {
	font-size: 15px;
	color: var(--see-info-dark);
	padding: 12px 24px;
}

.list-item {
	width: 100%;
	padding: 12px 24px;
	box-sizing: border-box;
	border-bottom: 1px var(--see-border-four-color) solid;
}
</style>

<template>
	<view class="content">
		<image class="logo" src="/static/logo.png"></image>
		<view class="subtitle">一个基于 uni-app 的组件库</view>
		<view class="list" v-for="(item, index) in list" :key="index">
			<view class="list-title">
				<text>{{ item.title }}</text>
			</view>
			<view class="list-item"
				:style="key === 0 && 'border-top: 1px #f1f1f1 solid'"
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
				title: 'Button 按钮',
				url: '/pages/seeButton/index'
			},
			{
				title: 'Text 文本',
				url: '/pages/seeText/index'
			}
		]
	},
	// {
	// 	title: '表单组件',
	// 	componentsList: [
	// 		{
	// 			title: 'Form 表单',
	// 			url: '/pages/seeForm/index'
	// 		},
	// 		{
	// 			title: 'Input 输入框',
	// 			url: '/pages/seeInput/text'
	// 		}
	// 	]
	// }
]);

const clickItem = (url: string) => (uni.navigateTo({url}));
</script>

<style>
.content {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
}

.logo {
	height: 100px;
	width: 100px;
	margin-top: 12px;
	margin-left: auto;
	margin-right: auto;
	margin-bottom: 12px;
}

.subtitle{
	font-size: 15px;
	color: #999;
}

.list {
	width: 100%;
	box-sizing: border-box;
	margin-bottom: 18px;
}

.list-title {
	font-size: 15px;
	color: #999;
	padding: 12px 24px;
}

.list-item {
	width: 100%;
	padding: 12px 24px;
	box-sizing: border-box;
	border-bottom: 1px #f1f1f1 solid;
}
</style>

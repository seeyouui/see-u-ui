<template>
	<view class="container">
		<text class="title">基本使用</text>
		<view class="content">
			<see-link text="这是SeeYouUI的官方文档" type="primary" href="https://www.baidu.com" />
			<view class="gap-12"></view>
			<see-link text="自定义文字颜色" color="#52f7bd" href="https://www.baidu.com" />
		</view>
		<text class="title">设置主题</text>
		<view class="content">
			<see-link text="《静夜思》" type="" href="https://www.baidu.com" />
			<view class="gap-12"></view>
			<see-link text="床前明月光，" type="primary" href="https://www.baidu.com" />
			<view class="gap-12"></view>
			<see-link text="疑是地上霜。" type="error" href="https://www.baidu.com" />
			<view class="gap-12"></view>
			<see-link text="举头望明月，" type="warning" href="https://www.baidu.com" />
			<view class="gap-12"></view>
			<see-link text="低头思故乡。" type="success" href="https://www.baidu.com" />
		</view>
		<text class="title">下划线</text>
		<view class="content">
			<see-link text="来都来了, 给我点个Star吗？" isLine type="primary" href="https://www.baidu.com" />
			<view class="gap-12"></view>
			<see-link text="自定义下划线颜色" isLine line-color="#52f7bd" type="primary" href="https://www.baidu.com" />
		</view>
	</view>
</template>

<script lang="ts" setup>
import { onShow } from '@dcloudio/uni-app';
import useSetNavBarTheme from '@/hooks/useSetNavBarTheme';
onShow(() => useSetNavBarTheme());
</script>

<style lang="scss" scoped>
.gap-12 {
	width: 100%;
	height: 12px;
}
.container {
	width: 100vw;
	overflow: hidden;
	padding: 12px;
	box-sizing: border-box;

	.title {
		font-size: 18px;
		color: #999;
	}
	.content {
		margin-top: 6px;
		margin-bottom: 24px;
	}
}
</style>

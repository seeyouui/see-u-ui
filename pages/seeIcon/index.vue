<template>
	<view class="container">
		<text class="title">基本使用</text>
		<view class="content">
			<view class="item" v-for="(item, index) in 6" :key="index">
				<see-icon></see-icon>
				<see-text :size="14" :text="item" type="primary"></see-text>
			</view>
		</view>
	</view>
</template>

<script lang="ts" setup></script>

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
		display: flex;
		flex-wrap: wrap;

		.item {
			width: 33%;
			height: 100px;
			border: 1px solid #f1f1f1;
			box-sizing: border-box;
			padding: 12px;
			box-sizing: border-box;
			text-align: center;

			display: flex;
			align-items: center;
			justify-content: space-between;
			flex-direction: column;
		}
	}
}
</style>

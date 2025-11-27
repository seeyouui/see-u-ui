<template>
	<view class="container">
		<text class="title">按钮类型</text>
		<view class="content">
			<SeeButton title="默认按钮" />
			<SeeButton title="主要按钮" type="primary" />
			<SeeButton title="失败按钮" type="error" />
			<SeeButton title="警告按钮" type="warning" />
			<SeeButton title="成功按钮" type="success" />
		</view>
		<text class="title">镂空按钮</text>
		<view class="content">
			<SeeButton isHollow title="默认按钮" />
			<SeeButton isHollow title="主要按钮" type="primary" />
			<SeeButton isHollow title="失败按钮" type="error" />
			<SeeButton isHollow title="警告按钮" type="warning" />
			<SeeButton isHollow title="成功按钮" type="success" />
		</view>
		<text class="title">禁用按钮</text>
		<view class="content">
			<SeeButton isDisabled title="默认按钮" />
			<SeeButton isDisabled title="主要按钮" type="primary" />
			<SeeButton isDisabled title="失败按钮" type="error" />
			<SeeButton isDisabled title="警告按钮" type="warning" />
			<SeeButton isDisabled title="成功按钮" type="success" />
		</view>
		<text class="title">按钮大小</text>
		<view class="content">
			<SeeButton size="normal" title="默认大小" />
			<SeeButton size="small" title="小型尺寸" />
			<SeeButton size="mini" title="最小尺寸" />
			<SeeButton size="large" title="超大尺寸" />
		</view>
		<text class="title">水波动画</text>
		<view class="content">
			<SeeButton title="默认动画" isRipple />
			<SeeButton type="primary" size="normal" title="按钮颜色" isRipple />
			<SeeButton size="normal" title="动画颜色" isRipple ripple-color="blue" />
			<SeeButton size="large" title="动画时长(10000ms)" isRipple ripple-time="10000" ripple-color="red" mask-time="20000" />
		</view>
		<text class="title">自定义</text>
		<view class="content">
			<SeeButton :customStyle="customStyle" title="自定义宽高" />
			<SeeButton :radius="24" title="圆角按钮" />
			<SeeButton size="large" title="渐变色按钮" textColor="#FFFFFF" color="linear-gradient(to right, rgb(66, 83, 216), rgb(213, 51, 186))" isRipple />
			<SeeButton title="自定义颜色" color="#8A4D35" textColor="#FFFFFF" isRipple />
			<SeeButton title="传入一个view">
				<view style="width: 10px; height: 10px; border: 1px red solid" />
			</SeeButton>
			<SeeButton size="large">
				<text>标题以slot形式</text>
			</SeeButton>
		</view>
	</view>
</template>

<script lang="ts" setup>
import SeeButton from '@/components/SeeButton/index.vue';

const customStyle = {
	width: '200px',
	height: '150px'
};
</script>

<style lang="scss" scoped>
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
		margin-top: 12px;
		flex-direction: row;
		flex-wrap: warp;
		align-items: center;
		:deep(.see-button) {
			margin: 0 15px 15px 0;
		}
	}
}
</style>

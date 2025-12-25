<template>
	<view class="container">
		<text class="title">基本使用</text>
		<view class="content">
			<see-badge value="5" type="error"></see-badge>
			<view class="ml-12" />
			<see-badge value="99" type="primary"></see-badge>
		</view>

		<text class="title">圆点形式</text>
		<view class="content">
			<see-badge :isDot="true" type="error"></see-badge>
			<view class="ml-12" />
			<see-badge :isDot="true" type="success"></see-badge>
			<view class="ml-12" />
			<see-badge :isDot="true" type="warning"></see-badge>
		</view>

		<text class="title">设置主题</text>
		<view class="content flex-sb">
			<see-badge value="1" type="info"></see-badge>
			<see-badge value="2" type="primary"></see-badge>
			<see-badge value="3" type="error"></see-badge>
			<see-badge value="4" type="warning"></see-badge>
			<see-badge value="5" type="success"></see-badge>
		</view>

		<text class="title">自定义颜色</text>
		<view class="content">
			<see-badge value="8" bgColor="#ff6b6b" color="#ffffff"></see-badge>
			<view class="ml-12" />
			<see-badge value="9" bgColor="#52f7bd" color="#1a1a1a"></see-badge>
			<view class="ml-12" />
			<see-badge :isDot="true" bgColor="#ffd700"></see-badge>
		</view>

		<text class="title">超过最大值</text>
		<view class="content">
			<see-badge value="150" max="99" numberType="overflow" type="error"></see-badge>
			<view class="ml-12" />
			<see-badge value="150" max="99" numberType="ellipsis" type="warning"></see-badge>
			<view class="ml-12" />
			<see-badge value="2500" numberType="limit" type="primary"></see-badge>
		</view>

		<text class="title">数字格式化</text>
		<view class="content flex-sb">
			<see-badge value="999" numberType="limit" type="success"></see-badge>
			<see-badge value="1500" numberType="limit" type="success"></see-badge>
			<see-badge value="125000" numberType="limit" type="success"></see-badge>
			<see-badge value="9999999" numberType="limit" type="success"></see-badge>
		</view>

		<text class="title">徽标形状</text>
		<view class="content">
			<see-badge value="5" shape="circle" type="primary"></see-badge>
			<view class="ml-12" />
			<see-badge value="5" shape="horn" type="primary"></see-badge>
		</view>

		<text class="title">颜色反转</text>
		<view class="content">
			<see-badge value="5" type="primary" :inverted="false"></see-badge>
			<view class="ml-12" />
			<see-badge value="5" type="primary" :inverted="true"></see-badge>
		</view>

		<text class="title">自定义大小</text>
		<view class="content">
			<see-badge value="5" :size="10"></see-badge>
			<view class="ml-12" />
			<see-badge value="5" :size="14"></see-badge>
			<view class="ml-12" />
			<see-badge value="5" :size="18"></see-badge>
		</view>

		<text class="title">圆点大小</text>
		<view class="content">
			<see-badge :isDot="true" :dotSize="8" type="primary"></see-badge>
			<view class="ml-12" />
			<see-badge :isDot="true" :dotSize="16" type="primary"></see-badge>
			<view class="ml-12" />
			<see-badge :isDot="true" :dotSize="24" type="primary"></see-badge>
		</view>

		<text class="title">动画效果</text>
		<view class="content flex-sb">
			<see-badge value="5" animationType="scale" type="primary"></see-badge>
			<see-badge value="5" animationType="fade" type="primary"></see-badge>
			<see-badge value="5" animationType="bounce" type="primary"></see-badge>
			<see-badge value="5" :animate="false" type="primary"></see-badge>
		</view>

		<text class="title">位置偏移</text>
		<view class="content flex-sb">
			<view class="box">
				<see-badge :isDot="true" absolute value="3" :offset="[0, 0]" type="error"></see-badge>
			</view>
			<view class="box">
				<see-badge absolute value="1" :offset="[12, 12]" type="error"></see-badge>
			</view>
			<view class="box">
				<see-badge absolute value="2" :offset="[24, 24]" type="error"></see-badge>
			</view>
		</view>

		<text class="title">实时更新</text>
		<view class="content">
			<see-text text="消息数量：" />
			<see-badge :value="messageCount" max="99" type="primary"></see-badge>
			<view class="flex-sb">
				<see-button size="mini" isRipple type="primary" @tap="addMessage">+1</see-button>
				<see-button size="mini" isRipple type="warning" @tap="reduceMessage">-1</see-button>
				<see-button size="mini" isRipple type="error" @tap="clearMessage">清空</see-button>
			</view>
		</view>
	</view>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const isShow = ref(true);
const messageCount = ref(5);

const addMessage = () => {
	messageCount.value++;
};

const reduceMessage = () => {
	if (messageCount.value > 0) {
		messageCount.value--;
	}
};

const clearMessage = () => {
	messageCount.value = 0;
};
</script>

<style lang="scss" scoped>
.ml-12 {
	margin-left: 12px;
}
.gap-12 {
	width: 100%;
	height: 12px;
}

.flex-sb {
	width: 100%;
	display: flex;
	justify-content: space-between !important;
	margin-top: 12px;
}

.box {
	width: 100px;
	height: 100px;
	background-color: #909193;
	border-radius: 15px;
	position: relative;
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
		flex-direction: row;
		flex-wrap: wrap;
		align-items: center;
		display: flex;
		align-items: center;
		justify-content: flex-start;
	}
}
</style>

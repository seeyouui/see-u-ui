<template>
	<view>
		<view class="uni-list">
			<view class="uni-list-cell">
				<view class="uni-list-cell-left">暗黑模式</view>
				<view class="uni-list-cell-db">
					<switch disabled :checked="isSwitchChecked" @change="changeSwitch" style="transform: scale(0.7); position: relative; left: 14px" />
				</view>
			</view>
			<view class="uni-list-detail">
				<text>支持浅色/暗黑模式切换，可随系统主题或通过 API 手动控制。</text>
			</view>
		</view>
		<view class="uni-list">
			<view class="uni-list-cell">
				<view class="uni-list-cell-left">国际化配置</view>
				<view class="uni-list-cell-db">
					<picker disabled>
						<view class="uni-input">中国</view>
					</picker>
				</view>
			</view>
			<view class="uni-list-detail">
				<text>配置组件库的国际化语言环境，支持多语言切换。</text>
			</view>
		</view>
		<view class="uni-list">
			<view class="uni-list-cell">
				<view class="uni-list-cell-left">自定义主题</view>
				<view class="uni-list-cell-db">
					<picker disabled>
						<view class="uni-input">默认主题</view>
					</picker>
				</view>
			</view>
			<view class="uni-list-detail">
				<text>支持通过配置文件自定义主题样式。</text>
			</view>
		</view>
		<view class="uni-list">
			<view class="uni-list-cell">
				<view class="uni-list-cell-left">全局骨架屏</view>
				<view class="uni-list-cell-db">
					<switch disabled :checked="false" style="transform: scale(0.7); position: relative; left: 14px" />
				</view>
			</view>
			<view class="uni-list-detail">
				<text>统一的全局骨架屏方案，优化页面加载过程中的视觉反馈。</text>
			</view>
		</view>
	</view>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

// 暗黑模式
const isSwitchChecked = ref(true);
const changeSwitch = () => {
	isSwitchChecked.value = !isSwitchChecked.value;
	console.log(isSwitchChecked.value);
	// #ifdef H5
	if (isSwitchChecked.value) {
		document.documentElement.classList.remove('see-theme-light');
		document.documentElement.classList.add('see-theme-dark');
	} else {
		document.documentElement.classList.remove('see-theme-dark');
		document.documentElement.classList.add('see-theme-light');
	}
	// #endif
};

// 国际化配置
const array = ref<string[]>(['中国', '美国', '巴西', '日本']);
const index = ref<number>(0);
const bindPickerChange = (e: UniHelper.PickerChangeEvent) => {
	console.log('picker发送选择改变，携带值为', e.detail.value);
	index.value = Number(e.detail.value);
};
</script>

<style lang="scss" scoped>
/* 列表容器 */
.uni-list {
	width: 100%;
	background-color: var(--see-bg-color);
	overflow: hidden;
	border: 1px solid var(--see-border-four-color);
	margin-bottom: 12px;
}

/* 单元格 */
.uni-list-cell {
	height: 46px;
	display: flex;
	flex-direction: row;
	align-items: center;
	padding: 12px 12px;
	box-sizing: border-box;
	border-bottom: 1rpx solid var(--see-border-four-color);
}

.uni-list-cell:last-child {
	border-bottom: none;
}

.uni-list-detail {
	padding: 12px 12px;
	text {
		font-size: 12px;
	}
}

/* 左侧标题 */
.uni-list-cell-left {
	font-size: 15px;
	color: var(--see-main-color);
}

/* 右侧内容 */
.uni-list-cell-db {
	flex: 1;
	text-align: right;
	color: var(--see-content-color);
}

/* picker 内部显示 */
.uni-input {
	font-size: 15px;
	color: var(--see-primary);
}
</style>

<template>
	<view class="container">
		<text class="title">主色 primary</text>
		<view class="content">
			<view class="item primary-primary">
				<view class="subtitle">primary</view>
				<view class="color">#3ca7ff</view>
			</view>
			<view class="item primary-dark">
				<view class="subtitle">dark</view>
				<view class="color">#208ee8</view>
			</view>
			<view class="item primary-disabled">
				<view class="subtitle">disabled</view>
				<view class="color">#a8d8ff</view>
			</view>
			<view class="item primary-light">
				<view class="subtitle">light</view>
				<view class="color">#e9f6ff</view>
			</view>
		</view>

		<text class="title">错误 error</text>
		<view class="content">
			<view class="item error-primary">
				<view class="subtitle">primary</view>
				<view class="color">#ff6b6b</view>
			</view>
			<view class="item error-dark">
				<view class="subtitle">dark</view>
				<view class="color">#e85b5b</view>
			</view>
			<view class="item error-disabled">
				<view class="subtitle">disabled</view>
				<view class="color">#ffbaba</view>
			</view>
			<view class="item error-light">
				<view class="subtitle">light</view>
				<view class="color">#fff2f2</view>
			</view>
		</view>

		<text class="title">警告 warning</text>
		<view class="content">
			<view class="item warning-primary">
				<view class="subtitle">primary</view>
				<view class="color">#ffb645</view>
			</view>
			<view class="item warning-dark">
				<view class="subtitle">dark</view>
				<view class="color">#f0a233</view>
			</view>
			<view class="item warning-disabled">
				<view class="subtitle">disabled</view>
				<view class="color">#ffd9a6</view>
			</view>
			<view class="item warning-light">
				<view class="subtitle">light</view>
				<view class="color">#fff6e8</view>
			</view>
		</view>

		<text class="title">默认 info</text>
		<view class="content">
			<view class="item info-primary">
				<view class="subtitle">primary</view>
				<view class="color">#8a8f99</view>
			</view>
			<view class="item info-dark">
				<view class="subtitle">dark</view>
				<view class="color">#6e737c</view>
			</view>
			<view class="item info-disabled">
				<view class="subtitle">disabled</view>
				<view class="color">#d2d5d9</view>
			</view>
			<view class="item info-light">
				<view class="subtitle">light</view>
				<view class="color">#f5f6f7</view>
			</view>
		</view>

		<text class="title">成功 success</text>
		<view class="content">
			<view class="item success-primary">
				<view class="subtitle">primary</view>
				<view class="color">#37d497</view>
			</view>
			<view class="item success-dark">
				<view class="subtitle">dark</view>
				<view class="color">#2bb881</view>
			</view>
			<view class="item success-disabled">
				<view class="subtitle">disabled</view>
				<view class="color">#b6efd9</view>
			</view>
			<view class="item success-light">
				<view class="subtitle">light</view>
				<view class="color">#f2fff9</view>
			</view>
		</view>

		<text class="title">文字颜色</text>
		<view class="content">
			<view class="item text-primary">
				<view class="subtitle">主要文字</view>
				<view class="color">#2e2f33</view>
			</view>
			<view class="item text-dark">
				<view class="subtitle">常规文字</view>
				<view class="color">#5a5c60</view>
			</view>
			<view class="item text-disabled">
				<view class="subtitle">次要文字</view>
				<view class="color">#8c8e93</view>
			</view>
			<view class="item text-light">
				<view class="subtitle">占位文字</view>
				<view class="color">#c9ccd1</view>
			</view>
		</view>

		<text class="title">边框颜色</text>
		<view class="content">
			<view class="item border-primary">
				<view class="subtitle">一级边框</view>
				<view class="color">#aeb0b4</view>
			</view>
			<view class="item border-dark">
				<view class="subtitle">二级边框</view>
				<view class="color">#c3c5c8</view>
			</view>
			<view class="item border-disabled">
				<view class="subtitle">三级边框</view>
				<view class="color">#d9dadc</view>
			</view>
			<view class="item border-light">
				<view class="subtitle">四级边框</view>
				<view class="color">#eceff1</view>
			</view>
		</view>

		<text class="title">背景颜色</text>
		<view class="content">
			<view class="item bg-primary">
				<view class="subtitle">亮色</view>
				<view class="color">#f6faff</view>
			</view>
			<view class="item bg-dark">
				<view class="subtitle">暗色</view>
				<view class="color">#1e222a</view>
			</view>
			<view class="item"></view>
			<view class="item"></view>
		</view>
	</view>
</template>

<script lang="ts" setup>
import { onShow } from '@dcloudio/uni-app';
import useSetNavBarTheme from '@/hooks/useSetNavBarTheme';
onShow(() => useSetNavBarTheme());
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
		margin-bottom: 12px;
		display: flex;
		flex-direction: row;
		flex-wrap: warp;
		align-items: center;
		justify-content: space-between;
		.item {
			width: 80px;
			height: 40px;

			display: flex;
			align-items: center;
			justify-content: center;
			flex-direction: column;

			border-radius: 4px;

			.subtitle {
				font-size: 12px;
				font-weight: 600;
			}
			.color {
				font-size: 13px;
			}
		}
		.primary-primary {
			background-color: $see-primary;
			.subtitle,
			.color {
				color: $see-text;
			}
		}
		.primary-dark {
			background-color: $see-primary-dark;
			.subtitle,
			.color {
				color: $see-dark-text;
			}
		}
		.primary-disabled {
			background-color: $see-primary-disabled;
			.subtitle,
			.color {
				color: $see-disabled-text;
			}
		}
		.primary-light {
			background-color: $see-primary-light;
			.subtitle,
			.color {
				color: $see-light-text;
			}
		}

		.error-primary {
			background-color: $see-error;
			.subtitle,
			.color {
				color: $see-text;
			}
		}
		.error-dark {
			background-color: $see-error-dark;
			.subtitle,
			.color {
				color: $see-dark-text;
			}
		}
		.error-disabled {
			background-color: $see-error-disabled;
			.subtitle,
			.color {
				color: $see-disabled-text;
			}
		}
		.error-light {
			background-color: $see-error-light;
			.subtitle,
			.color {
				color: $see-light-text;
			}
		}

		.warning-primary {
			background-color: $see-warning;
			.subtitle,
			.color {
				color: $see-text;
			}
		}
		.warning-dark {
			background-color: $see-warning-dark;
			.subtitle,
			.color {
				color: $see-dark-text;
			}
		}
		.warning-disabled {
			background-color: $see-warning-disabled;
			.subtitle,
			.color {
				color: $see-disabled-text;
			}
		}
		.warning-light {
			background-color: $see-warning-light;
			.subtitle,
			.color {
				color: $see-light-text;
			}
		}

		.info-primary {
			background-color: $see-info;
			.subtitle,
			.color {
				color: $see-text;
			}
		}
		.info-dark {
			background-color: $see-info-dark;
			.subtitle,
			.color {
				color: $see-dark-text;
			}
		}
		.info-disabled {
			background-color: $see-info-disabled;
			.subtitle,
			.color {
				color: $see-disabled-text;
			}
		}
		.info-light {
			background-color: $see-info-light;
			.subtitle,
			.color {
				color: $see-light-text;
			}
		}

		.success-primary {
			background-color: $see-success;
			.subtitle,
			.color {
				color: $see-text;
			}
		}
		.success-dark {
			background-color: $see-success-dark;
			.subtitle,
			.color {
				color: $see-dark-text;
			}
		}
		.success-disabled {
			background-color: $see-success-disabled;
			.subtitle,
			.color {
				color: $see-disabled-text;
			}
		}
		.success-light {
			background-color: $see-success-light;
			.subtitle,
			.color {
				color: $see-light-text;
			}
		}

		.text-primary {
			background-color: $see-main-color;
			.subtitle,
			.color {
				color: $see-text;
			}
		}
		.text-dark {
			background-color: $see-content-color;
			.subtitle,
			.color {
				color: $see-text;
			}
		}
		.text-disabled {
			background-color: $see-tips-color;
			.subtitle,
			.color {
				color: $see-text;
			}
		}
		.text-light {
			background-color: $see-light-color;
			.subtitle,
			.color {
				color: $see-text;
			}
		}

		.border-primary {
			background-color: $see-border-color;
			.subtitle,
			.color {
				color: $see-text;
			}
		}
		.border-dark {
			background-color: $see-border-two-color;
			.subtitle,
			.color {
				color: $see-text;
			}
		}
		.border-disabled {
			background-color: $see-border-three-color;
			.subtitle,
			.color {
				color: $see-text;
			}
		}
		.border-light {
			background-color: $see-border-four-color;
			.subtitle,
			.color {
				color: $see-text;
			}
		}

		.bg-primary {
			background-color: $see-bg-light-color;
			.subtitle,
			.color {
				color: $see-light-text;
			}
		}
		.bg-dark {
			background-color: $see-bg-dark-color;
			.subtitle,
			.color {
				color: $see-text;
			}
		}
	}
}
</style>

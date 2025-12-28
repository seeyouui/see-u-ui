<script>
export default {
	onLaunch: function () {
		console.log('App Launch');
	},
	onShow: function () {
		console.log('App Show');
	},
	onHide: function () {
		console.log('App Hide');
	}
};
</script>

<style>
/*每个页面公共css */
/* 隐藏所有页面的滚动条 */
::-webkit-scrollbar {
	display: none;
	width: 0 !important;
	height: 0 !important;
	-webkit-appearance: none;
	background: transparent;
}

/* 通用隐藏滚动条 */
page {
	-ms-overflow-style: none; /* IE 和 Edge */
	scrollbar-width: none; /* Firefox */
}

* {
    scrollbar-width: none !important;
}

page::-webkit-scrollbar {
	display: none; /* Chrome, Safari 和 Opera */
}
</style>

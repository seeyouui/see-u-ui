import store from '@/store/index';

export const updateNavBar = (targetTheme: 'dark' | 'light', duration: number = 300) => {
	// 2. 设置导航栏和底部栏
	if (targetTheme === 'dark') {
		uni.setNavigationBarColor({
			frontColor: '#ffffff',
			backgroundColor: '#14171d',
			animation: { duration: duration, timingFunc: 'easeIn' }
		}).catch((e) => {
			console.warn(e);
		});
		uni.setTabBarStyle({
			backgroundColor: '#14171d',
			color: '#6e737c',
			selectedColor: '#3ca7ff',
			borderStyle: 'white'
		}).catch((e) => {
			console.warn(e);
		});
	} else {
		uni.setNavigationBarColor({
			frontColor: '#000000',
			backgroundColor: '#ffffff',
			animation: { duration: duration, timingFunc: 'easeIn' }
		}).catch((e) => {
			console.warn(e);
		});
		uni.setTabBarStyle({
			backgroundColor: '#ffffff',
			color: '#8c8e93',
			selectedColor: '#3ca7ff',
			borderStyle: 'black'
		}).catch((e) => {
			console.warn(e);
		});
	}
};

export const useNavBarTheme = () => {
	// #ifdef H5
	window.addEventListener('message', (event) => {
		const data = event.data;
		if (!data || data.type !== 'vp-theme') return;
		const targetTheme = data.theme;

		// 存到vuex
		store.commit('SET_THEME', targetTheme);

		setTimeout(() => {
			// 1. 切换 CSS 类名
			if (targetTheme === 'dark') {
				document.documentElement.classList.remove('see-theme-light');
				document.documentElement.classList.add('see-theme-dark');
			} else {
				document.documentElement.classList.remove('see-theme-dark');
				document.documentElement.classList.add('see-theme-light');
			}
			updateNavBar(targetTheme);
		}, 200);
	});
	// #endif
};

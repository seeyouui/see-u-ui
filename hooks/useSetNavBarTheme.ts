import { useStore } from 'vuex';
import { updateNavBar } from '@/hooks/useNavBarTheme';

export default () => {
	const store = useStore();
	if (store.state.theme) updateNavBar(store.state.theme);
};

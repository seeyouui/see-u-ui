import { computed, unref, type ComputedRef, type MaybeRef } from 'vue';

// --- 类型定义 ---
type DateInput = string | number | Date | null | undefined;

/**
 * 格式化配置选项
 */
export interface DateFormatOptions {
	/** 默认显示的占位符，当日期无效时显示 */
	placeholder?: string;
}

// --- 1. 核心工具函数 (纯逻辑，非响应式) ---

/**
 * 将各种输入转换为 Date 对象
 */
function normalizeDate(date: DateInput): Date | null {
	if (date === null || date === undefined) return null;
	if (date instanceof Date) return date;

	if (typeof date === 'number') return new Date(date);

	if (typeof date === 'string') {
		// 处理纯数字字符串的时间戳 (例如 "1672502400000")
		if (/^\d+$/.test(date)) {
			return new Date(parseInt(date));
		}
		// 尝试解决 iOS/Safari 下 '2023-01-01' 中划线无法解析的问题
		const safeDateStr = date.replace(/-/g, '/');
		return new Date(safeDateStr);
	}

	return null;
}

/**
 * 核心格式化函数
 * @param date 输入的日期
 * @param fmt 格式化字符串 (默认: YYYY-MM-DD HH:mm:ss)
 * @param options 配置项
 */
export function formatDate(date: DateInput, fmt: string = 'YYYY-MM-DD HH:mm:ss', options: DateFormatOptions = { placeholder: '' }): string {
	const d = normalizeDate(date);

	// 如果日期无效，返回占位符
	if (!d || isNaN(d.getTime())) {
		return options.placeholder || '';
	}

	const o: Record<string, number> = {
		'M+': d.getMonth() + 1, // 月份
		'D+': d.getDate(), // 日
		'H+': d.getHours(), // 小时 (24小时制)
		'h+': d.getHours() % 12 === 0 ? 12 : d.getHours() % 12, // 小时 (12小时制)
		'm+': d.getMinutes(), // 分
		's+': d.getSeconds(), // 秒
		'q+': Math.floor((d.getMonth() + 3) / 3), // 季度
		'S+': d.getMilliseconds() // 毫秒
	};

	// 处理年份 (Y 或 y)
	if (/(Y+|y+)/.test(fmt)) {
		fmt = fmt.replace(RegExp.$1, (d.getFullYear() + '').substr(4 - RegExp.$1.length));
	}

	// 处理周 (W)
	if (/(W+)/.test(fmt)) {
		const week = ['日', '一', '二', '三', '四', '五', '六'];
		fmt = fmt.replace(RegExp.$1, (RegExp.$1.length > 1 ? (RegExp.$1.length > 2 ? '星期' : '周') : '') + week[d.getDay()]);
	}

	// 处理其他部分
	for (const k in o) {
		if (new RegExp('(' + k + ')').test(fmt)) {
			const value = o[k].toString();

			// 如果是毫秒(S+)，强制使用 3 位补零逻辑
			if (k === 'S+') {
				// ('000' + value).slice(-3) 确保 5 -> 005, 50 -> 050, 500 -> 500
				fmt = fmt.replace(RegExp.$1, ('000' + value).slice(-3));
			} else {
				// 其他常规逻辑 (月日时分秒)
				fmt = fmt.replace(RegExp.$1, RegExp.$1.length === 1 ? value : ('00' + value).substr(('' + value).length));
			}
		}
	}

	return fmt;
}

// --- 2. Vue Hook (响应式封装) ---

/**
 * Vue 3 组合式函数: 响应式日期格式化
 * @param date 响应式日期或普通日期
 * @param formatStr 格式化字符串 (可选，支持响应式)
 * @param options 配置项 (可选)
 * @returns ComputedRef<string>
 */
export function useDateFormat(
	date: MaybeRef<DateInput>,
	formatStr: MaybeRef<string> = 'YYYY-MM-DD HH:mm:ss',
	options: DateFormatOptions = { placeholder: '' }
): ComputedRef<string> {
	return computed(() => {
		return formatDate(unref(date), unref(formatStr), options);
	});
}

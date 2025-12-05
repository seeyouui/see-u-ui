import { computed, type ComputedRef, type MaybeRefOrGetter } from 'vue';

function toValueCompat(v: any) {
	return typeof v === 'function' ? v() : v;
}

type NumberInput = MaybeRefOrGetter<number | string | null | undefined>;

export interface CurrencyOptions {
	decimals?: number; // 保留几位小数，默认 2
	symbol?: string; // 货币符号
	placeholder?: string; // 占位符
	useGrouping?: boolean; // 是否千分位
}

/**
 * 辅助函数：不四舍五入，直接截断数字
 * @param value 数字或数字字符串
 * @param decimals 保留位数
 */
function truncateToDecimals(value: number | string, decimals: number): number {
	const str = value.toString();
	const pointIndex = str.indexOf('.');

	// 如果没有小数点，直接返回数字
	if (pointIndex === -1) {
		return Number(str);
	}

	// 截取字符串：整数部分 + 小数点 + 需要的小数位数
	// 例如: 12.349 (decimals=2) -> "12.34"
	// 即使原数字是 12.3 (decimals=2)，截取后是 "12.3"，转回数字仍是 12.3，
	// 后续交给 Intl 补零变成 12.30
	const truncatedStr = str.substring(0, pointIndex + 1 + decimals);

	return Number(truncatedStr);
}

/**
 * 纯函数：格式化金额
 */
export function formatCurrency(value: number | string, options: CurrencyOptions = {}): string {
	const { decimals = 2, symbol = '', useGrouping = true } = options;

	const rawNum = Number(value);

	if (Number.isNaN(rawNum)) return '';

	// --- 关键修改：先进行截断处理，再传给 Intl ---
	const truncatedNum = truncateToDecimals(rawNum, decimals);

	const formatter = new Intl.NumberFormat('en-US', {
		style: 'decimal',
		minimumFractionDigits: decimals,
		maximumFractionDigits: decimals,
		useGrouping: useGrouping
		// 注意：不依赖 Intl 的 roundingMode，因为兼容性还不是 100% 全覆盖，
		// 手动截断最稳妥。
	});

	const formatted = formatter.format(truncatedNum);

	return symbol ? `${symbol}${formatted}` : formatted;
}

/**
 * Vue Hook 封装
 */
export function useCurrencyFormat(amount: NumberInput, options: CurrencyOptions = {}): ComputedRef<string> {
	const { placeholder = '-' } = options;

	return computed(() => {
		const val = toValueCompat(amount);

		if (val === null || val === undefined || val === '') {
			return placeholder;
		}

		const res = formatCurrency(val, options);
		return res === '' ? placeholder : res;
	});
}

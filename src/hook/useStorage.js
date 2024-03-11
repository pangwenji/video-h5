// 获取传入的值的类型
const getValueType = (value) => {
    const type = Object.prototype.toString.call(value)
    return type.slice(8, -1)
  }
  
export const useStorage = () => {
	const setStorage = (key, value) => {
		const valueType = getValueType(value);
		window.localStorage.setItem(key, JSON.stringify({ type: valueType, value }));
	};

	const getStorage = (key) => {
		const value = window.localStorage.getItem(key);
		if (value) {
			const { value: val } = JSON.parse(value);
			return val;
		} else {
			return value;
		}
	};

	const removeStorage = (key) => {
		window.localStorage.removeItem(key);
	};

	const clear = (excludes) => {
		// 获取排除项
		const keys = Object.keys(window.localStorage);
		const defaultExcludes = ['dynamicRouter', 'serverDynamicRouter'];
		const excludesArr = excludes ? [...excludes, ...defaultExcludes] : defaultExcludes;
		const excludesKeys = excludesArr ? keys.filter((key) => !excludesArr.includes(key)) : keys;
		// 排除项不清除
		excludesKeys.forEach((key) => {
			window.localStorage.removeItem(key);
		});
		// window[type].clear()
	};

	return {
		setStorage,
		getStorage,
		removeStorage,
		clear,
	};
};


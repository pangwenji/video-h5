import qs from 'qs';
import store from '@/store';
import { useUserStore } from '@/store';

const userStore = useUserStore(store);

const config = {
	/**
	 * 接口成功返回状态码
	 */
	code: 200,

	/**
	 * 接口请求超时时间
	 */
	timeout: 60000,

	/**
	 * 默认接口请求类型
	 * 可选值：application/x-www-form-urlencoded multipart/form-data
	 */
	defaultHeaders: 'application/json',

	interceptors: {},
};

const defaultRequestInterceptors = (config) => {
	if (config.method === 'post' && config.headers['Content-Type'] === 'application/x-www-form-urlencoded') {
		config.data = qs.stringify(config.data);
	}
	if (config.method === 'get' && config.params) {
		let url = config.url;
		url += '?';
		const keys = Object.keys(config.params);
		for (const key of keys) {
			if (config.params[key] !== void 0 && config.params[key] !== null) {
				url += `${key}=${encodeURIComponent(config.params[key])}&`;
			}
		}
		url = url.substring(0, url.length - 1);
		config.params = {};
		config.url = url;
	}
	// 请求头添加token 和 设置语言
	const token =  localStorage.getItem('TOKEN');
	if (token) {
		config.headers.Authorization = `Bearer ${token}`;
		config.headers['Accept-Language'] = 'zh-CN';
	}
	return config;
};

const defaultResponseInterceptors = (response) => {
	if (response?.config?.responseType === 'blob') {
		// 如果是文件流，直接过
		return response;
	}
	if (response.status === 401) {
		router.push({
			name: 'full-screen',
		});
	}
	return response.data;
};

export { defaultResponseInterceptors, defaultRequestInterceptors };
export default config;

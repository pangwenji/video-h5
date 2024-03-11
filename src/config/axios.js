import service from '@/utils/service';

import config from './config';

const { defaultHeaders } = config;

const request = async (option) => {
	const { url, method, params, data, headersType, responseType } = option;
	return await service.request({
		url,
		method,
		params,
		data,
		responseType,
		headers: {
			'Content-Type': headersType ?? defaultHeaders,
		},
	});
};

export default {
	get: async (option) => {
		return await request({ method: 'get', ...option });
	},
	post: async (option) => {
		return await request({ method: 'post', ...option });
	},
	delete: async (option) => {
		return await request({ method: 'delete', ...option });
	},
	put: async (option) => {
		return await request({ method: 'put', ...option });
	},
	cancelRequest: (url) => {
		service.cancelRequest(url);
	},
	cancelAllRequest: () => {
		service.cancelAllRequest();
	},
};


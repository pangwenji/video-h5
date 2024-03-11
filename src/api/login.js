import request from '@/config/axios';
import { apiURL } from '@/enums';

/**
 * 用户登录
 * @param {object} params
 * @returns
 */
export const loginApi = async (params) =>
	await request.post({
		url: apiURL.Login,
		data: params,
	});

/**
 *
 * @param params
 * @returns
 */
export const logout = async (params = {}) =>
	await request.post({
		url: apiURL.Logout,
		data: params,
	});

/**
 * 获取登录用户信息
 * @param {object} params
 * @returns
 */
export  const getUserNameInfo = async () =>
	await request.get({
		url: apiURL.useInfo,
	});


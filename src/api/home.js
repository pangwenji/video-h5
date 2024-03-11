import request from '@/config/axios';
import { apiURL } from '@/enums';

/**
 *
 * @param params
 * @returns
 */
export const getTableInfo = async () =>
	await request.get({
		url: `${apiURL.TableInfo}?class_id=1`,
	});

/**
 * 获取用户限红列表
 * @returns
 */
export const getUserRedLimitList = async () =>
	await request.get({
		url: apiURL.redLimit,
	});

/**
 * 修改限红
 */
export const setRedLimitInfo = async (data) =>
	await request.post({
		url: apiURL.modifyTheRedLimit,
		data,
	});

/**
 * 获取投注历史数据
 */

export const getHistoryRecord = async (data) => {
	return await request.get({
		url: `${apiURL.betHistory}?timeType=${data.timeType}&page=${data.page}&pageSize=${data.pageSize}`,
	});
};

/**
 * 下注
 */
export const toBet = async (data)  =>
await request.post({
    url: apiURL.bet,
    data
});


/**
 * 修改用户名
 * @param {*} data
 * @returns
 */
export const setNickName = async (data)  =>
 await request.post({
        url: apiURL.setNickName,
        data
});



/**
 * 修改用户名
 * @param {*} data 
 * @returns 
 */
export const obtainCurrentDeskData = async (table_code)  =>
 await request.get({
        url: `${apiURL.getCurrentTable}?table_code=${table_code}`,
});

/**
 *取消下注
 * @param {*} data
 * @returns
 */
 export const toCancelBet = async (data) =>
 await request.post({
     url: apiURL.cancelBet,
     data,
 });


 /**
 * 获取全屏路途数据
 * @param {*} data
 * @returns
 */
 export const obtainFullScreenData = async (data) =>
 await request.get({
     url: `${apiURL.getBetListAndSoreInfo}?table_code=${data}`,
 });

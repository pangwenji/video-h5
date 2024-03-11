import store, { useTableStore, useUserInfoStore } from '@/store';
import { getUserNameInfo } from '@/api/login';
import { HttpStatus } from '@/enums';
import { getTableInfo } from '@/api/home';
import { initSocket, statisticsPlayerRecords } from '@/utils/index';
import { ElMessage } from 'element-plus';
import { getTokenFromURL } from '@/utils';

const useTables = useTableStore(store);

const { setUserDetailInfo } = useUserInfoStore();
const getDetailUserInfo = async () => {
	const result = await getUserNameInfo();
	if (result.code === HttpStatus.SUCCESS) {
		// 保存用户信息
		setUserDetailInfo?.(result.data);
	}
};

const getTableList = async () => {
	let res = await getTableInfo();
	if (res.code === HttpStatus.SUCCESS) {
		if (res.data.length > 0) {
			const list = statisticsPlayerRecords(res.data);
			useTables.setTableList(list);
		} else {
			useTables.setTableList([]);
		}
	}
};

const getServiceData = async () => {
	await getDetailUserInfo();
	await getTableList();
	await initSocket();
};

const init = async () => {
	const token = getTokenFromURL() || localStorage.getItem('TOKEN')
	if (token) {
		try {
			localStorage.setItem('TOKEN', token);
		    await	getServiceData()
		} catch (e) {
			console.log(e,'看一下抛出')
			// ElMessage.warning({
			// 	message: e.message,
			// 	offset: window.screen.height / 2,
			// });
		}
	}
};

export default init;

import { defineStore } from 'pinia';
// import { useStorage } from '@/hook/useStorage.js';

// const { setStorage, getStorage } = useStorage();
export const useTableStore = defineStore('tableParameters', {
	state: () => {
		const tableInformation = localStorage.getItem('TABLE_INFO');
		return {
			tableList: [],
			imagePath: 'sprites_chips_default',
			isShowDialogView: true,
			tableInformation: tableInformation ? JSON.parse(tableInformation) : undefined,
			tableListChip:{}
		};
	},

	getters: {
		getTableList: (state) => {
			return state.tableList;
		},

		getTableListChip: (state) => {
			return state.tableListChip;
		},

		getImagePath: (state) => {
			return state.imagePath;
		},
		getIsShowDialogView: (state) => {
			return state.isShowDialogView;
		},
		getTableInformation: (state) => {
			return state.tableInformation;
		},
	},

	actions: {
		setTableList(v) {
			this.tableList = v;
		},

		setTableListChip(v) {
			this.tableListChip = v;
		},

		setImagePath(v) {
			this.imagePath = v;
		},
		setIsShowDialogView(v) {
			this.isShowDialogView = v;
		},
		setTableInformation(v) {
			localStorage.setItem('TABLE_INFO', JSON.stringify(v));
			this.tableInformation = v;
		},
	},
	persist: true,
});

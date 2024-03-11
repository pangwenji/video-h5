import { defineStore } from 'pinia';
const USER_INFO = {
	token: null,
	account: '',
	frozen_money: '',
	money: '',
	portrait: '',
};
export const useUserStore = defineStore('user', {
	state: () => {
		const token = localStorage.getItem('TOKEN');
		return {
			userInfo: { ...USER_INFO , token},
		};
	},

	getters: {
		getUserInfo: (state) => {
			return { ...state.userInfo };
		},
	},

	actions: {
		setUserInfo(value) {
			this.userInfo.account = value.account;
			this.userInfo.frozen_money = value.frozen_money;
			this.userInfo.money = value.money;
			this.userInfo.token = value.token;
			this.userInfo.portrait = value.portrait;
		},
		resetUserInfo() {
			this.userInfo = { ...USER_INFO };
		},
	},
	persist: true,
});

import { defineStore } from 'pinia';

export const useUserInfoStore = defineStore(
	'userDetail',
	{
		state: () => ({
			userDetailInfo: {
				account: '',
				frozen_money: '',
				money: '',
				portrait: '',
				user_nick: '',
				is_special:null
			},
		}),

		getters: {
			getUserDetailInfo: (state) => {
				return state.userDetailInfo;
			},
		},

		actions: {
			setUserDetailInfo(value) {
				this.userDetailInfo.account = value.account;
				this.userDetailInfo.frozen_money = value.frozen_money;
				this.userDetailInfo.money = value.money;
				this.userDetailInfo.user_nick = value.user_nick;
				this.userDetailInfo.portrait = value.portrait;
                this.userDetailInfo.is_special = value.is_special;
			},
		},
		persist:true
	},
	{
		persist:true
	}
);

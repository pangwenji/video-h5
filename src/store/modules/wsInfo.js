import { defineStore } from 'pinia';
const comparedObj = {}
const copyData = (source, target) => {
	for (const key in source) {
		source[key] = target[key];
	}
};

const useWsInfoStore = defineStore(
	'wsInfo',
	{
		state: () => ({
			status: undefined,
			msgList: {
				search_bet: {},
				inside_table_info: {},
				join_table: {},
				table_info: {},
				search_table_user: {},
				site_bet: {},
				open_result: {},
			},
			tableLobbyInfos: undefined, // 初始化桌台信息
			send: undefined, // ws send 事件
			close: undefined, // ws close 事件
			open: undefined, // ws open 事件
			table_info: {},
		}),
		getters: {
			// search_bet
			search_bet(state) {
				return state.msgList.search_bet;
			},
		},

		actions: {
			updateMsgList(msg_data) {
				const { data, event, message } = JSON.parse(msg_data);

				if (event === 'get_table_lobby') {
					this.tableLobbyInfos = data;
					return
				} else if (event === 'event_change_round') {
					this.msgList.event_change_round = data
					return
				}

				// 为了避免无变化的数据重新赋值， 相对_.isEqual性能好些
				if (comparedObj?.[event] === msg_data) return
				comparedObj[event] = msg_data

				if (event === 'table_info') {
					const key = data.table_id;

					if (Reflect.has(this.table_info, key)) {
						this.table_info[key].total_money = data.total_money;
						this.table_info[key].total_people = data.total_people;
						copyData(this.table_info[key].winner, data.winner);
						// this.table_info[key].winner = data.winner;
					} else {
						this.table_info[key] = data;
					}
				} else {
					this.msgList[event] = data;
				}
			},
			clearList() {
				this.msgList = new Array();
			},
			updateWsStatus(status_string) {
				this.status = status_string;
			},
			bindEvent(name, event) {
				this[name] = event;
			},
		},
	},
	{
		persist: true,
	}
);

export default useWsInfoStore;


import { ref, watch, onMounted } from 'vue';
import { useTableStore, useUserInfoStore, useUserStore, useWsInfoStore } from '@/store';
import { ElMessageBox } from 'element-plus';
import mySocket from '@/utils/mySocket';
import { getTableInfo } from '@/api/home';
import { HttpStatus } from '@/enums';
import RoadmapGenerator from './roadmapGenerator';

// A 2 3 4 5 6 7 8 9 10 J Q K
const positionValue = ref([0, 40, 80, 120, 160, 200, 240, 280, 320, 360, 400, 440, 480]);

const wsInfoStore = useWsInfoStore();

const { setUserInfo } = useUserStore();
const { setUserDetailInfo } = useUserInfoStore();

// ws 重连次数
const wsConnectCount = ref(0);

const useTables = useTableStore();

export const answer = ref([
	{
		title: '网络连接问题',
		isShowSubTitle: false,
		subTitle: [
			{
				title: '什么是昵称？',
				descendants: '昵称可以让您个性化自己的名字，而不是一个无趣的 ID。',
				flag: false,
			},
			{
				title: '如何从快速版切换到普通版？',
				descendants: '您可以进入常规投注台，输入电话号码申请开始常规电话投注。工作人员在收到您的定期电话投注申请后会与您联系。',
				flag: false,
			},
		],
	},

	{
		title: '游戏类型',
		isShowSubTitle: false,
		subTitle: [
			{
				title: '快速和普通有什么区别？',
				flag: false,
				descendants:
					'在 "快速 "游戏中，您无需与电话投注员联系。您可以随时进入赌桌，随时下注，并在时间结束时出示牌。在 "常规 "中，您需要与电话投注员联系，接受一对一的独家投注服务。',
			},
			{
				title: '什么是常规模式中的静音模式？',
				flag: false,
				descendants: '	在静音模式下，您无需说话，可以自己下注，而电话投注机将根据您的下注情况进行投注。',
			},
			{
				title: '如何在常规模式下切换有声/无声模式？',
				flag: false,
				descendants: "您可以点击投注控制面板中的 '语音投注'/'无声投注'。如果找不到，请联系客服人员。",
			},
			{
				title: '为什么拨出的电话不是菲律宾的 "NO"？',
				flag: false,
				descendants: '为确保您的个人信息不被泄露，我们使用网络电话与您联系。',
			},
			{
				title: '如何玩多个游戏？',
				flag: false,
				descendants: '手机目前无法玩多种游戏。登录游戏后，电脑会在主页第一行显示多个百家乐游戏。点击后，您最多可以选择 8 种游戏进行游戏。',
			},
		],
	},

	{
		title: '游戏设备',
		isShowSubTitle: false,
		subTitle: [
			{
				title: '如果无法打开 iOS 系统上的应用程序，该怎么办？',
				flag: false,
				descendants:
					'由于 iOS 凭手机验证码领取彩金审查的原因，偶尔需要更新凭手机验证码领取彩金，无法在 iOS 系统上打开应用程序。您可以使用手机浏览器连接网页版进行游戏。',
			},
			{
				title: '哪些设备支持多重百家乐？',
				flag: false,
				descendants: 'PAD 和电脑网页版都支持多重赌注。',
			},
		],
	},

	{
		title: '操作问题',
		isShowSubTitle: false,
		subTitle: [
			{ title: '什么是昵称？', descendants: '昵称可以让您个性化自己的名字，而不是一个无趣的 ID。' },
			{
				title: '如何从快速版切换到普通版？',
				flag: false,
				descendants: '您可以进入常规投注表，输入电话号码申请开始常规电话投注。工作人员在收到您的定期电话投注申请后会与您联系。',
			},
			{
				title: '如何开始常规游戏？',
				flag: false,
				descendants: '您可以进入常规投注表，输入电话号码申请开始常规电话投注。工作人员在收到您的定期电话投注申请后会与您联系。',
			},
			{
				title: '如何关闭直播？',
				flag: false,
				descendants: '请点击 "系统设置 "中的 "直播模式 "启用或禁用直播功能。',
			},
			{
				title: '如果因操作失误申请了常规，但无法切换表格，该怎么办？',
				descendants: '请联系客户服务部门取消申请。',
			},
			{
				title: '如何关闭音效？',
				flag: false,
				descendants: '请点击 "系统设置 "中的 "游戏音效"，启用或禁用游戏音效。',
			},
			{
				title: '什么是豪华界面？什么是经典界面？',
				flag: false,
				descendants: '在豪华界面中，您可以看到同桌的玩家，更有现场感和竞争感。经典界面是您自己的界面，因此您可以更专注地玩游戏。',
			},
			{
				title: '如何关闭游戏提醒？',
				flag: false,
				descendants: '您可以在 "系统设置"→"通知设置 "中关闭游戏提醒。',
			},
			{
				title: '如何静音？',
				flag: false,
				descendants: '请点击 "系统设置 "中的 "游戏特效"，启用或禁用游戏音乐和音效。',
			},
			{
				title: '如何下载手机 APP？',
				flag: false,
				descendants: '您可以返回大厅页面，在首页顶部找到手机客户端 APP 的二维码。扫描后即可下载。',
			},
			{
				title: '什么是良好趋势提示？',
				flag: false,
				descendants: '您可以选择任何一种需要提醒的 "好趋势"。收到表格中的 "好趋势 "后，您就可以直接下注，不会错过任何获利机会。',
			},
			{
				title: '为什么过一会儿它就会自动离开桌子回到大厅？',
				flag: false,
				descendants: '当您在赌桌上不下注时，现场电话投注机将继续传牌，这在赌场是不允许的。因此，如果您在四局内没有下注，系统将自动返回大厅。',
			},
			{
				title: '如何联系游戏主播？',
				flag: false,
				descendants: '您可以进入游戏主页。每天 16:00 至 24:00 都会有主播进行直播。您可以与主播在线聊天。',
			},
			{
				title: '如何查看我的投注结果？',
				flag: false,

				descendants: '请点击 "投注历史 "查看。',
			},
		],
	},

	{
		title: '投注问题',
		isShowSubTitle: false,
		subTitle: [
			{ title: '如何获得积分？', flag: false, descendants: '请联系您的代理或网站客服。' },
			{
				title: '为什么显示的表格不是我选择的表格？',
				flag: false,
				descendants: '这可能与您的代理或门户设置有关，请联系代理或客户服务。',
			},
			{
				title: '如何从边注转到赌桌位置？',
				flag: false,
				descendants:
					'当赌桌满员或您的限额少于赌桌限额的三倍时，您将被安排在边座。加注后您可以再次进入赌桌，如果还有空位，您可以进入普通座位。',
			},
			{
				title: '如何开始投注？',
				flag: false,
				descendants: '请联系代理商或网站客服获取游戏点数，然后进入游戏桌开始游戏。',
			},
			{
				title: '充值后如何再充值？',
				flag: false,
				descendants: '请按 "信用 "旁的 "更新 "按钮刷新信用。',
			},
			{
				title: '如何计算游戏滚动？',
				flag: false,
				descendants:
					'游戏滚动与赌场的滚动筹码设置相同。例如，如果赌场的最小滚动筹码是 1000，那么游戏滚动必须是 1000 的倍数。如果您不了解算法，请联系客户服务。',
			},
			{
				title: '为什么显示 "无可用表格限制"？',
				flag: false,
				descendants: '如果您的游戏限额无法达到赌桌限额，系统将显示 "无限额可用"。请联系代理或网站客服，请他们帮助调整。',
			},
			{
				title: '如何重新设置更改我的台数限制？',
				flag: false,
				descendants: '请联系代理或网站客服，请他们帮助调整。',
			},
			{
				title: '如果视频上的结果与电脑上显示的电子卡不同，我该怎么办？?',
				flag: false,
				descendants:
					'	由于电子 I-shoe 可能会意外生成，现场的 IT 人员会进行相关更正。请不要担心，结果将以现场开放为准。如果您仍有疑问，请联系客服人员。',
			},
			{
				title: '如果我对开票结果有疑问，该怎么办？',
				flag: false,
				descendants:
					'现场比赛的所有结果都由监管部门监督，所有过程都是自动进行的。除非出现错误，否则不会出现人工干预。如果您仍有疑问，请联系客服人员。',
			},
		],
	},
]);

//使用userAgent判断
export const isMobileDevice = () => {
	return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

export const handlerEveryTableInfo = (info, table) => {
	for (let i = 0; i < table.length; i++) {
		if (table[i]['code'] === info.table_id) {
			table[i]['total_people'] = info.total_people;
			table[i]['total_money'] = info.total_money;
			if (table[i].statusInfo) {
				table[i].statusInfo.banker = info.winner.banker;
				table[i].statusInfo.player = info.winner.player;
				table[i].statusInfo.tie = info.winner.tie;
			}
		}
	}
};

export const handlerSingleTableInfo = (info, table) => {
	for (let i = 0; i < table.length; i++) {
		const element = table[i];
		const key = element.code;
		const targetItem = info[key];

		if (!targetItem) continue;

		table[i].total_people = targetItem.total_people;
		table[i].total_money = targetItem.total_money;
		if (element.statusInfo) {
			table[i].statusInfo.banker = targetItem.winner.banker;
			table[i].statusInfo.player = targetItem.winner.player;
			table[i].statusInfo.tie = targetItem.winner.tie;
		}
	}
};

export const initSocket = async () => {
	// 连接ws
	const { status, data, open, close, send, def, disconnectSignal } = await mySocket();
	watch(
		disconnectSignal,
		(v) => {
			if (v) {
				wsConnectCount.value = 7;
				ElMessageBox.alert(v.reason, '', {
					confirmButtonText: '确定',
					showCancelButton: false,
					showConfirmButton: false,
					showClose: false,
				});
			}
		},
		{
			immediate: true,
		}
	);

	watch(status, (val) => {
		wsInfoStore.updateWsStatus(val);
		const pathName = '';
		// const roomId = '';

		if (val === 'OPEN') {
			wsConnectCount.value = 0;
			if (pathName === 'room') {
			} else {
				send?.(
					JSON.stringify({
						event: 'get_lobby',
						data: {},
					})
				);
			}
			setInterval(() => {
				send?.(
					JSON.stringify({
						event: 'ping',
					})
				);
			}, 1000 * 30);
		}
		if (val === 'CLOSED') {
			const token = localStorage.getItem('TOKEN');
			if (!token) return;
			wsConnectCount.value = wsConnectCount.value + 1;
			setTimeout(() => {
				if (wsConnectCount.value >= 6) {
					ElMessageBox.alert('连线中央服务器失败，请稍后再试', {
						dangerouslyUseHTMLString: true,
						showClose: false,
						showCancelButton: false,
						showConfirmButton: false,
						closeOnClickModal: false,
						closeOnPressEscape: false,
						closeOnHashChange: false,
						customStyle: {
							backgroundColor: 'rgba(0, 0, 0, .6)',
							border: `1px solid hsla(0,0%,59%, .6)`,
							padding: `8px 24px`,
							lineHeight: 1.4,
							fontSize: '17px',
							borderRadius: '4px',
							textAlign: 'center',
							color: '#fff',
							boxShadow: `0 4px 16px 2px rgba(0, 0, 0, .74)`,
						},
					});
					return;
				}
				if (status.value === 'CLOSED') reconnect();
			}, 1000);
		}
	});
	function reconnect() {
		close?.();
		open?.();
	}
	watch(data, (val) => {
		wsInfoStore.updateMsgList(val);
	});
	wsInfoStore.bindEvent('open', open);
	wsInfoStore.bindEvent('send', send);
	wsInfoStore.bindEvent('close', close);
};

const countOccurrences = (arr) => {
	return arr.reduce((acc, curr) => {
		acc[curr] = (acc[curr] || 0) + 1;
		return acc;
	}, {});
};

export const processingChipDistribution = (chips) => {
	for (let item in chips) {
		if (chips[item]) {
			chips[item] = countOccurrences(chips[item]);
		}
	}
	return chips;
};

export const setThousandsOfPoints = (v) => {
	if (v < 1000) {
		return v;
	}
	const quotient = v / 1000;
	if (quotient < 1) {
		const roundedQuotient = (quotient * 1000) % 1 === 0 ? Math.round(quotient * 1000) / 1000 : (quotient * 1000) / 1000;
		return `${roundedQuotient.toString().replace(/(\.0+)$/, '')}k`;
	} else {
		return `${quotient.toFixed(2).replace(/0$/, '')}k`;
	}
};

export const updateRouteMap = (oldList, newList) => {
	let total = [];
	let set = new Set();

	const removeDuplicates = (array) => {
		array.forEach((item) => {
			if (!set.has(item.round_id)) {
				set.add(item.round_id);
				total.push(item);
			}
		});
	};
	removeDuplicates(oldList);
	removeDuplicates(newList);
	return total;
};

// 设置 庄闲和对应的颜色
export const colorRec = {
	Player: '#2033d9',
	Banker: '#d9202c',
	Tie: '#21d924',
	player: '#2033d9',
	banker: '#d9202c',
	tie: '#21d924',
};

export const enumInfoList = {
	winner: {
		1: {
			name: 'Player',
			text: '闲',
		},
		2: {
			name: 'Tie',
			text: '和',
		},
		3: {
			name: 'Banker',
			text: '庄',
		},
	},
	player: {
		text: '闲',
	},
	banker: {
		text: '庄',
	},
	tie: {
		text: '和',
	},
	pair: {
		1: '', // 没有对子
		2: 'Player', // 闲家对子
		3: 'Banker', //庄家对子
		4: 'Player,Banker', // 庄家闲家都是对子
	},
};

// 转换原始数据
export const convertOriginalData = (value) => {
	let arr = [];
	for (let i in value) {
		if (value[i].original_data) {
			const original_data = JSON.parse(value[i].original_data);
			const winnerEnumInfo = enumInfoList.winner[original_data.winner_mark];
			const isPairEnumInfo = enumInfoList.pair[original_data.winner_pair_mark];
			arr.push({
				winner: winnerEnumInfo.name,
				isPair: isPairEnumInfo,
				color: colorRec[winnerEnumInfo.name],
				text: winnerEnumInfo.text,
			});
		} else {
			arr = [];
		}
	}
	return arr;
};

const getTheLatestValue = (matrix) => {
	let lastNonEmptyColumn = -1;
	matrix.forEach((row) => {
		row.forEach((item, index) => {
			if (item !== null && item !== undefined && item !== 0) {
				lastNonEmptyColumn = Math.max(lastNonEmptyColumn, index);
			}
		});
	});
	if (lastNonEmptyColumn === -1) {
		return null;
	}
	let lastValue = null;
	let lastValueRow = -1;
	matrix.forEach((row, rowIndex) => {
		const item = row[lastNonEmptyColumn];
		if (item !== null && item !== undefined && item !== 0) {
			lastValue = item;
			lastValueRow = rowIndex;
		}
	});

	if (lastValue !== null) {
		return lastValue;
	} else {
		return null;
	}
};

export const getTheLastOneOnTheRoadMap = (value) => {
	const routeParameters = {
		bigeyeItemData: {},
		smallroadItemData: {},
		cockroachPigItemData: {},
	};
	const { bigeyeboy, smallroad, cockroachPig } = value;
	routeParameters.bigeyeItemData = getTheLatestValue(bigeyeboy.matrix);
	routeParameters.smallroadItemData = getTheLatestValue(smallroad.matrix);
	routeParameters.cockroachPigItemData = getTheLatestValue(cockroachPig.matrix);
	return routeParameters;
};

export const formatMoney = (v) => {
	if (v) {
		return parseFloat(v).toFixed(2);
	} else {
		return 0;
	}
};

export const setWenImage = (v) => new URL(`../assets/table-view/${v}.png`, import.meta.url).href;

export const setRecordImage = (v) => new URL(`../assets/game-record/${v}.png`, import.meta.url).href;

export const statisticsPlayerRecords = (array) => {
	for (let i = 0; i < array.length; i++) {
		let banker = [];
		let player = [];
		let he = [];
		let total = [];
		if (array[i]['records'].length > 0) {
			array[i]['records'].forEach((v) => {
				if (v['original_data']) {
					const origin = JSON.parse(v['original_data']);
					total.push(origin);
				}
			});
			total.forEach((element) => {
				let flag = element['winner_mark'];
				if (flag === 3) {
					banker.push(flag);
				} else if (flag === 2) {
					he.push(flag);
				} else if (flag === 1) {
					player.push(flag);
				}
			});

			array[i].statusInfo = {
				banker: banker.length,
				player: player.length,
				he: he.length,
			};
		}
	}
	return array;
};

export const handlerCardType = (v) => {
	const value = v.split('-');
	// 那种卡片类型 1 方块 2 梅花  3 黑桃 4 红桃
	// blackPeach-poker 黑桃  club-poker黑梅花   redBlock-poker 红方块  redPeach-poker 红桃
	const flag = Number(value[0]);

	const flagMapping = {
		1: 'redBlock-poker',
		2: 'club-poker',
		3: 'blackPeach-poker',
		4: 'redPeach-poker',
	};

	return flagMapping[flag] || '';
};

export const setCardType = (v) => {
	const value = v.split('-');
	// 那种卡片类型 1 方块 2 梅花  3 黑桃 4 红桃
	//  card_h_sm redPeach-poker 红桃
	// card_s_sm blackPeach-poker 黑桃
	// card_d_sm redBlock-poker 红方块

	const flag = Number(value[0]);

	const flagToCardMap = {
		1: 'card_d_sm',
		2: 'card_c_sm',
		3: 'card_s_sm',
		4: 'card_h_sm',
	};

	if (flagToCardMap.hasOwnProperty(flag)) {
		return flagToCardMap[flag];
	} else {
		// 处理未知标志的情况，例如抛出错误或返回默认值
		return 'unknown';
	}
};

export const handlerCardPosition = (v, type) => {
	// A 2 3 4 5 6 7 8 9 10 J Q K
	let positionValue;
	if (type === 'table-view') {
		positionValue = [0, 40, 80, 120, 160, 200, 240, 280, 320, 360, 400, 440, 480];
	} else {
		positionValue = [0, 20, 40, 60, 80, 100, 120, 140, 160, 180, 200, 220, 240];
	}

	const d = v.split('-');
	switch (d[1]) {
		case 'A':
			return positionValue[0];
		case '2':
			return positionValue[1];
		case '3':
			return positionValue[2];
		case '4':
			return positionValue[3];
		case '5':
			return positionValue[4];
		case '6':
			return positionValue[5];
		case '7':
			return positionValue[6];
		case '8':
			return positionValue[7];
		case '9':
			return positionValue[8];
		case '10':
			return positionValue[9];
		case 'J':
			return positionValue[10];
		case 'Q':
			return positionValue[11];
		case 'K':
			return positionValue[12];
		default:
			break;
	}
};

// 转换原始数据为专用的结果列表
const convertGeneralResultsList = (results) => {
	let newArr = [];
	for (let i in results) {
		newArr.push({
			outcome: results[i].winner.toLocaleLowerCase(),
			natural: 'none',
			pair: enumInfoList.pair[results[i].winner_pair_mark] || 'none',
		});
	}
	return newArr;
};

// 将一维数组转换为二维数组（主要是 下三路的数据转换） 转换之后的数据可填入路图
export const convertToMatrix = (dataList) => {
	let matrix = [];
	let currentColor = '';
	let currentColumn = -1;

	for (let item of dataList) {
		if (item !== currentColor || matrix[currentColumn]?.length === 6) {
			currentColor = item;
			currentColumn++;
			matrix[currentColumn] = [];
		}

		matrix[currentColumn].push(item);
	}

	matrix = matrix.map((column) => {
		while (column.length < 6) {
			column.push('');
		}
		return column;
	});

	let result = [];
	for (let i = 0; i < 6; i++) {
		result[i] = [];
		for (let j = 0; j < matrix.length; j++) {
			result[i][j] = matrix[j][i];
		}
	}

	return result;
};

export const mapGenerator = (result_list) => {
	const roadmapGenerator = new RoadmapGenerator();

	const resultList = convertGeneralResultsList(result_list);

	const bigRoadList = roadmapGenerator.bigRoad(resultList);
	// 此数据可以填入路图
	const lastBigEyeReuslt = roadmapGenerator.bigEyeRoad(bigRoadList);

	const bigEyeItem = lastBigEyeReuslt[lastBigEyeReuslt.length - 1];

	// 小路处理之后的数据
	const lastSmallRoadList = roadmapGenerator.smallRoad(bigRoadList);

	const SmallItem = lastSmallRoadList[lastSmallRoadList.length - 1];

	// 小强路的数据
	const cockroachRoadList = roadmapGenerator.cockroachPig(bigRoadList);
	const convertedCockroachMatrix = convertToMatrix(cockroachRoadList);
	const CockroachItem = cockroachRoadList[cockroachRoadList.length - 1];
	return {
		bigEye: bigEyeItem,
		small: SmallItem,
		cockRoach: CockroachItem,
	};
};

export const convertGeneralResultsLists = (mapList) => {
	let arr = new Array();
	const copyArr = JSON.parse(JSON.stringify(mapList));
	for (let i in copyArr) {
		const original_data = JSON.parse(copyArr[i].original_data);
		const winnerEnumInfo = enumInfoList.winner[original_data.winner_mark];
		const isPairEnumInfo = enumInfoList.pair[original_data.winner_pair_mark];
		arr.push({
			winner: winnerEnumInfo.name,
			isPair: isPairEnumInfo,
			color: colorRec[winnerEnumInfo.name],
			text: winnerEnumInfo.text,
			outcome: winnerEnumInfo.name.toLocaleLowerCase(),
			natural: 'none',
			pair: enumInfoList.pair[copyArr[i].winner_pair_mark] || 'none',
		});
	}
	return arr;
};

const removeDuplicateRoundIds = (data) => {
	// 创建一个空对象，用于存储已经出现过的 round_id
	let roundIds = {};
	let tableId = '';
	// 遍历数据中的每个对象
	data.forEach((item) => {
		// 遍历当前对象中的 records 数组
		item.records = item.records.filter((record) => {
			if (record.table_id) {
				tableId = record.table_id;
			}
			if (!record.table_id) {
				record.table_id = tableId;
			}
			// 如果当前 round_id 已经存在于 roundIds 对象中，则返回 false，表示过滤掉这个记录
			if (roundIds[record.round_id]) {
				return false;
			} else {
				// 如果当前 round_id 不存在于 roundIds 对象中，则将其添加到 roundIds 中，并返回 true，保留这个记录
				roundIds[record.round_id] = true;
				return true;
			}
		});
	});

	// 返回处理后的数据
	return data;
};

//
export const updateTableData = (tableList, list, table_code) => {
	tableList.forEach((element) => {
		if (table_code === element.code) {
			list.forEach((item) => {
				let obj = {
					banker_pair: item.banker_pair,
					round_id: item.round_id,
					player_pair: item.player_pair,
					table_id: element.table_id,
					original_data: item.original_data,
				};
				element.records.push(obj);
			});
		}
	});

	const newTableList = removeDuplicateRoundIds(tableList);
	return newTableList;
};

// 换靴
export const changeBootsTableData = (table_code) => {
	let tableList = useTables.getTableList;
	tableList.forEach((item) => {
		if (item.code === table_code) {
			item.records = [];
		}
	});
	useTables.setTableList(tableList);
};

export const hasValue = (obj) => {
	return Object.keys(obj).length > 0;
};

export const formatNumber = (number) => {
	// 将数字转换为字符串
	let numStr = number.toString();

	// 分割整数部分和小数部分
	let parts = numStr.split('.');
	let integerPart = parts[0];
	let decimalPart = parts.length > 1 ? '.' + parts[1] : '';

	// 添加千位分隔符
	integerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

	// 返回格式化后的数字
	return integerPart + decimalPart;
};

export const getTableList = async () => {
	try {
		let res = await getTableInfo();
		if (res.code === HttpStatus.SUCCESS) {
			if (res.data.length > 0) {
				const list = statisticsPlayerRecords(res.data);
				useTables.setTableList(list);
			} else {
				useTables.setTableList([]);
			}
		} else {
		}
	} catch (error) {}
};

export const getTokenFromURL = () => {
	// 获取当前页面的 URL
	const url = window.location.href;
	// 使用正则表达式匹配 token 参数
	const tokenRegex = /[?&]token=([^&#]*)/i;
	const tokenMatch = tokenRegex.exec(url);
	// 如果找到匹配的 token 参数，则返回对应的值
	if (tokenMatch) {
		return decodeURIComponent(tokenMatch[1].replace(/\+/g, ' '));
	} else {
		return null;
	}
};

let hideTimer = null;
const handleDocumentHide = () => {
	if (document.visibilityState === 'hidden') {
		hideTimer = setTimeout(() => {
			wsConnectCount.value = 1
			wsInfoStore?.close?.()
			hideTimer = null
		}, 2000);
	} else {
		if (hideTimer) {
			clearTimeout(hideTimer);
		} else {
			wsInfoStore?.open?.()
			if (Reflect.has(wsInfoStore.msgList, 'open_timer') && Reflect.has(wsInfoStore.msgList.open_timer, 'time')) {
				wsInfoStore.msgList.open_timer.time = 0
			}
		}
	}
};

export const initWindowHidden = () => {
	onMounted(() => {
		document.addEventListener('visibilitychange', handleDocumentHide);
	});
};

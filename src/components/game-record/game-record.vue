<template>
	<el-drawer v-model="showGameRecord" :show-close="false" size="100%" :append-to-body="true">
		<div class="container" >
			<div class="content">
				<div class="section">
					<div class="full" >
						<div class="header">
							<ArrowLeft @click="closes()" />
							<span name="Title" class="title">投注记录</span>
						</div>
						<div class="divider"></div>
					</div>
					<div class="section">
						<div class="t-mx-2" >
							<div class="drop-down">
								<span class="current-item" @click="chooseTime">
									<div class="box-left"><span class="label"></span></div>
									<div class="box-right">
										<span class="title">{{ timeLabel }}</span
										><span class="icon icon-arrow"> </span>
									</div>
								</span>
								<div class="dropdown" v-if="isShowTimeList">
									<ul class="list">
										<li @click="chooseTimeItem('今天')">
											<span class="item-label" :class="{ active: timeLabel === '今天' }">今天</span>
										</li>
										<li @click="chooseTimeItem('昨天')">
											<span class="item-label" :class="{ active: timeLabel === '昨天' }">昨天</span>
										</li>
										<li @click="chooseTimeItem('最近 7 天')">
											<span class="item-label" :class="{ active: timeLabel === '最近 7 天' }">最近 7 天</span>
										</li>
									</ul>
								</div>
							</div>
						</div>
						<div class="t-grid-cols-3">
							<div class="t-box">
								<span class="t-text-xs">投注总额</span><span class="t-text-sm">{{ betTotalAmount ?? 0 }}</span>
							</div>
							<div class="t-box">
								<span class="t-text-xs">派彩总计</span><span class="t-text-sm">{{ winTotalAmount ?? 0 }}</span>
							</div>
							<div class="t-box">
								<span class="t-text-xs">转码总计</span><span class="t-text-sm">{{ profitTotalAmount ?? 0 }}</span>
							</div>
						</div>
						<span class="t-text-x"> {{ startTime }} - {{ endTime }}（北京时区） </span>
						<div class="t-overflow-y-autos hide-scrollbar" ref="scrollContainer">
							<div v-if="list.length" id="scroll-area">
								<div
									class="t-list__item"
									:class="{ selected: isActive === index }"
									v-for="(item, index) in list"
									:key="item"
									@click="choose(item, index)"
								>
									<div class="item-content">
										<div class="content-item">
											<div class="left-top">
												<span class="t-tag t-mr-2 fast">快速</span>
												<span class="t-text-xs">{{ item.table_code }}</span>
											</div>
											<div class="left-middle">
												<span class="t-game-result"> {{ item.info }} </span>
												<div
													class="t-rounded-full"
													v-if="item.banker && item.player"
													:style="{ backgroundColor: setColor(item.status) }"
												>
													<span class="t-winner"> {{ item.label }}</span>
												</div>
											</div>
											<div class="left-bottom">{{ item.created_at }}</div>
										</div>
										<div class="right-content">
											<span>{{ timeLabel }}</span>
											<span class="t-mt-r">{{ item?.bet }}</span>
											<span class="t-mt-1.5 t-text-xs t-text-gold-500">{{ item?.profit }}</span>
											<span>{{ betStatus[item.bet_status] }}</span>
										</div>
									</div>
									<div class="game-divider"></div>
								</div>
							</div>
							<div class="t-no-bet-result" v-else>无结果</div>
						</div>
						<div class="pagination">
							<div class="pagination-item left" @click="goToNext(-1)">上一页</div>
							<div class="pagination-item right" @click="goToNext(1)">下一页</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</el-drawer>
	<el-dialog v-model="resultCard"  :show-close="false" width="60%" :before-close="cancelChoose">
		<div class="border-wrapper body border-wrapper gray bg-black">
			<div class="table-wrapper">
				<table>
					<tbody>
						<tr>
							<td class="banker">
								<span class="t-mr-2"> Banker </span>
							</td>
							<td class="card-wrapper">
								<div
									class="card"
									:style="{
										'background-image': `url(${setRecordImage(cardStatus.banker.firsCard.type)})`,
										'background-position': `${cardStatus.banker.firsCard.position}px 0px`,
									}"
								></div>
								<div
									class="card"
									:style="{
										'background-image': `url(${setRecordImage(cardStatus.banker.secondCard.type)})`,
										'background-position': `${cardStatus.banker.secondCard.position}px 0px`,
									}"
								></div>
								<div
									class="card horizontal"
									:style="{
										'background-image': `url(${setRecordImage(cardStatus.banker.thirdCard.type)})`,
										'background-position': `${cardStatus.banker.thirdCard.position}px 0px`,
									}"
								></div>
							</td>
						</tr>
						<tr>
							<td colspan="2">
								<div class="separator"></div>
							</td>
						</tr>
						<tr>
							<td class="player">
								<span class="t-mr-2"> Player</span>
							</td>
							<td class="card-wrapper">
								<div
									class="card"
									:style="{
										'background-image': `url(${setRecordImage(cardStatus.player.firsCard.type)})`,
										'background-position': `${cardStatus.player.firsCard.position}px 0px`,
									}"
								></div>
								<div
									class="card"
									:style="{
										'background-image': `url(${setRecordImage(cardStatus.player.secondCard.type)})`,
										'background-position': `${cardStatus.player.secondCard.position}px 0px`,
									}"
								></div>
								<div
									class="card horizontal"
									:style="{
										'background-image': `url(${setRecordImage(cardStatus.player.thirdCard.type)})`,
										'background-position': `${cardStatus.player.thirdCard.position}px 0px`,
									}"
								></div>
							</td>
						</tr>
					</tbody>
				</table>
			</div>
		</div>
	</el-dialog>
</template>

<script setup>
import { ref, defineProps, watch, defineEmits, onMounted, nextTick } from 'vue';
import { getHistoryRecord } from '@/api/home';
import { setRecordImage } from '@/utils';
import { ElMessage } from 'element-plus';
import { initSocket, handlerCardType, handlerCardPosition, setCardType } from '@/utils';
import ArrowLeft from '@/components/svg/arrow-left.vue';
const props = defineProps({
	isShow: {
		type: Boolean,
		required: false,
	},
});

const resultCardRef = ref();

const betStatus = ref({
	0: '未派彩',
	1: '自动派彩',
	2: '手动派彩',
	3: '取消投注',
	4: '已退款',
});

const betTotalAmount = ref(0);
const winTotalAmount = ref(0);
const profitTotalAmount = ref(0);

let scroll = ref();

const isLoading = ref(false); // 是否正在加载数据

const scrollContainer = ref();

const startTime = ref();

const endTime = ref();

const winner = ref({
	label: '',
	status: 0,
});

const cardTypeFirst = ref('');

const cardStatus = ref({
	banker: {
		firsCard: {
			type: '',
			position: '',
		},
		secondCard: {
			type: '',
			position: '',
		},
		thirdCard: {
			type: '',
			position: '',
		},
	},
	player: {
		firsCard: {
			type: '',
			position: '',
		},
		secondCard: {
			type: '',
			position: '',
		},
		thirdCard: {
			type: '',
			position: '',
		},
	},
});

const resultCard = ref(false);

const isActive = ref();

const timeLabel = ref('今天');

const list = ref(['', '', '']);

const param = ref({
	timeType: timeLabel.value,
	page: 1,
	pageSize: 10,
	total: 0,
	currentPage: 1,
	totalPage: 0,
});

const cancelChoose = () => {
	isActive.value = false;
	resultCard.value = false;
};

const emit = defineEmits(['close']);

const isShowTimeList = ref(false);

const showGameRecord = ref(false);

const closes = () => {
	isShowTimeList.value = false;
	emit('close', false);
};

const calculateDisplayWhichCard = (item) => {
	const banker = item.banker && item.banker.split('|');

	const player = item.player && item.player.split('|');
	if (banker[0]) {
		cardStatus.value.banker.firsCard.type = setCardType(banker[0]);
		cardStatus.value.banker.firsCard.position = -handlerCardPosition(banker[0], 'game-record');
	}

	if (banker[1]) {
		cardStatus.value.banker.secondCard.type = setCardType(banker[1]);
		cardStatus.value.banker.secondCard.position = -handlerCardPosition(banker[1], 'game-record');
	}

	if (banker[2]) {
		cardStatus.value.banker.thirdCard.type = setCardType(banker[2]);
		cardStatus.value.banker.thirdCard.position = -handlerCardPosition(banker[2], 'game-record');
	}
	if (player[0]) {
		cardStatus.value.player.firsCard.type = setCardType(player[0]);
		cardStatus.value.player.firsCard.position = -handlerCardPosition(player[0], 'game-record');
	}

	if (player[1]) {
		cardStatus.value.player.secondCard.type = setCardType(player[1]);
		cardStatus.value.player.secondCard.position = -handlerCardPosition(player[1], 'game-record');
	}

	if (player[2]) {
		cardStatus.value.player.thirdCard.type = setCardType(player[2]);
		cardStatus.value.player.thirdCard.position = -handlerCardPosition(player[2], 'game-record');
	}
};

const choose = (item, v) => {
	isActive.value = v;
	resultCard.value = true;

	calculateDisplayWhichCard(item);
};


const chooseTime = () => {
	isShowTimeList.value = !isShowTimeList.value;
};

const goToNext = (v) => {
	if (v === -1) {
		--param.value.currentPage;
		if (param.value.currentPage > 0) {
			param.value.page = param.value.currentPage;
			getBetHistoryData();
		}
	} else if (v === 1) {
		if (param.value.totalPage > 1) {
			++param.value.currentPage;
			if (param.value.currentPage <= param.value.totalPage) {
				param.value.page = param.value.currentPage;
				getBetHistoryData();
			}
		}
	}
};

const changeTime = (v) => {
	const currentDate = new Date();
	if (v === '今天') {
		setTime();
	} else if (v === '昨天') {
		// 获取当前日期
		// 获取昨天日期
		const yesterdayDate = new Date(currentDate);
		yesterdayDate.setDate(currentDate.getDate() - 1);
		// 将日期格式化为 yyyy-mm-dd 的格式
		const year = yesterdayDate.getFullYear();
		const month = String(yesterdayDate.getMonth() + 1).padStart(2, '0');
		const day = String(yesterdayDate.getDate()).padStart(2, '0');
		// 昨天开始时间
		startTime.value = `${year}-${month}-${day} 00:00:00`;
		// 昨天结束时间
		endTime.value = `${year}-${month}-${day} 23:59:59`;
	} else if (v === '最近 7 天') {
		// 获取7天前的日期
		const sevenDaysAgo = new Date(currentDate);
		sevenDaysAgo.setDate(currentDate.getDate() - 6); // 因为包括今天在内，所以减去6天

		// 将日期格式化为 yyyy-mm-dd 的格式
		const year = sevenDaysAgo.getFullYear();
		const month = String(sevenDaysAgo.getMonth() + 1).padStart(2, '0');
		const day = String(sevenDaysAgo.getDate()).padStart(2, '0');

		// 最近7天开始时间
		startTime.value = `${year}-${month}-${day} 00:00:00`;

		// 当天结束时间（即当前时间）
		const currentYear = currentDate.getFullYear();
		const currentMonth = String(currentDate.getMonth() + 1).padStart(2, '0');
		const currentDay = String(currentDate.getDate()).padStart(2, '0');
		const currentHours = String(currentDate.getHours()).padStart(2, '0');
		const currentMinutes = String(currentDate.getMinutes()).padStart(2, '0');
		const currentSeconds = String(currentDate.getSeconds()).padStart(2, '0');
		endTime.value = `${currentYear}-${currentMonth}-${currentDay} ${currentHours}:${currentMinutes}:${currentSeconds}`;
	}
};

const chooseTimeItem = (v) => {
	isShowTimeList.value = false;
	timeLabel.value = v;
	getBetHistoryData();
	changeTime(v);
};

const getBetHistoryData = async () => {
	if (timeLabel.value === '今天') {
		param.value.timeType = 'today';
	} else if (timeLabel.value === '昨天') {
		param.value.timeType = 'yesterday';
	} else if (timeLabel.value === '最近 7 天') {
		param.value.timeType = 'sevenday';
	}
	const result = await getHistoryRecord(param.value);
	if (result.success) {
		ElMessage.success({
			message: '查询成功！',
			offset: window.screen.height / 2,
		});
		if (result.data.items.length > 0) {
			result.data.items.forEach((item) => {
				item.info = calculateZhuangXian(item);
			});
			list.value = result.data.items;
		} else {
			list.value = [];
		}
		betTotalAmount.value = result.data?.pageInfo?.total_bet;
		winTotalAmount.value = result.data?.pageInfo?.total_profit;
		profitTotalAmount.value = result.data?.pageInfo?.total_profit;
		param.value.currentPage = result.data?.pageInfo?.currentPage || 1;
		param.value.totalPage = result.data?.pageInfo?.totalPage || 0;
	} else {
		ElMessage.error({
			message: result.message,
			offset: window.screen.height / 2,
		});
		list.value = [];
	}
};

const calculatePoint = (array) => {
	let point = 0;
	if (array && array.length > 0) {
		array.forEach((item) => {
			const itemSub = item.split('-');
			if (itemSub.length > 0) {
				if (itemSub[2]) {
					point += Number(itemSub[2]);
				}
			}
		});
	}
	return point % 10;
};

const calculateZhuangXian = (item) => {
	// 那种卡片类型 1 方块 2 梅花  3 黑桃 4 红桃
	// blackPeach-poker 黑桃  club-poker黑梅花   redBlock-poker 红方块  redPeach-poker 红桃
	// "player": "2-9-9|1-Q-10|",
	// "banker": "2-A-1|1-A-1|"
	let bankerInfoArray;
	let playerInfoArray;
	let bankerPoint = 0;
	let playerPoint = 0;
	if (item) {
		if (item.banker && item.player) {
			bankerInfoArray = item.banker.split('|');
			playerInfoArray = item.player.split('|');
			if (bankerInfoArray && bankerInfoArray.length > 0) {
				bankerPoint = calculatePoint(bankerInfoArray);
				playerPoint = calculatePoint(playerInfoArray);
				if (bankerPoint > playerPoint) {
					item.label = '庄';
					item.status = 0;
				} else if (bankerPoint < playerPoint) {
					item.label = '闲';
					item.status = 1;
				} else if (bankerPoint === playerPoint) {
					item.label = '和';
					item.status = 2;
				}
			}
			return `庄(${bankerPoint})闲(${playerPoint})`;
		}
	}
};

const setColor = (v) => {
	if (v === 0) {
		return 'red';
	} else if (v === 1) {
		return 'blue';
	} else if (v === 2) {
		return 'green';
	}
};

const initializationBeScroll = () => {
	
};

const setTime = () => {
	// 获取当前日期
	const currentDate = new Date();

	// 将日期格式化为 yyyy-mm-dd 的格式
	const year = currentDate.getFullYear();
	const month = String(currentDate.getMonth() + 1).padStart(2, '0');
	const day = String(currentDate.getDate()).padStart(2, '0');

	// 将时间格式化为 hh:mm:ss 的格式
	const hours = String(currentDate.getHours()).padStart(2, '0');
	const minutes = String(currentDate.getMinutes()).padStart(2, '0');
	const seconds = String(currentDate.getSeconds()).padStart(2, '0');

	// 当天开始时间
	startTime.value = `${year}-${month}-${day} 00:00:00`;

	// 当天结束时间
	endTime.value = `${year}-${month}-${day} 23:59:59`;
};

watch(
	() => props.isShow,
	(v) => {
		showGameRecord.value = v;
		if (v) {
			getBetHistoryData();
		}
	}
);
onMounted(() => {
	nextTick(() => {
		initializationBeScroll();
	});
	setTime();
});
</script>
<style lang="less" scoped>
@import url('../settings/settings.less');
@import url('./game-record.less');

.el-overlay-dialog{
	height: 100%;
	top: 0;
	width: 100%;
	left: 0;
	display: flex;
	align-items: center;
	justify-content: center;
	.el-dialog__header{
		padding: 0;
		background: transparent !important;
	}
	.el-dialog__body{
		padding: 0;
	}
}
</style>


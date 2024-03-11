<template>
	<div>
		<div class="st-game">
			<div class="table-header">
				<div class="header-left">
					<Back @click="goBack" />
					<div class="t-text-sm">
						<div class="t-flex">
							<Dollar />
							<div>
								<span class="number-grow">{{ formatNumber(userUserInfo.getUserDetailInfo?.money ?? 0) }}</span>
							</div>
						</div>
						<div class="t-ml-ls"></div>
					</div>
				</div>
				<div class="header-right">
					<div class="t-margin" @click="handlerNetWorkStatus">
						<img src="@/assets/svg/signal.svg" width="20" height="20" alt="" />
					</div>
					<div class="t-margin" @click="showChannel">
						<img src="@/assets/svg/video.svg" width="20" height="20" alt="" />
					</div>
					<div class="t-margin" @click="showNotice(true)">
						<img src="@/assets/svg/notice.svg" width="20" height="20" alt="" />
					</div>
					<div class="t-hamburger new-feature" @click="settings">
						<img src="@/assets/svg/hamburger.svg" width="20" height="20" alt="" />
					</div>
				</div>
			</div>
			<div class="st-game-layout">
				<div class="t-flex-content">
					<div class="video-area" style="width: 100%; height: 211.125px; max-height: 211.125px">
						<BaccaratLivePlayer ref="tableLivePlayerRef" :live-url="liveVideoUrl" />
					</div>
					<div class="fake-wrapper" style="max-height: 211.688px">
						<div class="interaction-layout" style="bottom: 4px">
							<div class="t-justify-end"></div>
						</div>
					</div>
					<div class="table-game-layout">
						<div class="game-layout">
							<div class="game-layout-header">
								<div class="t-text-green-400">百家乐 {{ tableInfo?.code }}</div>
								<div>本局投注 {{ formatMoney(betReadyMoney) ?? 0 }}</div>
								<div class="t-mr-1" @click="(e) => showTableDetail(e)">
									<div class="t-mr-5">{{ setThousandsOfPoints(tableInfo?.min) }} - {{ setThousandsOfPoints(tableInfo?.max) }}</div>
									<ArrowDown />
								</div>
							</div>
							<div class="bet-area-layout" vid="9D01">
								<div class="multiple-table">
									<div class="bet-area">
										<div class="bet-block-wrapper tablecloth-mobile t-w-full t-h-full">
											<div class="bet-block t-relative h-45">
												<!-- 闲 -->
												<div
													class="t-relative player-border-bottom"
													:class="{ overlay: isOverlyXian === 'p' }"
													@mousedown="handlerXian('p')"
													@mouseup="handlerXian('')"
													@touchstart="handlerXian('p')"
													@touchend="handlerXian('')"
													@click="addChipXian"
												>
													<div class="playtype" :class="{ disable: isCanBet }">
														<div class="bet-item-s play-color playtype-text t-flex-col">
															<div class="t-title">闲对</div>
															<span class="t-text-xs t-leading-3 t-subtitle"
																>1:{{ playExplain?.first_player_pair?.ratio ?? 0 }}</span
															>
															<div class="play-bottom-text">
																{{ formatMoney(betListInfo?.player_pair?.bet_amount) ?? 0 }} /
																{{ formatMoney(betListInfo?.player_pair?.total_people) ?? 0 }}
															</div>
														</div>
														<div class="svg-area">
															<BetSvg :chip="chips" :type="tableInfo?.confirm_switch" ref="betSvgRef" />
														</div>
													</div>
												</div>
												<div
													class="t-relative he-border"
													:class="{ overlay: isOverlyHe === 't' }"
													@mousedown="handlerHe('t')"
													@mouseup="handlerHe('')"
													@touchstart="handlerHe('t')"
													@touchend="handlerHe('')"
													@click="addChipHe"
												>
													<div class="playtype" :class="{ disable: isCanBet }">
														<div class="bet-item-s he-color playtype-text t-flex-col">
															<div class="t-title">和</div>
															<span class="t-text-xs t-leading-3 t-subtitle"
																>1:{{ playExplain?.banker_player_same_pointer?.ratio ?? 0 }}</span
															>
															<div class="play-bottom-text">
																{{ formatMoney(betListInfo?.tie?.bet_amount) ?? 0 }} /
																{{ formatMoney(betListInfo?.tie?.total_people) ?? 0 }}
															</div>
														</div>
														<div class="svg-area">
															<BetSvg :chip="chips" :status="tableInfo?.confirm_switch" ref="betSvgHe" />
														</div>
													</div>
												</div>
												<!-- 超级星期六 -->
												<div
													v-if="isShowSuper6"
													class="t-relative he-border"
													:class="{ overlay: isOverlySuper === 'super6' }"
													@mousedown="handlerSuper('super6')"
													@mouseup="handlerSuper('')"
													@touchstart="handlerSuper('super6')"
													@touchend="handlerSuper('')"
													@click="addChipSuper"
												>
													<div class="playtype" :class="{ disable: isCanBet }">
														<div class="bet-item-s he-color playtype-text t-flex-col">
															<div class="t-title">超级星期六</div>
															<span class="t-text-xs t-leading-3 t-subtitle"
																>1:{{ playExplain?.banker_player_same_pointer?.ratio ?? 0 }}</span
															>
															<div class="play-bottom-text">
																{{ formatMoney(betListInfo?.super_six?.bet_amount) ?? 0 }} /
																{{ formatMoney(betListInfo?.super_six?.total_people) ?? 0 }}
															</div>
														</div>
														<div class="svg-area">
															<BetSvg :chip="chips" :status="tableInfo?.confirm_switch" ref="betSvgSuper" />
														</div>
													</div>
												</div>

												<div
													class="t-relative banker-border"
													:class="{ overlay: isOverlyBanker === 'b' }"
													@mousedown="handlerBanker('b')"
													@mouseup="handlerBanker('')"
													@touchstart="handlerBanker('b')"
													@touchend="handlerBanker('')"
													@click="addChipBanker"
												>
													<div class="playtype" :class="{ disable: isCanBet }">
														<div class="bet-item-s banker-color playtype-text t-flex-col">
															<div class="t-title">庄对</div>
															<span class="t-text-xs t-leading-3 t-subtitle"
																>1:{{ playExplain?.first_banker_pair?.ratio ?? 0 }}</span
															>
															<div class="play-bottom-text">
																{{ formatMoney(betListInfo?.banker_pair?.bet_amount) ?? 0 }} /
																{{ formatMoney(betListInfo?.banker_pair?.total_people) ?? 0 }}
															</div>
														</div>
														<div class="svg-area">
															<BetSvg :chip="chips" :status="tableInfo?.confirm_switch" ref="betBankerRef" />
														</div>
														<!---->
													</div>
												</div>
											</div>
											<div class="bet-block t-relative h-55">
												<div
													class="t-relative"
													:class="{ overlay: isOverlyP === 'P' }"
													@mousedown="handlerPlayer('p')"
													@mouseup="handlerPlayer('')"
													@touchstart="handlerPlayer('P')"
													@touchend="handlerPlayer('')"
													@click="addChipBigPlayer"
												>
													<div class="playtype" :class="{ disable: isCanBet }">
														<div class="play-type-text">
															<div class="t-title t-text-4xl">闲</div>
															<span class="t-subtitle t-text-base">1:{{ playExplain?.player_winner?.ratio ?? 0 }}</span>
															<div class="btn-bottom-title">
																{{ formatMoney(betListInfo?.player_winner?.bet_amount) ?? 0 }} /
																{{ formatMoney(betListInfo?.player_winner?.total_people) ?? 0 }}
															</div>
														</div>
														<div class="h-50-bottom">
															<BetSvg :chip="chips" :status="tableInfo?.confirm_switch" ref="betBottomPlayerRef" />
														</div>
														<!---->
													</div>
												</div>
												<div
													class="t-relative banker-winter"
													:class="{ overlay: isOverlyB === 'B' }"
													@mousedown="handlerBankers('B')"
													@mouseup="handlerBankers('')"
													@touchstart="handlerBankers('B')"
													@touchend="handlerBankers('')"
													@click="addChipBigBanker"
												>
													<div class="playtype" :class="{ disable: isCanBet }">
														<div class="play-type-text banker-color">
															<div class="t-title t-text-4xl">庄</div>
															<span class="t-subtitle t-text-base">1:{{ playExplain?.banker_winner?.ratio ?? 0 }}</span>
															<div class="btn-bottom-title">
																{{ formatMoney(betListInfo?.banker_winner?.bet_amount) ?? 0 }} /
																{{ formatMoney(betListInfo?.banker_winner?.total_people) ?? 0 }}
															</div>
														</div>
														<div class="h-50-bottom">
															<BetSvg :chip="chips" :status="tableInfo?.confirm_switch" ref="betBottomBankerRef" />
														</div>
													</div>
												</div>
												<div class="timer-area">
													<div
														class="timer-wrapper"
														style="width: 58px; height: 58px; border: 2px solid"
														:style="{ 'border-color': circleBorder }"
													>
														<div
															class="timer-inner normal-seconds"
															:style="timerShip > 0 ? setCircleColor() : null"
														></div>
														<div class="timer-text">
															<div class="t-flex t-justify-center t-w-full">
																<span class="text-num">{{ timerShip }}</span>
																<div class="text-sub">{{ betInformation }}</div>
															</div>
														</div>
													</div>
												</div>
											</div>
										</div>
									</div>
									<div class="button-group">
										<div class="control-bar">
											<el-button
												class="btn"
												:class="{ 'light-title': lightTitle }"
												:disabled="isOperate"
												@click="handlerCancelBets('cancel')"
												>撤单</el-button
											>
											<div class="t-chip-box">
												<SelectArrowChipRight @click="scrollEvent('left')" />
												<div class="t-chips" id="chip-box-area">
													<div class="head"></div>
													<div class="t-chips__chip" @click="selectBetCip(5)" :class="{ selected: isSelect === 5 }">
														<div class="lottie-animation">
															<LottieAnimation v-if="isSelect === 5" />
														</div>
														<div class="img-box">
															<div
																class="img portrait_chip_default_5"
																:style="{ 'background-image': `url(${setChipImage(imagePath)})` }"
															></div>
															<div class="bg-blur"></div>
														</div>
													</div>
													<div class="t-chips__chip" @click="selectBetCip(25)" :class="{ selected: isSelect === 25 }">
														<div class="lottie-animation">
															<LottieAnimation v-if="isSelect === 25" />
														</div>
														<div class="img-box">
															<div
																class="img portrait_chip_default_25"
																:style="{ 'background-image': `url(${setChipImage(imagePath)})` }"
															></div>
															<div class="bg-blur"></div>
														</div>
													</div>
													<div class="t-chips__chip" @click="selectBetCip(100)" :class="{ selected: isSelect === 100 }">
														<div class="lottie-animation">
															<LottieAnimation v-if="isSelect === 100" />
														</div>
														<div class="img-box">
															<div
																class="img portrait_chip_default_100"
																:style="{ 'background-image': `url(${setChipImage(imagePath)})` }"
															></div>
															<div class="bg-blur"></div>
														</div>
													</div>
													<div class="t-chips__chip" @click="selectBetCip(500)" :class="{ selected: isSelect === 500 }">
														<div class="lottie-animation">
															<LottieAnimation v-if="isSelect === 500" />
														</div>
														<div class="img-box">
															<div
																class="img portrait_chip_default_500"
																:style="{ 'background-image': `url(${setChipImage(imagePath)})` }"
															></div>
															<div class="bg-blur"></div>
														</div>
													</div>
													<div class="t-chips__chip" @click="selectBetCip(1000)" :class="{ selected: isSelect === 1000 }">
														<div class="lottie-animation">
															<LottieAnimation v-if="isSelect === 1000" />
														</div>
														<div class="img-box">
															<div
																class="img portrait_chip_default_1000"
																:style="{ 'background-image': `url(${setChipImage(imagePath)})` }"
															></div>
															<div class="bg-blur"></div>
														</div>
													</div>
													<div class="t-chips__chip" @click="selectBetCip(5000)" :class="{ selected: isSelect === 5000 }">
														<div class="lottie-animation">
															<LottieAnimation v-if="isSelect === 5000" />
														</div>
														<div class="img-box">
															<div
																class="img portrait_chip_default_5000"
																:style="{ 'background-image': `url(${setChipImage(imagePath)})` }"
															></div>
															<div class="bg-blur"></div>
														</div>
													</div>
													<div class="t-chips__chip" @click="selectBetCip(10000)" :class="{ selected: isSelect === 10000 }">
														<div class="lottie-animation">
															<LottieAnimation v-if="isSelect === 10000" />
														</div>
														<div class="img-box">
															<div
																class="img portrait_chip_default_10000"
																:style="{ 'background-image': `url(${setChipImage(imagePath)})` }"
															></div>
															<div class="bg-blur"></div>
														</div>
													</div>
													<div
														class="t-chips__chip"
														@click="selectBetCip(100000)"
														:class="{ selected: isSelect === 100000 }"
													>
														<div class="lottie-animation">
															<LottieAnimation v-if="isSelect === 100000" />
														</div>
														<div class="img-box">
															<div
																class="img portrait_chip_default_100000"
																:style="{ 'background-image': `url(${setChipImage(imagePath)})` }"
															></div>
															<div class="bg-blur"></div>
														</div>
													</div>
													<div
														class="t-chips__chip"
														@click="selectBetCip(500000)"
														:class="{ selected: isSelect === 500000 }"
													>
														<div class="lottie-animation">
															<LottieAnimation v-if="isSelect === 500000" />
														</div>
														<div class="img-box">
															<div
																class="img portrait_chip_default_500000"
																:style="{ 'background-image': `url(${setChipImage(imagePath)})` }"
															></div>
															<div class="bg-blur"></div>
														</div>
													</div>
													<div
														class="t-chips__chip t-mr-0"
														@click="selectBetCip(1000000)"
														:class="{ selected: isSelect === 1000000 }"
													>
														<div class="lottie-animation">
															<LottieAnimation v-if="isSelect === 1000000" />
														</div>
														<div class="img-box">
															<div
																class="img portrait_chip_default_1000000"
																:style="{ 'background-image': `url(${setChipImage(imagePath)})` }"
															></div>
															<div class="bg-blur"></div>
														</div>
													</div>
													<div class="tail"></div>
												</div>
												<SelectArrowChipLeft @click="scrollEvent('right')" />
											</div>
											<el-button
												class="btn t-btn--confirm"
												:class="{ 'light-title': tableInfo?.confirm_switch !== 1 }"
												:disabled="tableInfo?.confirm_switch !== 1"
											>
												<!-- 确定  -->
											</el-button>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div class="game-bottom" style="width: 100%; height: 235px">
					<div class="round-info">
						<div class="round-info-item dark-banker">
							<span class="t-pr-1" style="color: red">庄</span
							><span class="win-record" style="color: red">{{ winRecord?.banker }}</span>
						</div>
						<div class="round-info-item dark-player">
							<span class="t-pr-1">闲</span><span class="win-record">{{ winRecord?.player }}</span>
						</div>
						<div class="round-info-item dark-tie">
							<span class="t-pr-1">和</span><span class="win-record">{{ winRecord?.tie }}</span>
						</div>
						<div class="round-info-item dark-banker">
							<span class="t-pr-1" style="color: red">庄对</span
							><span class="win-record" style="color: red">{{ winRecord.banker_pair }}</span>
						</div>
						<div class="round-info-item dark-player">
							<span class="t-pr-1">闲对</span><span class="win-record">{{ winRecord?.player_pair }}</span>
						</div>

						<div class="round-info-item color-round">
							<span class="round t-pr-1">局</span><span class="win-record">{{ winRecord?.total }}</span>
						</div>
					</div>
					<div class="canvas-area">
						<div class="chart road scroll-body" id="chart_areas">
							<div class="status" style="display: none">Shuffling</div>
							<div class="chart-canvas room-logo-watermark royce" style="display: none"></div>
							<routeMaps
								ref="routeMapRef"
								:mapList="tableListInfo.mapList"
								:mapId="tableListInfo.table_code"
								:width="canvasArea.width"
								:height="canvasArea.height"
								class="route-maps-wrap"
							/>
							<!-- <TableRouteMap :width="canvasArea.width" :height="canvasArea.height" :mapList="tableListInfo.mapList" /> -->
						</div>
						<div class="t-section">
							<div class="line t-w-full"></div>
							<div class="table-button disabled">
								<span class="t-text-red-600"> Banker </span>
								<span
									class="icon banker-hollow"
									:style="{
										background: `url(${setWenImage(zhuangWenLu.daYanLu)}) 50% / contain no-repeat`,
									}"
								></span>
								<span
									class="icon banker-solid"
									:style="{
										background: `url(${setWenImage(zhuangWenLu.smallLu)}) 50% / contain no-repeat`,
									}"
								></span>
								<span
									class="icon banker-oblique"
									:style="{
										background: `url(${setWenImage(zhuangWenLu.smallQianLu)}) 50% / contain no-repeat`,
									}"
								></span>
							</div>
							<div class="line"></div>
							<div class="table-button disabled">
								<span class="t-text-blue-600"> Player </span>
								<span
									class="icon player-hollow"
									:style="{
										background: `url(${setWenImage(playerWenLu.daYanLu)}) 50% / contain no-repeat`,
									}"
								></span>
								<span
									class="icon player-solid"
									:style="{
										background: `url(${setWenImage(playerWenLu.smallLu)}) 50% / contain no-repeat`,
									}"
								></span>
								<span
									class="icon player-oblique"
									:style="{
										background: `url(${setWenImage(playerWenLu.smallQianLu)}) 50% / contain no-repeat`,
									}"
								></span>
							</div>
							<div class="line"></div>
							<div class="table-button" @click="(e) => chart(e, true)">
								<img src="@/assets/svg/fullScreen.svg" />
								<span class="t-text-black t-ml-0.5">全屏路单</span>
							</div>

							<div class="line t-w-3/4 t-mx-auto"></div>

							<div class="table-button" @click="showTip(true)">
								<img src="@/assets/svg/heart.svg" />
								<span class="t-text-black t-ml-0.5">打赏小费</span>
							</div>
							<div class="line t-w-3/4 t-mx-auto"></div>
							<div class="table-button" @click="showTable(false)">
								<img src="@/assets/svg/game.svg" />
								<span class="t-text-black t-ml-0.5">快速换桌</span>
							</div>
						</div>
					</div>
				</div>
			</div>
			<CanvasEnlarge
				v-if="isShowCanvasEnlarge"
				:data="bigRouteMap"
				:bankerInfo="zhuangWenLu"
				:playerInfo="playerWenLu"
				@close="closeCanvasEnlarge"
				@click="(e) => chart(e, false)"
			/>
		</div>

		<div class="channel-area" style="z-index: 1000" v-if="isShowChannel" @click="(e) => closeChannel(e, false)">
			<div class="channel-overlay" style=""></div>
			<div aria-expanded="true" role="dialog" aria-modal="true" tabindex="-1" class="channel-container">
				<div class="channel-content" @click="(e) => closeChannel(e, false)">
					<div class="base-dialog-content">
						<div class="base-dialog-title">Channel</div>
						<div class="video-channels">
							<div class="option" :class="{ selected: isChannel === 'ch1' }" @click="chooseChannel('ch1')">
								<img src="@/assets/table-view/channel1.png" class="t-w-6 t-h-6 t-mr-4" /><span class="language-label">CH 1</span>
							</div>
							<div class="option" :class="{ selected: isChannel === 'ch2' }" @click="chooseChannel('ch2')">
								<img src="@/assets/table-view/channel2.png" class="t-w-6 t-h-6 t-mr-4" /><span class="language-label">CH 2</span>
							</div>
							<div class="option" :class="{ selected: isChannel === 'ch3' }" @click="chooseChannel('ch3')">
								<img src="@/assets/table-view/channel3.png" class="t-w-6 t-h-6 t-mr-4" /><span class="language-label">CH 3</span>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>

		<Betting v-if="isBetting" />

		<transition name="slide-up-down" @before-enter="beforeEnter" @enter="enter" @leave="leave">
			<LotteryResults :player="playerInfo" :displayStatus="isDisplay" :banker="bankerInfo" v-if="isShowBetResult" />
		</transition>

		<MessageDialog :message="info" :isShow="isShowTipInfo" @close="closeTipInfo" />

		<NoticeArea v-if="isShowNotice" @close="showNotice" :data="playExplain" />

		<Settings :is-show="isShowSetting" @closeSet="closeSet" />

		<Drawer :is-show="drawer" @closeDrawer="closeDrawer" />

		<Tip :is-show="isShowTip" @close="showTip(false)" />

		<ChangeTable :is-show="isShowChangeTable" @closeChangeTable="showTable" />

		<NetWorkStatus v-if="isShowNetWorkStatus" @close="closeNetWork" />

		<TablePanel v-if="isShowTableInfo" @table-panel="tablePanel" :data="tablePanelInfo" :isShowPlayerMessage="true" />
	</div>
</template>
<script setup>
import { onMounted, ref, onBeforeMount, nextTick, provide, onBeforeUnmount, watch, computed, toRaw } from 'vue';
import Back from '@/components/svg/back.vue';
import ArrowDown from '@/components/svg/arrow-down.vue';
import SelectArrowChipRight from '@/components/svg/select-arrow-chip-right.vue';
import SelectArrowChipLeft from '@/components/svg/select-arrow-chip-left.vue';
import Settings from '@/components/settings/settings.vue';
import TablePanel from '@/components/table-panel/table-panel.vue';
import LottieAnimation from '@/components/svg/lottie-animation.vue';
import Drawer from '@/components/drawer/drawer.vue';
import NetWorkStatus from '@/components/network-status/network-status.vue';
import Dollar from '@/components/svg/dollar.vue';
import Tip from '@/components/tip/tip.vue';
import { useRouter } from 'vue-router';
import ChangeTable from '@/components/change-table/change-table.vue';
import NoticeArea from '@/components/notice-area/notice-area.vue';
import LotteryResults from '@/components/lottery-results/lottery-results.vue';
import { useStorage } from '@/hook/useStorage.js';
import BaccaratLivePlayer from '@/components/baccaratLivePlayer/baccaratLivePlayer.vue';
import { toBet, obtainCurrentDeskData, toCancelBet, obtainFullScreenData } from '@/api/home';
import MessageDialog from '@/components/message-dialog/message-dialog.vue';
import BetSvg from '@/components/bet-svg/bet-svg.vue';
import routeMaps from '@/components/routeMaps/index.vue';
import Betting from '@/components/betting/betting.vue';
import CanvasEnlarge from '@/components/canvas-enlarge/canvas-enlarge.vue';
import { useWsInfoStore, useUserStore, useUserInfoStore, useTableStore } from '@/store';
import { ElMessage } from 'element-plus';
import {
	initSocket,
	handlerCardType,
	handlerCardPosition,
	mapGenerator,
	processingChipDistribution,
	getTheLastOneOnTheRoadMap,
	setWenImage,
	setThousandsOfPoints,
	updateRouteMap,
	formatMoney,
	updateTableData,
	changeBootsTableData,
	hasValue,
	formatNumber,
} from '@/utils';
import eventBus from '@/hook/useMitt';
import Roadmap from '@/components/routeMaps/js/Roadmap';

const useTables = useTableStore();

const { getStorage } = useStorage();

const isSEITimeLock = ref(false);

// 设置 庄闲和对应的颜色
const colorRec = {
	Player: '#2033d9',
	Banker: '#d9202c',
	Tie: '#21d924',
};

const canvasArea = ref({
	width: 0,
	height: 0,
});

const enumInfoList = {
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
	pair: {
		1: '', // 没有对子
		2: 'Player', // 闲家对子
		3: 'Banker', //庄家对子
		4: 'Player,Banker', // 庄家闲家都是对子
	},
};

//大图数据
const bigRouteMap = ref({
	mapList: [],
	code: '',
});

const routeMapRef = ref();

const tableLivePlayerRef = ref();

const imagePath = ref('sprites_chips_default');

const circleBorder = ref('#A8A8A8');

const zhuangWenLu = ref({
	daYanLu: '',
	smallLu: '',
	smallQianLu: '',
});

const clearTime = ref();

const playerWenLu = ref({
	daYanLu: '',
	smallLu: '',
	smallQianLu: '',
});

const interval = ref();

const canvasMap = ref({
	width: 0,
	height: 0,
});

const tableInfo = ref(useTables.getTableInformation);

const scaleRateX = ref(0);

const scaleRateY = ref(128.5 / 324);

const currentChip = ref({});

const isShowSuper6 = ref(false);

const betInformation = ref('停止下注');
// 是否下注成功
const isSuccussBet = ref(false);

// 倒计时
const timerShip = ref(0);

const userStore = useUserStore();

const userUserInfo = useUserInfoStore();

const wsInfoStore = useWsInfoStore();

const isCanBet = ref(true);

const betListInfo = ref({});

const bankerInfo = ref({});

const playerInfo = ref({});

const isDisplay = ref({
	display: false,
	imageType: '',
});

const isBetting = ref(false);

const isShowTipInfo = ref(false);

const betSvgRef = ref();

const lightTitle = ref(false);

const info = ref('');

const betSvgHe = ref();

const betBankerRef = ref();

const betBottomPlayerRef = ref();

const betBottomBankerRef = ref();

const roomDetail = ref({
	round_id: '',
	code: '',
});

// 下注筹码
const chips = ref();

// 直播地址
const liveVideoUrl = ref(tableInfo.value?.pull_address);

const isShowBetResult = ref(false);

// 标志开奖
const isFlag = ref(false);

const isOverlyXian = ref();

const isOverlyHe = ref();

const isOverlyBanker = ref();

const isOverlySuper = ref();

const isOverlyP = ref();

const isOverlyB = ref();

const betSvgSuper = ref();

const isOperate = ref(false);

const isOverly = ref();

const drawer = ref(false);

const isSelect = ref(0);

const isChannel = ref('ch1');

const isShowTableInfo = ref(false);

const isShowNetWorkStatus = ref(false);

const isShowCanvasEnlarge = ref(false);

const isShowSetting = ref(false);

const isShowChangeTable = ref(false);

const isShowChannel = ref(false);

const isShowTip = ref(false);

// A 2 3 4 5 6 7 8 9 10 J Q K
const positionValue = ref([0, 40, 80, 120, 160, 200, 240, 280, 320, 360, 400, 440, 480]);

const router = useRouter();

const isShowNotice = ref(false);

const winRecord = ref({});

const tablePanelInfo = ref({});

// 房间信息
const tableListInfo = ref({
	mapList: tableInfo.value ? [...tableInfo.value.records] : [],
	table_code: tableInfo.value?.code,
});

const lotteryDrawTimer = ref(0);

const SEIReceivedMark = ref(false);

const tableHistory = ref({});

const userSeat = ref(0);

const playExplain = ref({});

// 桌台房间内的座位分配
const seatDefault = ref([5, 6, 3, 7, 2, 8]);

// 当前桌台用户信息
const tableUserInfoList = ref({});

const color = ref();

const betReadyMoney = ref();

// 记录开奖结果次数
let recordTheLotteryResults = ref(0);

// 桌台房间内的用户列表
const userList = ref([]);

const settings = () => (isShowSetting.value = true);

const closeSet = (v) => (isShowSetting.value = v);

let messageLog = null;

// const scaleRate = computed(() => {
// 	return {
// 		transform: `scale(${scaleRateX.value},${scaleRateY.value})`,
// 	};
// });

const setChipImage = (v) => {
	return new URL(`../../assets/table-view/${v}.png`, import.meta.url).href;
};

const closeChannel = (e, v) => {
	e.stopPropagation();
	isShowChannel.value = v;
};

const selectBetCip = (v) => {
	isSelect.value = v;
	chips.value = v;
	localStorage.setItem(tableInfo.value?.code, v)
};

const tablePanel = (v) => {
	isShowTableInfo.value = v;
};

const checkIsChoose = () => {
	const chip_value = window.localStorage.getItem('chip_value');
	!chip_value ? (drawer.value = true) : (drawer.value = false);
};

const setCircleColor = () => {
	return {
		'border-color': color.value,
		background: `conic-gradient(
			from 0deg at 50% 50%,
		    rgba(25, 87, 73, 0) 0deg,
		    rgba(30, 115, 96, 0) 271.87deg,
			${color.value} 1turn
			)`,
	};
};

const setStyle = () => {
	if (timerShip.value === 0) {
		circleBorder.value = '#A8A8A8';
	}
	if (0 < timerShip.value && timerShip.value <= 10) {
		circleBorder.value = 'red';
		color.value = 'red';
	}

	if (10 < timerShip.value && timerShip.value <= 20) {
		circleBorder.value = 'yellow';
		color.value = 'yellow';
	}
	if (20 < timerShip.value && timerShip.value <= 40) {
		circleBorder.value = '#228770';
		color.value = '#228770';
	}
};

onBeforeMount(() => {
	const token = localStorage.getItem('TOKEN');
	if (!token) {
		ElMessage.error({
			message: '身份凭证错误或不存在,请重新进入系统',
			offset: window.screen.height / 2,
		});
		router.push({
			name: 'full-screen',
		});
	}

	useTables.setIsShowDialogView(false);
	if (typeof wsInfoStore.send === 'function') {
		try {
			wsInfoStore.send(
				JSON.stringify({
					event: 'get_table_lobby',
					data: {
						code: tableInfo.value?.code,
					},
				})
			);
		} catch (error) {
			console.log(error, '重连');
		}
	}
});

const obtainFullScreenTravelData = async () => {
	try {
		const result = await obtainFullScreenData(tableInfo.value.code);
		if (result.success) {
			bigRouteMap.value.mapList = result.data.data;
			bigRouteMap.value.code = tableInfo.value.code;
		} else {
			bigRouteMap.value.mapList = [];
			bigRouteMap.value.code = '';
		}
	} catch (error) {}
};

const chart = (e, v) => {
	e.stopPropagation();
	isShowCanvasEnlarge.value = v;
	if (v) {
		// 获取全屏路途数据
		obtainFullScreenTravelData();
	}
};

const closeDrawer = (v) => (drawer.value = v);

const handlerNetWorkStatus = () => (isShowNetWorkStatus.value = !isShowNetWorkStatus.value);

const showNotice = (v) => (isShowNotice.value = v);

const closeNetWork = (v) => (isShowNetWorkStatus.value = v);

const showChannel = () => (isShowChannel.value = !isShowChannel.value);

const showTip = (v) => {
	isShowTip.value = v;
};

const showTable = (v) => {
	isShowChangeTable.value = v;
};

const closeCanvasEnlarge = (v) => (isShowCanvasEnlarge.value = v);

const setTablePanelInfo = () => {
	const { code, public_red_limit_rules, table_red_limit_rules, self_red_limit_rules } = tableInfo.value;
	if (tablePanelInfo.value.user_list) {
		tablePanelInfo.value = {
			user_list: [...tablePanelInfo.value.user_list],
			code,
			public_red_limit_rules,
			table_red_limit_rules,
			self_red_limit_rules,
		};
	}
};

const showTableDetail = (e) => {
	e.stopPropagation();
	isShowTableInfo.value = true;
	setTablePanelInfo();
};

const chooseChannel = (v) => {
	isChannel.value = v;
	isShowChannel.value = false;
};

const goBack = () => {
	useTables.setIsShowDialogView(true);
	router.go(-1);
};

const handlerXian = (v) => (isOverlyXian.value = v);

const closeTipInfo = () => (isShowTipInfo.value = false);

const beforeEnter = (el) => {
	el.style.transform = 'translateY(100%)';
};

const enter = (el, done) => {
	el.offsetHeight; // 触发重绘，使 transform 生效
	el.style.transition = 'transform 0.5s';
	el.style.transform = 'translateY(0)';
	done();
};

const leave = (el, done) => {
	el.style.transition = 'transform 0.5s';
	el.style.transform = 'translateY(100%)';
	clearTime.value = setTimeout(done, 500); // 确保动画结束后再执行done
};

let timer = ref();

const chooseChip = () => {
	ElMessage.warning({
		message: '请选择筹码',
		offset: window.screen.height / 2,
	});
};

// 等待SEI 进行开奖动画 未获取或超时使用ws的open_result
const waitSEIToDraw = (b, p, n) => {
	setTimeout(() => {
		lotteryDrawTimer.value = lotteryDrawTimer.value + 1;
		if (SEIReceivedMark.value) {
			// 开始等待SEI-等到了SEI-将Mark置为false-并打开动画
			SEIReceivedMark.value = false;
			return setLotteryResults(b, p, n);
		}
		// 开始等待SEI查看lotteryDrawTimer
		if (lotteryDrawTimer.value >= 4) {
			lotteryDrawTimer.value = 0;
			// 计数超过6-将计数置为0-并打开动画
			return setLotteryResults(b, p, n);
		}
		// 没有SEI和计时结束-继续
		waitSEIToDraw(b, p, n);
	}, 500);
};

const addChipXian = () => {
	if (!isCanBet.value) {
		if (chips.value) {
			// 检查是否有权限下注
			// 高亮按钮
			lightTitle.value = true;
			betSvgRef.value.handlerChip();
			if (tableInfo.value?.confirm_switch === 1) {
				const lastValue = betSvgRef.value.betChips[betSvgRef.value.betChips.length - 1];
				currentChip.value = {
					1: [], // 庄
					2: [], // 闲
					3: [], // 和
					4: [], // 庄对
					5: [lastValue], // 闲对
				};
				toBetting();
			}
		} else {
			chooseChip();
		}
	}
};

const addChipHe = () => {
	if (!isCanBet.value) {
		if (chips.value) {
			// 高亮按钮
			lightTitle.value = true;
			betSvgHe.value.handlerChip();
			if (tableInfo.value?.confirm_switch === 1) {
				const lastValue = betSvgHe.value.betChips[betSvgHe.value.betChips.length - 1];
				currentChip.value = {
					1: [], // 庄
					2: [], // 闲
					3: [lastValue], // 和
					4: [], // 庄对
					5: [], // 闲对
				};
				toBetting();
			}
		} else {
			chooseChip();
		}
	}
};

const addChipBanker = () => {
	if (!isCanBet.value) {
		if (chips.value) {
			// 高亮按钮
			lightTitle.value = true;
			betBankerRef.value.handlerChip();
			if (tableInfo.value?.confirm_switch === 1) {
				const lastValue = betBankerRef.value.betChips[betBankerRef.value.betChips.length - 1];
				currentChip.value = {
					1: [], // 庄
					2: [], // 闲
					3: [], // 和
					4: [lastValue], // 庄对
					5: [], // 闲对
				};
				toBetting();
			}
		} else {
			chooseChip();
		}
	}
};

const addChipSuper = () => {
	if (!isCanBet.value) {
		if (chips.value) {
			// 高亮按钮
			lightTitle.value = true;
			betSvgSuper.value.handlerChip();
			if (tableInfo.value?.confirm_switch === 1) {
				// const lastValue = betSvgSuper.value.betChips[betSvgSuper.value.betChips.length - 1];
				// currentChip.value = {
				// 	1: [], // 庄
				// 	2: [], // 闲
				// 	3: [], // 和
				// 	4: [lastValue], // 庄对
				// 	5: [], // 闲对
				// };
				// toBetting();
			}
		} else {
			chooseChip();
		}
	}
};

const addChipBigPlayer = () => {
	if (!isCanBet.value) {
		if (chips.value) {
			// 高亮按钮
			lightTitle.value = true;
			betBottomPlayerRef.value.handlerChip();
			if (tableInfo.value?.confirm_switch === 1) {
				const lastValue = betBottomPlayerRef.value.betChips[betBottomPlayerRef.value.betChips.length - 1];
				currentChip.value = {
					1: [], // 庄
					2: [lastValue], // 闲
					3: [], // 和
					4: [], // 庄对
					5: [], // 闲对
				};
				toBetting();
			}
		} else {
			chooseChip();
		}
	}
};

const addChipBigBanker = () => {
	if (!isCanBet.value) {
		if (chips.value) {
			// 高亮按钮
			lightTitle.value = true;
			betBottomBankerRef.value.handlerChip();
			if (tableInfo.value?.confirm_switch === 1) {
				const lastValue = betBottomBankerRef.value.betChips[betBottomBankerRef.value.betChips.length - 1];
				currentChip.value = {
					1: [lastValue], // 庄
					2: [], // 闲
					3: [], // 和
					4: [], // 庄对
					5: [], // 闲对
				};
				toBetting();
			}
		} else {
			chooseChip();
		}
	}
};

const handlerPlayer = (v) => (isOverlyP.value = v);

const handlerHe = (v) => (isOverlyHe.value = v);

const handlerBanker = (v) => (isOverlyBanker.value = v);

const handlerBankers = (v) => (isOverlyB.value = v);

const handlerSuper = (v) => (isOverlySuper.value = v);

const checkoutTimeStatus = () => {
	if (timerShip.value === 0) {
		betInformation.value = '停止下注';

		isCanBet.value = true;
		info.value = '停止下注';
		lightTitle.value = false;
	} else {
		betInformation.value = '请下注';
		isCanBet.value = false;
		lightTitle.value = true;
	}
};

const calculateMod10 = (arr) => {
	let total = 0;
	arr.forEach((item) => {
		const value = item.split('-').pop();
		if (value) {
			const subTim = Number(value);
			total += subTim;
		}
	});
	return total % 10;
};

const checkoutWhoWin = () => {
	isDisplay.value.display = true;
	if (bankerInfo.value.point > playerInfo.value.point) {
		// 庄赢
		isDisplay.value.imageType = 'win_3_en';
	} else if (bankerInfo.value.point < playerInfo.value.point) {
		// 闲赢
		isDisplay.value.imageType = 'win_4_cn';
	} else {
		// 平局，
		isDisplay.value.imageType = 'win_5_en';
	}
};

const handlerCard = (v, cardType) => {
	// ['1-J-10','1-8-8','4-7-7']
	const str = v.split('|');
	if (str.length > 0) {
		cardType['point'] = calculateMod10(str);
	}
	for (let i = 0; i < str.length; i++) {
		if (i === 0) {
			// 第一张牌
			cardType['secondCard'] = {
				type: handlerCardType(str[i]),
				position: handlerCardPosition(str[i], 'table-view'),
			};
		} else if (i === 1) {
			//第二张牌
			cardType['thirdCard'] = {
				type: handlerCardType(str[i]),
				position: handlerCardPosition(str[i], 'table-view'),
			};
		} else if (i === 2) {
			//第三张牌
			cardType['firstCard'] = {
				type: handlerCardType(str[i]),
				position: handlerCardPosition(str[i], 'table-view'),
			};
		}
	}
};

//处理开奖结果
const processLotteryResults = (data) => {
	const { banker, player } = data;
	handlerCard(banker, bankerInfo.value);
	handlerCard(player, playerInfo.value);
	checkoutWhoWin();
};

const checkoutRoundNumber = () => {
	if (recordTheLotteryResults.value === 2) {
		ElMessage.warning({
			message: '你已超过2局没下住',
			offset: window.screen.height / 2,
		});
		isShowBetResult.value = false;
	}
	if (recordTheLotteryResults.value === 4) {
		router.push({
			name: 'home',
			query: {
				status: '4',
			},
		});
		ElMessage.error({
			message: '你已超过4局没下住',
			offset: window.screen.height / 2,
		});
	}
};

const setLotteryResults = (b, p, n) => {
	const is_special = userUserInfo.getUserDetailInfo.is_special;

	if (b && p) {
		processLotteryResults({
			tableId: n,
			banker: b,
			player: p,
		});

		// 等于1 特殊账户不用退出
		if (is_special !== 1) {
			++recordTheLotteryResults.value;
			//处理几局不下注退出房间
			checkoutRoundNumber();
		}
		isShowBetResult.value = true;

		betResult.value = setTimeout(() => {
			isShowBetResult.value = false;
		}, 4000);
	}
};

const SEIDataCatch = (data) => {
	const { b, n, p, count, i, t } = data;

	if (b && p) {
		if (!tableHistory.value[n]) {
			tableHistory.value[n] = {
				...data,
				player: data.p,
				banker: data.b,
				bureau_number: data.n,
			};

			SEIReceivedMark.value = true;
			// 接收到SEI信息开奖之后的处理
			commonClearChip();
			// 确定桌台的状态
			return;
		}
	}
	if (count && i) {
		if (t) {
			isSEITimeLock.value = true;
			timerShip.value = t;
		}
		if (t === 0) {
			timerShip.value = 0;
			isSEITimeLock.value = false;
		}
	}
	checkoutTimeStatus();
	setStyle();
};

const handlerMouseUp = (v) => (isOverly.value = v);

// 重新开始倒计时的函数
const restartCountdown = () => {
	clearInterval(interval.value); // 清除之前的计时器
	checkForTimeout(); // 重新调用倒计时函数
};

const statistics = (param) => {
	let total = 0;
	for (let i in param) {
		for (let j in param[i]) {
			total += param[i][j] * Number(j);
		}
	}
	return total;
};

const checkIfTheBalanceIsGreaterThan = (param) => {
	const total = statistics(param);
	const balance = userUserInfo.getUserDetailInfo.money;
	let flag = true;
	if (total > balance) {
		ElMessage.error({
			message: '余额不足',
			offset: window.screen.height / 2,
		});
		flag = false;
		commonClearChip();
	}
	return flag;
};

const calculateBalance = (param) => {
	const total = statistics(param);
	const balance = userUserInfo.getUserDetailInfo.money;
	const value = balance - total;
	setBalance(value);
};

const confirmBet = () => {
	if (tableInfo.value.confirm_switch === 2) {
		toBetting();
	}
};

const handlerArg = (obj) => {
	const newObj = {};
	for (const key in obj) {
		if (obj.hasOwnProperty(key)) {
			const arr = obj[key];
			if (arr.length > 0) {
				newObj[key] = [arr[arr.length - 1]];
			}
		}
	}
	return newObj;
};

const singleChipClear = () => {
	for (let i in currentChip.value) {
		if (i === '1' && hasValue(toRaw(currentChip.value['1']))) {
			//庄
			const value = betBottomBankerRef.value.listChip.pop();
			betBottomBankerRef.value.total = betBottomBankerRef.value.total - value.label;
		} else if (i === '2' && hasValue(toRaw(currentChip.value['2']))) {
			const value = betBottomPlayerRef.value.listChip.pop();
			betBottomPlayerRef.value.total = betBottomPlayerRef.value.total - value.label;
		} else if (i === '3' && hasValue(toRaw(currentChip.value['3']))) {
			const value = betSvgHe.value.listChip.pop();
			betSvgHe.value.total = betSvgHe.value.total - value.label;
		} else if (i === '4' && hasValue(toRaw(currentChip.value['4']))) {
			const value = betBankerRef.value.listChip.pop();
			betBankerRef.value.total = betBankerRef.value.total - value.label;
		} else if (i === '5' && hasValue(toRaw(currentChip.value['5']))) {
			const value = betSvgRef.value.listChip.pop();
			betSvgRef.value.total = betSvgRef.value.total - value.label;
		}
	}
};

const recordCurrentChips = () => {
	const tableChip = useTables.getTableListChip;
	if (betBottomBankerRef.value.listChip.length > 0) {
		tableChip['1'] = betBottomBankerRef.value.listChip;
	}
	if (betBottomPlayerRef.value.listChip.length > 0) {
		tableChip['2'] = betBottomPlayerRef.value.listChip;
	}
	if (betSvgHe.value.listChip.length > 0) {
		tableChip['3'] = betSvgHe.value.listChip;
	}
	if (betBankerRef.value.listChip.length > 0) {
		tableChip['4'] = betBankerRef.value.listChip;
	}
	if (betSvgRef.value.listChip.length > 0) {
		tableChip['5'] = betSvgRef.value.listChip;
	}
	useTables.setTableListChip(tableChip);
};

const toBetting = async () => {
	if (timerShip.value > 0) {
		let chip_obj;
		if (!isCanBet.value && !isOperate.value) {
			if (tableInfo.value?.confirm_switch === 1) {
				chip_obj = currentChip.value;
				//备份筹码
			} else {
				chip_obj = {
					1: betBottomBankerRef.value.betChips,
					2: betBottomPlayerRef.value.betChips,
					3: betSvgHe.value.betChips,
					4: betBankerRef.value.betChips,
					5: betSvgRef.value.betChips,
				};
			}

			let param = {
				table_code: tableInfo.value.code, // 桌号
				round_id: roomDetail.value.round_id, // 局号
				seat: userSeat.value, // 座位号
				chips: processingChipDistribution(chip_obj), //筹码分布
			};
			if (!checkIfTheBalanceIsGreaterThan(chip_obj)) {
				return;
			}
			try {
				let result = await toBet(param);
				if (result.success) {
					// 下成功后重新计算局数
					recordTheLotteryResults.value = 0;
					//重新计时
					ElMessage.success({
						message: '投注成功',
						offset: window.screen.height / 2,
					});
					isSuccussBet.value = true;
					//备份筹码
					recordCurrentChips();
					// 如果是确定没开启得清一次
					calculateBalance(chip_obj);
					// 重新计时
					restartCountdown();
				} else {
					isSuccussBet.value = false;
					ElMessage.error({
						message: result.message,
						offset: window.screen.height / 2,
					});
					if (tableInfo.value.confirm_switch === 1) {
						singleChipClear();
					} else {
						commonClearChip();
					}
				}
			} catch (error) {}
		}
	}
};

const handlerCancelBets = () => {
	if (isSuccussBet.value) {
		//取消投注
		cancelBets();
	}
	resetDesktopInformation();
	isSelect.value = 0;
};

const resetDesktopInformation = () => {
	commonClearChip();
	lightTitle.value = false;
	isCanBet.value = true;
};

const commonClearChip = () => {
	betSvgHe.value.clearChip();
	betSvgRef.value.clearChip();
	betBankerRef.value.clearChip();
	betBottomPlayerRef.value.clearChip();
	betBottomBankerRef.value.clearChip();
};

// 检查用户盈亏
const checkUserIsWin = () => {
	const { code, round_id } = roomDetail.value;
	if (!code || !round_id) {
		// console.error('checkUserIsWin-字段值错误', { code, round_id });
		return;
	}
	wsInfoStore.send(
		JSON.stringify({
			event: 'search_win',
			data: {
				table_code: tableInfo.value?.code,
				number: roomDetail.value.round_id,
			},
		})
	);
};

const setBalance = (value) => {
	const userInfo = userUserInfo.getUserDetailInfo;
	const obj = {
		...userInfo,
		money: value,
	};
	userUserInfo.setUserDetailInfo(obj);
};

watch(
	() => wsInfoStore.msgList.search_win,
	(newVal, oldVal) => {
		// 获取到盈亏数据更新到 用户信息 结构: {win: 0, money: '80100.00'}
		if (newVal && newVal.money) {
			setBalance(newVal.money);
		}
	}
);

// ws 重连
watch(
	() => wsInfoStore.status,
	(val) => {
		const useDetail = userUserInfo.getUserDetailInfo;
		if (val === 'OPEN') {
			if (useDetail.user_nick && tableInfo.value?.code && userSeat.value) {
				wsInfoStore.send(
					JSON.stringify({
						event: 'join_table',
						data: {
							table_code: tableInfo.value?.code,
							nick_name: useDetail.user_nick,
							seat: userSeat.value, // 计算 座位
						},
					})
				);
			}
		}
	}
);

// ws 搜索下注信息
watch(
	() => wsInfoStore.msgList.search_bet,
	(newVal, oldVal) => {
		// console.log('ws-search_bet', newVal);
	}
);

// ws 实时桌台数据
watch(
	() => wsInfoStore.msgList.inside_table_info,
	(v) => {
		// 在桌台房间内收到的消息  2s一次
		const { number, table_id, bet_total, betMoney, winner, count_people, table_total, total_money, total_people, user_list } = v;
		// winner 当前下注信息

		betReadyMoney.value = betMoney;
		if (winner) {
			betListInfo.value = winner;
		}
		if (table_id === tableInfo.value.code) {
			if (number) {
				roomDetail.value.round_id = number;
			}
		}

		tablePanelInfo.value.user_list = user_list;
		winRecord.value = table_total;
		userList.value = user_list;
	}
);

// // ws
// watch(
// 	() => wsInfoStore.msgList.join_table,
// 	(newVal, oldVal) => {
// 		console.log('event-join_table', newVal);
// 	}
// );

// watch(
// 	() => wsInfoStore.msgList.table_info,
// 	(newVal, oldVal) => {
// 		const { table_id, total_money, total_people, winner } = newVal;
// 		// console.log('event-table_info事件', newVal);
// 	}
// );

// watch(
// 	() => wsInfoStore.msgList.search_table_user,
// 	(newVal, oldVal) => {
// 		console.log('event-查找用户信息', newVal);
// 	}
// );

const tableOtherUserBetChips = ref();
// ws-面向所有玩家推送的下注信息
watch(
	() => wsInfoStore.msgList.site_bet,
	(newVal, oldVal) => {
		const { bet } = newVal; //  Array
		tableOtherUserBetChips.value = bet;
	}
);

// ws-开奖结果（与SEI相对应）
watch(
	() => wsInfoStore.msgList.open_result,
	(newVal, oldVal) => {
		const { history, new_number, table_id, total, banker, player } = newVal;
		let tableList = useTables.getTableList;

		// console.log(table_id, 'new_number_table_id');
		isFlag.value = true;
		if (table_id === tableInfo.value.code) {
			if (new_number) {
				// 开奖更新局号
				roomDetail.value.round_id = new_number;
			}
			let b = banker;
			let p = player;
			let n = new_number;
			waitSEIToDraw(b, p, n);
	
			updateTheRoute(history);
	
			const newList = updateTableData(tableList, history, table_id);
	
			useTables.setTableList(newList);
			// 获得到开奖事件后 发送事件获取当前用户的盈亏
			checkUserIsWin();
			// 开奖清空桌面
			commonClearChip();
			// 清除保留筹码
			useTables.setTableListChip({})
			setAskBankerAndPlayer();
		}
	}
);

// 倒计时 sei没有收到倒计时，使用ws的倒计时
watch(
	() => wsInfoStore.msgList.open_timer,
	(v) => {
		if (!isSEITimeLock.value) {
			if (isFlag.value) {
				timerShip.value = Number(v.time);
				checkoutTimeStatus();
				setStyle();
				isSEITimeLock.value = false;
			}

			if (isFlag.value && v.time === 0) {
				betInformation.value = '停止下注';
				isCanBet.value = true;
				info.value = '停止下注';
				lightTitle.value = false;
				isFlag.value = false;
			}
		}
	}
);

const clearWenLu = () => {
	zhuangWenLu.value.daYanLu = '';
	zhuangWenLu.value.smallLu = '';
	zhuangWenLu.value.smallQianLu = '';

	playerWenLu.value.daYanLu = '';
	playerWenLu.value.smallLu = '';
	playerWenLu.value.smallQianLu = '';
};

const updateCurrentData = async () => {
	try {
		const result = await obtainCurrentDeskData(tableInfo.value?.code);
		if (result.success) {
			if (result?.data) {
				// 更新当前路途
				tableListInfo.value.mapList = result.data?.records;
				// 更新大厅数据
				let tableList = useTables.getTableList;
				tableList = tableList.map((item) => {
					if (item.code === table_code) {
						return result.data;
					}
					return item;
				});

				useTables.setTableList(tableList);
			}
		}
	} catch (error) {}
};

// 牌组换靴 => 洗牌中
// 换靴时：清空路图，停止下注，
watch(
	() => wsInfoStore.msgList.event_change_round,
	(newVal) => {
		const { change_round, table_code, handler_change_shoe } = newVal;
		if (handler_change_shoe) {
			// 手动换靴 更新当前路途 和大厅数据
			updateCurrentData(table_code);
		} else {
			// 对应大厅列表要清空
			changeBootsTableData(table_code);
			tableListInfo.value.mapList = [];
			//清空问路
			clearWenLu();
			if (change_round) {
				wsInfoStore.send(
					JSON.stringify({
						event: 'get_table_lobby',
						data: {
							code: tableInfo.value?.code,
						},
					})
				);
			}
		}
	}
);

// 开奖之后 根据 open_result 中的数据更新路图
const updateTheRoute = (oldValue) => {
	// 更新之前过滤一下
	let array = [];
	oldValue.forEach((element) => {
		if (element.table_code === tableListInfo.value.table_code) {
			array.push(element);
		}
	});

	tableListInfo.value.mapList = updateRouteMap(tableListInfo.value.mapList, array);

	routeMapRef.value && routeMapRef.value.init(tableListInfo.value.mapList);

	bigRouteMap.value.mapList = updateRouteMap(bigRouteMap.value.mapList, array);
};

// 分配 和 设置用户座位
const userSeatSet = (seat) => {
	// 当数组为空时，返回1  参数为1时，直接返回1
	if (seatDefault.value.length === 0 || seat === 1) {
		return 1;
	}
	// 查找值在数组中的索引
	const index = seatDefault.value.indexOf(seat);
	if (index !== -1) {
		seatDefault.value.splice(index, 1);
		return seat;
	}
	const default_seat = seatDefault.value.shift();
	return default_seat;
};

// 当前桌台的用户列表处理 （处理座位 和 分配座位
const tableUserInfoProcess = (userList, have_seat) => {
	const useDetail = userUserInfo.getUserDetailInfo;

	if (Array.isArray(userList) && userList.length) {
		let hadOneSeat = false;
		for (let i in userList) {
			const { money, user_nick, seat } = userList[i];
			const isOwner = user_nick === useDetail.user_nick;
			if (isOwner) {
				userSeat.value = userSeatSet(seat);
				hadOneSeat = true;
				tableUserInfoList.value = {
					...tableUserInfoList.value,
					[userSeat.value]: {
						user_nick: user_nick,
						money,
						isOwner: isOwner,
						chips: {},
					},
				};
			} else {
				tableUserInfoList.value = {
					...tableUserInfoList.value,
					[userSeatSet(seat)]: {
						user_nick: useDetail.user_nick,
						money,
						isOwner: isOwner,
						chips: {},
					},
				};
			}
		}
		if (!hadOneSeat) {
			if (have_seat === 0) {
				// 不需要分配数字座位
				userSeat.value = userSeatSet(1);
			} else {
				userSeat.value = userSeatSet();
			}
			if (userStore.$state.user_nick) {
				tableUserInfoList.value = {
					...tableUserInfoList.value,
					[userSeatSet(userSeat.value)]: {
						user_nick: useDetail.user_nick,
						money: useDetail.money,
						isOwner: true,
						chips: {},
					},
				};
			}
		}
		// console.log('不是第一个进入桌台的用户', tableUserInfoList.value);
	} else {
		// 当前用户为进入桌台的第一个用户
		if (have_seat === 0) {
			// 不需要分配数字座位
			userSeat.value = userSeatSet(1);
		} else {
			userSeat.value = userSeatSet();
		}
		if (userStore.$state.user_nick) {
			tableUserInfoList.value = {
				...tableUserInfoList.value,
				[userSeat.value]: {
					user_nick: useDetail.user_nick,
					isOwner: true,
					chips: {},
				},
			};
		}
	}
};

// 处理桌台下注信息，不分配用户座位
function tableBetInfoProcess(bet) {
	const useDetail = userUserInfo.getUserDetailInfo;
	// 处理下注信息之前 所有用户包括当前用户都已经获得一个 座位，
	console.log('处理下注信息之前的所有用户的座位信息', tableUserInfoList.value);
	return new Promise((resolve, reject) => {
		try {
			const { normal, sideBet } = bet; // normal => 非旁座玩家的下注信息， sideBet => 旁座的下注总金额
			if (normal && normal.length) {
				for (let i in normal) {
					const user_bet_data = normal[i];
					const play_style_keys = Object.keys(user_bet_data);
					const user_chips = {};
					let u_data = {
						u_seat: 1,
						unique: '',
						user_nick: '',
						isOwner: false,
					};
					// 下注数据结构 需要修改
					for (let k in play_style_keys) {
						const { user_nick, seat, unique } = user_bet_data[play_style_keys[k]];
						// 普通位置的下注数据
						const seat_num = Object.keys(seat)[0];
						const chip = seat[seat_num];
						user_chips[play_style_keys[k]] = chip;
						u_data.u_seat = seat_num;
						u_data.unique = unique;
						u_data.isOwner = user_nick === useDetail.user_nick;
						u_data.user_nick = user_nick;
					}
					// 判断是否需要另外分配座位
					const isUserInList = tableUserInfoList.value[u_data.u_seat] && Object.keys(tableUserInfoList.value[u_data.u_seat]).length !== 0;
					if (isUserInList) {
						tableUserInfoList.value = {
							...tableUserInfoList.value,
							[u_data.u_seat]: {
								user_nick: u_data.user_nick,
								chips: user_chips,
								unique: u_data.unique,
							},
						};
					} else {
						tableUserInfoList.value = {
							...tableUserInfoList.value,
							[userSeatSet(u_data.u_seat)]: {
								user_nick: u_data.user_nick,
								chips: user_chips,
								unique: u_data.unique,
							},
						};
					}
				}
			}
			tableUserInfoList.value = {
				...tableUserInfoList.value,
				sideBet: sideBet || {},
			};
			resolve(tableUserInfoList.value);
		} catch (error) {
			reject(error);
		}
	});
}

provide('SEIDataReport', SEIDataCatch);

const betResult = ref();

watch(
	() => useTables.getImagePath,
	(v) => {
		imagePath.value = v;
	},
	{
		immediate: true,
		deep: true,
	}
);

const changeCanvasSize = () => {
	// const canvasContainerWrapList = document.getElementsByClassName('chart');
	// const canvasEleList = document.getElementsByClassName('canvas-area');
	// const width = (canvasEleList[0].clientWidth / 4) * 3;
	// const rate = width / 864;
	// scaleRateX.value = rate;
	// if (canvasContainerWrapList && canvasContainerWrapList[0]) {
	// 	for (let i in canvasContainerWrapList) {
	// 		if (canvasContainerWrapList[i] && canvasContainerWrapList[i] instanceof Element) {
	// 			canvasContainerWrapList[i].style.height = canvasEleList[0].clientHeight;
	// 			canvasContainerWrapList[i].style.width = `${rate * 864}px`;
	// 		}
	// 	}
	// }
	const chart = document.getElementById('chart_areas');
	const canvasWrap = document.getElementsByClassName("canvas-area")[0]
	if (chart && canvasWrap) {
		if(canvasWrap.clientWidth>694) { // 594+100
			canvasArea.value.height = chart.offsetHeight;
			canvasArea.value.width = chart.offsetHeight * 2.7;
		} else {
			canvasArea.value.width = canvasWrap.clientWidth - 100
			canvasArea.value.height = canvasArea.value.width / 2.7
			canvasWrap.style.height = `${canvasArea.value.height}px`
		}
	}
};

const scrollEvent = (v) => {
	const box = document.getElementById('chip-box-area');
	if (v === 'left') {
		box.scrollLeft -= 40;
	} else if (v === 'right') {
		box.scrollLeft += 40;
	}
};

const checkForTimeout = () => {
	const is_special = userUserInfo.getUserDetailInfo.is_special; // 当 等于 1 不用 计时 不用退出
	if (is_special !== 1) {
		// 获取当前时间
		let now = new Date().getTime();

		// 计算四分钟后的时间
		let fourMinutesLater = now + 4 * 60 * 1000;

		// 更新页面的函数
		const updateCountdown = () => {
			let currentTime = new Date().getTime();
			let timeDifference = fourMinutesLater - currentTime;

			// // 计算分钟和秒数
			// let minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
			// let seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);

			// 输出到页面上

			// 如果时间到，停止倒计时
			if (-1000 <= timeDifference <= 0) {
				// 超过4分钟没有投注,退出房间
				ElMessage.warning({
					message: '超过4分钟没有投注,退出房间',
					offset: window.screen.height / 2,
				});
			}
			if (timeDifference <= -1500) {
				clearInterval(interval.value);
				router.push({
					name: 'home',
					query: {
						status: '5',
					},
				});
			}
		};

		// 每秒更新一次倒计时
		interval.value = setInterval(updateCountdown, 1000);
	}
};

// // 设置庄问路
// const setBanker = (bankerWin) => {
// 	const bankerLastData = setPossibleLotteryResult(tableListInfo.value.mapList, bankerWin);
// 	const bankerResult = mapGenerator(bankerLastData);
// 	determineWhichColorToDisplay(bankerResult, zhuangWenLu.value);
// };

// // 设置闲问路
// const setPlayer = (playerWin) => {
// 	const playerLastData = setPossibleLotteryResult(tableListInfo.value.mapList, playerWin);
// 	const playerResult = mapGenerator(playerLastData);
// 	determineWhichColorToDisplay(playerResult, playerWenLu.value);
// };

const cancelBets = async () => {
	const obj = {
		round_id: roomDetail.value.round_id,
	};
	try {
		const result = await toCancelBet(obj);
		if (result.success) {
			ElMessage.success({
				message: '取消投注成功',
				offset: window.screen.height / 2,
			});

			if (result?.data?.amount) {
				setBalance(result?.data?.amount);
			}
		} else {
			ElMessage.warning({
				message: '取消投注失败',
				offset: window.screen.height / 2,
			});
		}
	} catch (error) {}
};

// const setAskMap = () => {
// 	const bankerWin = simulatedData(roomDetail.value.round_id, 'banker');
// 	const playerWin = simulatedData(roomDetail.value.round_id, 'player');

// 	// 处理Banker 问路
// 	setBanker(bankerWin);

// 	// 处理Player 问路
// 	setPlayer(playerWin);
// };

const isBankerWin = () => {
	let newList = translatePossibleResultList({
		table_id: '',
		round_id: roomDetail.value.round_id,
		original_data: `{\"table_id\":\"RY11\",\"winner\":\"Banker win\",\"winner_mark\":3,\"type\":\"G\",\"winner_seq\":\"6\",\"winner_pair\":\"No pair\",\"winner_pair_mark\":1,\"winner_result\":0,\"accept_micro\":\"720341\",\"poker_message_type\":\"poker_result\",\"player_pointer\":4,\"banker_pointer\":0,\"bureau_number\":\"${roomDetail.value.round_id}\"}`,
	});
	const bannerWinRoadMapResults = new Roadmap({
		results: newList,
	});
	bannerWinRoadMapResults.update();
	const threeRoadData = getRouteAttr(bannerWinRoadMapResults);
	return threeRoadData;
};

const isPlayerWin = () => {
	let newList = translatePossibleResultList({
		table_id: '',
		round_id: roomDetail.value.round_id,
		original_data: `{\"table_id\":\"RY11\",\"winner\":\"Player win\",\"winner_mark\":1,\"type\":\"G\",\"winner_seq\":\"3\",\"winner_pair\":\"No pair\",\"winner_pair_mark\":3,\"winner_result\":0,\"accept_micro\":\"456201\",\"poker_message_type\":\"poker_result\",\"player_pointer\":6,\"banker_pointer\":6,\"bureau_number\":\"${roomDetail.value.round_id}\"}`,
	});
	const playerWinRoadMapResults = new Roadmap({
		results: newList,
	});
	playerWinRoadMapResults.update();
	const threeRoadData = getRouteAttr(playerWinRoadMapResults);
	return threeRoadData;
};

const setBankers = () => {
	const { bigeyeItemData, cockroachPigItemData, smallroadItemData } = isBankerWin();
	if (bigeyeItemData && bigeyeItemData?.eyeColor === 'blue') {
		zhuangWenLu.value.daYanLu = 'icon_road_player_hollow';
	} else if (bigeyeItemData && bigeyeItemData?.eyeColor === 'red') {
		zhuangWenLu.value.daYanLu = 'icon_road_banker_hollow';
	}

	if (smallroadItemData && smallroadItemData?.smallRoadColor === 'blue') {
		zhuangWenLu.value.smallLu = 'icon_road_player_solid';
	} else if (smallroadItemData && smallroadItemData?.smallRoadColor === 'red') {
		zhuangWenLu.value.smallLu = 'icon_road_banker_solid';
	}

	if (cockroachPigItemData && cockroachPigItemData?.cockroachColor === 'blue') {
		zhuangWenLu.value.smallQianLu = 'icon_road_player_oblique';
	} else if (cockroachPigItemData && cockroachPigItemData?.cockroachColor === 'red') {
		zhuangWenLu.value.smallQianLu = 'icon_road_banker_oblique';
	}
};

const setPlayers = () => {
	const { bigeyeItemData, cockroachPigItemData, smallroadItemData } = isPlayerWin();

	if (bigeyeItemData && bigeyeItemData?.eyeColor === 'blue') {
		playerWenLu.value.daYanLu = 'icon_road_player_hollow';
	} else if (bigeyeItemData && bigeyeItemData?.eyeColor === 'red') {
		playerWenLu.value.daYanLu = 'icon_road_banker_hollow';
	}

	if (smallroadItemData && smallroadItemData?.smallRoadColor === 'blue') {
		playerWenLu.value.smallLu = 'icon_road_player_solid';
	} else if (smallroadItemData && smallroadItemData?.smallRoadColor === 'red') {
		playerWenLu.value.smallLu = 'icon_road_banker_solid';
	}

	if (cockroachPigItemData && cockroachPigItemData?.cockroachColor === 'blue') {
		playerWenLu.value.smallQianLu = 'icon_road_player_oblique';
	} else if (cockroachPigItemData && cockroachPigItemData?.cockroachColor === 'red') {
		playerWenLu.value.smallQianLu = 'icon_road_banker_oblique';
	}
};

const setAskBankerAndPlayer = () => {
	setBankers();
	setPlayers();
};

const translatePossibleResultList = (possible_data) => {
	let arr = new Array();
	const list = toRaw(tableListInfo.value.mapList);

	const preMapList = JSON.parse(JSON.stringify(list));
	preMapList.push(possible_data);
	for (let i in preMapList) {
		const original_data = JSON.parse(preMapList[i].original_data);
		const winnerEnumInfo = enumInfoList.winner[original_data.winner_mark];
		const isPairEnumInfo = enumInfoList.pair[original_data.winner_pair_mark];
		arr.push({
			...original_data,
			winner: winnerEnumInfo.name,
			isPair: isPairEnumInfo,
			color: colorRec[winnerEnumInfo.name],
			text: winnerEnumInfo.text,
		});
	}
	return arr;
};

// 从roadmap中取 下三路的图 并取最后一个有值的项
const getRouteAttr = (route_map) => {
	const routeArr = {
		bigeyeItemData: {},
		smallroadItemData: {},
		cockroachPigItemData: {},
	};
	const { bigeyeboy, smallroad, cockroachPig } = route_map;
	routeArr.bigeyeItemData = findLastValueInLastNonEmptyColumn(bigeyeboy.matrix);
	routeArr.smallroadItemData = findLastValueInLastNonEmptyColumn(smallroad.matrix);
	routeArr.cockroachPigItemData = findLastValueInLastNonEmptyColumn(cockroachPig.matrix);
	return routeArr;
};

// 从结果矩阵中的下三路结果中 取最新更新的值
const findLastValueInLastNonEmptyColumn = (matrix) => {
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

watch(
	() => useTables.getTableInformation,
	(v) => {
		tableInfo.value = useTables.getTableInformation;
	},
	{
		immediate: true,
		deep: true,
	}
);


const sumLabels = (array) => array.reduce((acc, curr) => acc + curr.label, 0);

const checkIfTheBetWasSuccessful = () => {
	const tableChip = useTables.getTableListChip;
	if (tableChip['1'] && tableChip['1'].length > 0) {
		betBottomBankerRef.value.total = sumLabels(tableChip['1']);
		betBottomBankerRef.value.listChip = tableChip['1'];
	}
	if (tableChip['2'] && tableChip['2'].length > 0) {
		betBottomPlayerRef.value.total = sumLabels(tableChip['2']);
		betBottomPlayerRef.value.listChip = tableChip['2'];
	}
	if (tableChip['3'] && tableChip['3'].length > 0) {
		betSvgHe.value.total = sumLabels(tableChip['3']);
		betSvgHe.value.listChip = tableChip['3'];
	}
	if (tableChip['4'] && tableChip['4'].length > 0) {
		betBankerRef.value.total = sumLabels(tableChip['4']);
		betBankerRef.value.listChip = tableChip['4'];
	}
	if (tableChip['5'] && tableChip['5'].length > 0) {
		betSvgRef.value.total = sumLabels(tableChip['5']);
		betSvgRef.value.listChip = tableChip['5'];
	}
	
};

onMounted(async () => {
	checkIsChoose();
	//进入房间是否超时
	checkForTimeout();
	nextTick(() => {
		changeCanvasSize();
	});

	// 如果投注成功的话还原桌面上筹码
	checkIfTheBetWasSuccessful();

	window.addEventListener('resize', changeCanvasSize);
	// 初始化问路 备用 不要删
	// setAskMap();
	routeMapRef.value && routeMapRef.value.init(tableListInfo.value.mapList);
	// 继续沿用旧版
	setAskBankerAndPlayer();
	eventBus.on('close-drawer', (v) => {
		isShowChangeTable.value = false;
		tableInfo.value = useTables.getTableInformation;

		tableListInfo.value.mapList = tableInfo.value.records;
		tableListInfo.value.table_code = tableInfo.value.code;
	});

	const money = localStorage.getItem(tableInfo.value?.code)

	if (money) {
		selectBetCip(Number(money))
	}
});

const cleanTableInfo = () => {
	if (typeof wsInfoStore.send === 'function') {
		wsInfoStore.send(
			JSON.stringify({
				event: 'leave_table',
				data: {
					table_code: tableInfo.value?.code,
				},
			})
		);
	}
};

watch(
	() => wsInfoStore.tableLobbyInfos,
	async (newVal, oldVal) => {
		const useDetail = userUserInfo.getUserDetailInfo;

		// 页面初始化所有信息 init

		console.log('event-页面初始化', newVal);
		if (!newVal || !newVal.table) {
			console.log('桌面信息没有内容');
			return;
		}
		const { table, winner, userInfo, bet_total, play_explain, bet, history, open_timer, have_seat } = newVal;

		betListInfo.value = winner;

		winRecord.value = winner;
		// 数据获取完全后显示
		// 底部-桌台-历史胜负信息
		// userInfo 桌台用户信息-列表 : { userList, money }
		userList.value = userInfo.userList;
		// history 桌台历史记录 开奖记录-路图
		if (history.length > 0) {
			tableListInfo.value.table_code = table.table_code;
		}
		if (play_explain) {
			playExplain.value = play_explain;
		}

		// table 当前桌台局号和桌台code
		roomDetail.value = {
			code: table.table_code,
			round_id: table.round_id,
		};
		// 分配座位 have_seat 1=> 可以分配
		// have_seat === 0时的2种情况：a. 其他桌有座位，b. 这个桌已有座位  直接分配旁座

		// 优先根据 userList 中的用户列表处理用户信息
		tableUserInfoProcess(userInfo.userList, have_seat);

		// 当前桌台下注信息（不处理座位信息
		if (bet && Object.keys(bet).length === 2) await tableBetInfoProcess(bet);
		// 处理完 下注信息之后 发送 join_table

		wsInfoStore.send(
			JSON.stringify({
				event: 'join_table',
				data: {
					table_code: tableInfo.value?.code,
					nick_name: useDetail.user_nick,
					seat: userSeat.value, // 计算 座位
				},
			})
		);

		messageLog = ElMessage.success({
			message: `当前座位: ${userSeat.value}`,
			offset: window.screen.height / 2,
		});
	}
);

onBeforeUnmount(() => {
	cleanTableInfo();
	clearInterval(interval.value);
	clearTimeout(betResult.value);
	clearTimeout(clearTime.value);
	messageLog?.close?.();
	// 销毁播放器
	if (tableLivePlayerRef.value) {
		tableLivePlayerRef.value?.destoryPlayer?.();
	}
});
</script>

<style scoped lang="less">
@import url('./TableView.less');

.slide-up-down-enter-active,
.slide-up-down-leave-active {
	transition: transform 0.5s;
}

.slide-up-down-enter,
.slide-up-down-leave-to {
	transform: translateY(0);
}

.slide-up-down-leave,
.slide-up-down-enter-to {
	transform: translateY(100%);
}

.canvas-area {
	height: 220px;
	#chart_areas {
		flex: 0;
		height: 100%;
		.route-map {
			height: 100%;
		}
	}
	.t-section {
		min-width: 100px;
		height: 100%;
		// height: calc(100% - 15px);
	}
}

</style>

@/utils/_websocket.js

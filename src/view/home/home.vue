<template>
	<div class="application" style="--h-unit: 6.013333129882812px">
		<div tabindex="-1" class="v-dialog__content" style="z-index: 0">
			<div class="v-dialog rotate-full-width v-dialog--fullscreen" style="display: none">
				<div class="rotate v-card v-sheet theme--dark">
					<div class="v-card__text">
						<div class="lobby-header">
							<div class="logo ma-auto"></div>
						</div>
						<div class="rotate-img ma-auto t-mt-2"></div>
						<div class="text-xs-center ma-auto mt-4">
							Please turn to portrait mode <br />
							to play
						</div>
					</div>
				</div>
			</div>
		</div>
		<div tabindex="-1" class="v-dialog__content" style="z-index: 0">
			<div class="v-dialog app-scale v-dialog--persistent" style="display: none">
				<div class="toast-wrapper"></div>
			</div>
		</div>
		<div class="application--wrap">
			<div class="scroll-fullscreen t-invisible t-pointer-events-none t-hidden android">
				<br /><br /><br /><br /><br />
				Click to view in fullscreen
			</div>
			<div class="app-content hide-scrollbar t-fixed">
				<div class="t-page t-z-20">
					<Header @showNetStatus="showNetStatus" @showSettings="showSettings" />
					<div class="game-header" style="display: none">
						<svg class="t-w-5 t-h-5">
							<use xlink:href="#arrow_left"></use>
						</svg>
						<span class="t-text-gold-500">换桌</span>
						<svg class="t-w-5 t-h-5">
							<use xlink:href="#filter"></use>
						</svg>
					</div>
					<div class="t-tables hide-scrollbar t-pt-2 t-overflow-y-auto cols-2" id="table-list-scroll">
						<template v-for="tableItem in tableList" :key="tableItem.id">
							<Table v-bind="tableItem" />
						</template>
					</div>
					<GoToTop v-if="isShowToTop" @click="goToTop" />
				</div>
			</div>
		</div>

		<MessageDialog :message="info" :isShow="isShowTipInfo" @close="closeTipInfo" />

		<!-- 欢迎页 -->

		<div class="welcome-fixed" style="z-index: 1010" v-if="isShoWWelcome">
			<div class="welcome_overlay"></div>
			<div class="welcome_container" @click="(e) => showWelcome(e, false)">
				<div class="welcome_content" @click="(e) => showWelcome(e, true)">
					<div class="welcome-section">
						<div class="welcome-title">
							<span>欢迎回来</span>
						</div>
						<div class="t-mt-4 back-colors">
							欢迎 <span>{{ getUserDetailInfo.user_nick }}</span> 进入实地赌场
						</div>
						<div class="start-button" @click="(e) => showWelcome(e, false)">开始游戏</div>
					</div>
				</div>
			</div>
		</div>

		<NickName v-if="isShowNickName" @close="closeNickName" />

		<NetWorkStatus v-if="isShowNetWorkStatus" @close="showNetStatus" />
		<Settings :is-show="isShowSetting" @closeSet="showSettings" />
	</div>
</template>
<script setup>
import { onMounted, ref, onUnmounted, watch, onBeforeMount } from 'vue';
import Table from '@/components/table/table.vue';
import NetWorkStatus from '@/components/network-status/network-status.vue';
import Header from '@/components/header/header.vue';
import Settings from '@/components/settings/settings.vue';
import { useTableStore, useWsInfoStore, useUserInfoStore } from '@/store';
import { updateTableData, getTableList, handlerSingleTableInfo } from '@/utils';
import MessageDialog from '@/components/message-dialog/message-dialog.vue';
import NickName from '@/components/nick-name/nick-name.vue';
import { useRoute } from 'vue-router';
import GoToTop from '@/components/svg/go-to-top.vue';

const interval = ref();

const isShoWWelcome = ref(false);

const isShowToTop = ref(false);

const route = useRoute();

const wsInfoStore = useWsInfoStore();

const useTables = useTableStore();

const tableList = ref([...useTables.getTableList]);

const isShowNickName = ref(false);

const isShowNetWorkStatus = ref(false);

const info = ref();

const { userDetailInfo } = useUserInfoStore();

const isShowTipInfo = ref(false);

const isShowSetting = ref(false);

const showNetStatus = (v) => (isShowNetWorkStatus.value = v);

const showSettings = (v) => (isShowSetting.value = v);

const closeTipInfo = () => (isShowTipInfo.value = false);

watch(
	() => wsInfoStore.table_info,
	(v) => {
		handlerSingleTableInfo(v, tableList.value);
	},
	{
		deep: true,
	}
);

// ws-开奖结果（与SEI相对应）
watch(
	() => wsInfoStore.msgList.open_result,
	(newVal) => {
		const { history, table_id } = newVal;
		if (table_id && history) {
			const newList = updateTableData(tableList.value, history, table_id);
			tableList.value = newList;
			useTables.setTableList(newList);
		}
	}
);

const showWelcome = (e, v) => {
	e.stopPropagation();
	isShoWWelcome.value = v;
};

const closeNickName = () => {
	isShowNickName.value = false;
	isShoWWelcome.value = true;
};

const checkScrollingArea = () => {
	const area = document.getElementById('table-list-scroll');
	area.addEventListener('scroll', (e) => {
		const position = parseInt(area.scrollTop);
		if (position === 196) {
			isShowToTop.value = true;
		} else if (position < 196) {
			isShowToTop.value = false;
		}
	});
};

const goToTop = () => {
	const area = document.getElementById('table-list-scroll');
	area.scrollTop = 0;
};

// 监听弹窗
watch(
	() => userDetailInfo,
	({ account, user_nick }) => {
		isShowNickName.value = !!(account && !user_nick);
	},
	{ immediate: true, deep: true }
);

onMounted(() => {
	const status = route.query.status;
	if (status === '4' || status === '5') {
		isShowNickName.value = false;
	}
	checkScrollingArea();
});

onBeforeMount(() => {
	// 初始化调用过以后， 这里就不用再掉了， 首次进入游戏还需要调用
	if (tableList.value?.length) return;
	getTableList();
});

onUnmounted(() => {
	isShowNickName.value = false;
	clearInterval(() => interval.value);
});

// 监听换靴事件
watch(
	() => wsInfoStore.msgList.event_change_round,
	(v) => {
		if (v?.table_code) {
			tableList.value = [];
			getTableList();
		}
	},
	{
		immediate: true,
		deep: true,
	}
);

watch(
	() => useTables.getTableList,
	(v, o) => {
		tableList.value = v;
	},
	{
		// immediate: true,
		deep: true,
	}
);
</script>

<style lang="less" scoped>
@import url('./home.less');
</style>

<style lang="less">
.el-drawer__header {
	height: 0;
	margin: 0;
	padding: 0;
}
.el-drawer__body {
	height: 100%;
	padding: 0;

	scrollbar-width: none !important;

	background: linear-gradient(180deg, #2e2f40, #111217 91.67%);
}
</style>

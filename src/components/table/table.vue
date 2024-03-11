<template>
	<div class="t-section t-overflow-hidden t-mb-2 each-table" @click="goToTableView()" id="canvas-area">
		<div class="t-section__header" >
			<div grid-area="info-row-1">
				<div
					class="t-tag bac-fast"
					style="
						--tag__left__padding__right: 9px;
						--tag__right__padding__left: 13px;
						--tag__right__transform__x: -10px;
						--tag__reserve_img_margin-left: -7px;
						--border-radius: 3px;
					"
				>
					<div class="left"><span>快速</span></div>
					<div class="right">
						<span>{{ code }}</span>
					</div>
				</div>
				<div class="t-banker t-mr-3">
					<span class="t-mr-1">庄</span><span>{{ statusInfo?.banker }}</span>
				</div>
				<div class="t-player t-mr-3">
					<span class="t-mr-1">闲</span><span>{{ statusInfo?.player }}</span>
				</div>
				<div class="t-tie">
					<span class="t-mr-1">和</span><span>{{ statusInfo?.he }}</span>
				</div>
			</div>
			<div grid-area="info-row-2">
				<div class="t-limit" @click="(e) => checkTableInfo(e)">
					<span class="t-mr-1"
						>{{ setThousandsOfPoints(public_red_limit_rules[1]['min']) }} - {{ setThousandsOfPoints(public_red_limit_rules[1]['max']) }}
					</span>
					<div class="icon-arrow t-mr-icon">
						<ArrowDown />
					</div>
				</div>
				<div class="t-number-of-players">
					<div class="icon-people t-mr-icon"></div>
					<span>{{ total_people }}</span>
				</div>
				<div class="t-credit">
					<div class="icon-credit t-mr-icon"></div>
					<span>{{ formatMoney(total_money) }}</span>
				</div>
			</div>
			<div grid-area="logo">
				<div
					class="t-logo room-logo royce"
					:style="{
						'background-image': `url(${cover})`,
					}"
					@click="(e) => showAd(e)"
				></div>
			</div>
		</div>
		
		<div   class="t-section__body"  id="scroll-body">
			<div class="t-h-full" :id="`h-full-${id}`">
				<div class="chart road" >
					<!-- <RoadMap :cover="cover" :width="canvasArea.width" :height="canvasArea.height" :mapList="mapList" :mapId="code" /> -->
					<routeMaps
						ref="routeMapRef"
						:mapList="records"
						:mapId="props.code"
						class="route-maps-wrap"
						:width="canvasArea.width"
						:height="canvasArea.height"
					/>
					<span class="underMaintenance" v-if="status !== 1">维护中</span>
				</div>
			</div>
		</div>
		<TablePanel v-if="isShowTableInfo" @table-panel="tablePanel" :data="tablePanelInfo" :isShowPlayerMessage="false" />
		<Advertise v-if="isShowAdvertise" @close="closeAd" :imagePath="cover" />
		<DialogsView v-if="isShowView" :table-code="code" :cover="cover" />
	</div>
</template>
<script setup>
import { ref, onMounted, toRefs, toRaw, computed, defineProps, nextTick, watch, onUnmounted, onBeforeMount } from 'vue';
import { useDrawCanvas } from '@/hook/useDrawCanvas';
import { useRouter } from 'vue-router';
import ArrowDown from '@/components/svg/arrow-down.vue';
import TablePanel from '@/components/table-panel/table-panel.vue';
import { useDynamicCalculation } from '@/hook/useDynamicCalculation';
import Advertise from '@/components/advertise/advertise.vue';
import RoadMap from '@/components/road-map/road-map.vue';
import { useStorage } from '@/hook/useStorage.js';
import { useUserStore, useWsInfoStore, useTableStore } from '@/store';
import { setThousandsOfPoints, formatMoney } from '@/utils';
import DialogsView from '@/components/dialogs-view/dialogs-view.vue';
import eventBus from '@/hook/useMitt';
import routeMaps from '@/components/routeMaps/index.vue';
const useTables = useTableStore();

const userStore = useUserStore();

const isShowView = ref(false);

const scaleRateX = ref(0);

const scaleRateY = ref(0);

const { setStorage } = useStorage();

const routeMapRef = ref()

const canvasArea = ref({
	width: 0,
	height: 0,
});

const props = defineProps({
	code: String,
	id: Number,
	class_id: Number,
	cover: String,
	status: Number,
	bet_total_max: Number,
	confirm_switch: Number,
	total_people: Number,
	records: Array,
	total_money: String | Number,
	table_red_limit_rules: Object,
	self_red_limit_rules: Object,
	public_red_limit_rules: Object,
	pull_address: String,
	statusInfo: Object,
});

const isShowAdvertise = ref(false);

const canvasMap = ref({
	width: 0,
	height: 0,
});

const {
	code,
	id,
	cover,
	status,
	total_money,
	total_people,
	records,
	table_red_limit_rules,
	self_red_limit_rules,
	public_red_limit_rules,
	statusInfo,
} = toRefs(props);

// watch(records, val=> {
// 	routeMapRef.value && routeMapRef.value.init(val)
// })

const mapList = ref(records);

const tablePanelInfo = ref({
	code,
	public_red_limit_rules,
	table_red_limit_rules,
	self_red_limit_rules,
});

const wsInfoStore = useWsInfoStore();

const changeCanvasSize = () => {

		const header = document.getElementsByClassName('t-section__header');
		const full = document.getElementById(`h-full-${id.value}`);
		if (window.innerHeight <= 600) {
			canvasArea.value.height = 145;
			full.style.height = 145 + 'px';
			canvasArea.value.width = header[0].clientWidth;
		} else {
			const canvasAreaHeight = (window.innerHeight - 50) / 3;
			canvasArea.value.height = canvasAreaHeight - header[0].clientHeight;
			canvasArea.value.width = header[0].clientWidth;
			full.style.height = canvasArea.value.height + 'px'
		}
		// 修改完路图容器大小后 主动更新路图
		routeMapRef.value.init(records.value)
};

const router = useRouter();

const isShowTableInfo = ref(false);

// ws 实时桌台数据
watch(
	() => wsInfoStore.msgList.inside_table_info,
	(v) => {
		// 在桌台房间内收到的消息  2s一次
		const { user_list } = v;
		tablePanelInfo.value.user_list = user_list;
	}
);

const checkTableInfo = (e) => {
	if (e) {
		e.stopPropagation();
	}
	isShowTableInfo.value = true;
};

const tablePanel = (v) => isShowTableInfo.value = v;

const closeAd = (v) => isShowAdvertise.value = v;

const showAd = (e) => {
	e.stopPropagation();
	isShowAdvertise.value = true;
};

const goToTableView = () => {
	if(status.value !== 1){return}
	let data = toRaw(props);
	let limitInfo = toRaw(public_red_limit_rules);
	let obj = Object.assign(
		{
			min: limitInfo.value[1]['min'],
			max: limitInfo.value[1]['max'],
			public_red_limit_rules: toRaw(public_red_limit_rules),
			table_red_limit_rules: toRaw(table_red_limit_rules),
			self_red_limit_rules: toRaw(self_red_limit_rules),
		},
		data
	);
	useTables.setTableInformation(obj);
	isShowView.value = useTables.getIsShowDialogView;
	eventBus.emit('close-drawer', false);
	router.push({
		path: '/table-view',
	});
};

onMounted(() => {
	nextTick(() => {
		changeCanvasSize();
	});
	window.addEventListener('resize', changeCanvasSize);
});

watch(
	() => props.records,
	v => {
		if(v?.length){
			mapList.value = v;
			routeMapRef.value?.init?.(mapList.value)
		}
	},
	{ immediate: true, deep: true }
);
</script>
<style lang="less">
@import url('./table.less');
</style>


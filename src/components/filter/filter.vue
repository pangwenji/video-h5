<template>
	<el-drawer v-model="drawer" :before-close="closes" :show-close="false" :direction="'btt'" size="100%" :append-to-body="true">
		<div class="filter_container">
			<div class="filter_content">
				<div class="fullpage-dialog-header">
					<div class="filter-header">
						<Close @click="closeFilters"/>
						<span class="t-text-gold-500 t-font-medium"> Filter </span>
					</div>
				</div>
				<div class="fullpage-dialog-body">
					<div class="t-mb-6">
						<div class="t-pb-2">Type</div>
						<div class="t-px-6">
							<div value="true"><div class="t-text-center" @click="closeFilters">All Type</div></div>
							<div><div class="t-text-center" @click="handlerRapid">Rapid baccarat</div></div>
							<div><div class="t-text-center">Streaming baccarat</div></div>
							<div><div class="t-text-center t-text-gold-500" @click="goToRoulette">Roulette</div></div>
							<div><div class="t-text-center" @click="goToBull">Bull</div></div>
							<div><div class="t-text-center">Dragon Tiger</div></div>
						</div>
					</div>
					<div class="t-mb-6">
						<div class="t-pb-2 t-mb-5 t-border-b t-border-gray-650">Table limit</div>
						<div class="t-px-6 t-grid t-grid-cols-3">
							<div value="true"><div class="t-text-center" @click="sortTable('any')" :class="{'t-text-gold-500':isSort === 'any'}">Any Limit</div></div>
							<div><div class="t-text-center" @click="sortTable('L')" :class="{'t-text-gold-500':isSort === 'L'}">L - H</div></div>
							<div><div class="t-text-center" @click="sortTable('H')" :class="{'t-text-gold-500':isSort === 'H'}">H - L</div></div>
						</div>
					</div>
					<div class="t-mb-6">
						<div class="t-pb-2">Casino</div>
						<div class="casinos">
							<div class="text-xs-center list-item" v-for="( item , index) in listInfo" :key="item" :class="{'actived':isActive === index}" @click="choose(index)">
								<div :class="`content casino ${item} en-us`"></div>
								<div :class="`room-logo ${item === 'all' ? '':item}`">
									<span v-if="item === 'all'">All Casino</span>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</el-drawer>
</template>
<script lang="ts" setup>
import { ref, watch, defineEmits } from 'vue';
import Close from '@/components/svg/close.vue';
import { useRouter } from 'vue-router'
const listInfo = ref(['all', 'cyg', 'resortworld', 'royce', 'solaire', 'wm']);

const isActive = ref(0);

const router = useRouter()

const isSort = ref('any')

const props = defineProps({
	isShow: {
		type: Boolean,
		required: false,
		default: false,
	},
});

const drawer = ref(false);

const emit = defineEmits(['close','sort','closeFilter']);

const closeFilters = ()=>{
	emit('closeFilter',{v:false,t:'Rapid'})
}

const goToRoulette=()=>{
	router.push({
		path:'/roulette'
	})
}

const goToBull=()=>{
	router.push({
		path:'/bull'
	})
}

const handlerRapid=()=>{
	emit('closeFilter',{v:false,t:'Rapid'})
}

const choose=(v:number)=>isActive.value = v;

const sortTable = (v:string)=>{
	emit('sort',v)
	isSort.value = v;
}

const closes = () => {
	emit('close', false);
	drawer.value = false;
};

watch(
	() => props.isShow,
	(v) => {
		drawer.value = v;
	}
);
</script>
<style lang="less" scoped>
@import url('./filter.less');
</style>
<style lang="less">
.el-drawer__header {
	height: 0;
	margin: 0;
	padding: 0;
}
.el-drawer__body {
	padding: 0;
	scrollbar-width: none !important;
	background: linear-gradient(180deg, #2e2f40, #111217 91.67%);
}
</style>

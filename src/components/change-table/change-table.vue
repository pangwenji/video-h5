<template>
	<!-- <div> -->
		<el-drawer v-model="drawer" :show-close="false" size="100%" :append-to-body="true">
			<div class="t-page">
				<div class="game-header">
					<ArrowLeft @click="closes" />
					<span class="t-text-gold-500">快速换桌</span>
					<div class="t-filter" @click="showFilter">
						<img src="@/assets/svg/filter.svg" alt="" />
					</div>
				</div>
				<div class="t-tables">
					<template v-for="item in list" :key="item.code">
						<Table v-bind="item"/>
					</template>
				</div>
			</div>
		</el-drawer>
        <!-- <Filter :is-show="isShowFilter" @sort="sortTable" @close-filter="closeFilter"/>
	</div> -->
</template>
<script lang="ts" setup>
import { ref, watch, defineEmits } from 'vue';
import ArrowLeft from '@/components/svg/arrow-left.vue';
import Filter from '@/components/filter/filter.vue';
import { storeToRefs} from 'pinia';
import Table from '@/components/table/table.vue';
import {  useTableStore } from '@/store';
const data = Array.from({ length: 10 }).map((_, index) => ({
	id: index,
}));

const useTables = useTableStore();

const props = defineProps({
	isShow: {
		type: Boolean,
		required: false,
		default: false,
	},
});

const  list = ref([...useTables.getTableList])

const drawer = ref(false);

const  isShowFilter = ref(false);

const emit = defineEmits(['closeChangeTable']);

const closes = () => {
	emit('closeChangeTable', false);
	drawer.value = false;
};

const closeFilter=()=>{
	isShowFilter.value = false
}

const sortTable=(v:string)=>{
}

const showFilter=()=>isShowFilter.value = false ;

watch(
	() => props.isShow,
	(v) => {
		drawer.value = v;
	}
);
watch(()=>useTables.getTableList,v =>{
	list.value = useTables.getTableList
},{
	immediate:true,
	deep:true

})
</script>
<style lang="less" scoped>
@import url('./change-table.less');
</style>


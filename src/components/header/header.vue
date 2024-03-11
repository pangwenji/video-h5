<template>
	<div>
		<header class="t-header lobby-header">
			<div class="logo landscape"></div>
			<div class="t-credit">
				<img src="@/assets/svg/dollars.svg" alt="" />
				<span class="t-text-white t-text-sm t-font-medium t-leading-none">
					<div>
						<span class="number-grow">{{formatNumber(getUserDetailInfo.money ?? 0)}}</span>
					</div>
				</span>
			</div>
			<div class="t-wifi" @click="handlerNetWorkStatus">
				<img src="@/assets/svg/signal.svg" alt="" @click="" />
			</div>
			<div class="t-filter" @click="showFilter">
				<img src="@/assets/svg/filter.svg" alt="" />
			</div>
			<div class="t-hamburger new-feature" @click="settings">
				<img src="@/assets/svg/hamburger.svg" alt="" />
			</div>
		</header>
        <!-- <Filter :is-show="isShowFilter" @sort="sortTable" @close-filter="closeFilter"/> -->
	</div>
</template>
<script  setup>
import { ref,defineEmits } from 'vue';
import {  useUserInfoStore } from '@/store';
import { formatNumber } from "@/utils"
const isShowFilter = ref(false);

const { getUserDetailInfo } = useUserInfoStore();

const emits = defineEmits(['showNetStatus','showSettings'])
const showFilter = ()=>{
	// isShowFilter.value = true
}

const closeFilter=()=>isShowFilter.value = false

const sortTable=(v)=>{

}
const handlerNetWorkStatus = () => emits('showNetStatus',true)

const settings=()=>emits('showSettings',true)

</script>
<style lang="less">
@import url('./header.less');
</style>


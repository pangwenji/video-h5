<template>
	<el-drawer v-model="drawer" :show-close="false" size="100%" :append-to-body="true">
		<div class="header-drawer">
			<div class="back">
				<div class="arrow-right" @click="close"></div>
			</div>
			<div class="title">筹码样式</div>
		</div>
		<div class="box">
			<div class="t-box active" @click="choose(500)">
				<div>
					<div class="chip_default_500"></div>
					<div class="chip_default_1000"></div>
					<div class="chip_default_5000"></div>
				</div>
				<div>
					<div class="chip_default_10000"></div>
					<div class="chip_default_100000"></div>
				</div>
			</div>
			<div class="t-box t-mt-4" @click="choose(1000)">
				<div>
					<div class="chip_en_500"></div>
					<div class="chip_en_1000"></div>
					<div class="chip_en_5000"></div>
				</div>
				<div>
					<div class="chip_en_10000"></div>
					<div class="chip_en_100000"></div>
				</div>
			</div>

			<div class="t-box t-mt-4" @click="choose(10000)">
				<div>
					<div class="chip_cn_500"></div>
					<div class="chip_cn_1000"></div>
					<div class="chip_cn_5000"></div>
				</div>
				<div>
					<div class="chip_cn_10000"></div>
					<div class="chip_cn_100000"></div>
				</div>
			</div>

			<div class="button">
				<div class="button-item" @click="close">取消</div>
				<div class="button-item" @click="confirm">确定</div>
			</div>
		</div>
	</el-drawer>
</template>
<script lang="ts" setup>
import { ref, watch, defineEmits } from 'vue';
import {  useTableStore} from '@/store';
const chip_value = ref();

const useTables = useTableStore();
const props = defineProps({
	isShow: {
		type: Boolean,
		required: false,
		default: false
	}
})

const drawer = ref(false)

const emit = defineEmits(['closeDrawer'])

const close = () => {
	emit('closeDrawer', false)
	drawer.value = false;
	chip_value.value = null
}

const choose = (v) => {
	chip_value.value = v;

	if(v === 500){
		useTables.setImagePath('sprites_chips_default')
	}else if(v === 1000){
		useTables.setImagePath('sprites_chips_en')
	}else if(v === 10000){
		useTables.setImagePath('sprites_chips_cn')
	}
	console.log(useTables.getImagePath,'useTablesuseTablesuseTables')
};

const confirm = () => {
	drawer.value = false;
	window.localStorage.setItem('chip_value', chip_value.value)
}
watch(() => props.isShow, v => {
	drawer.value = v;
})

</script>
<style lang="less" scoped>
@import url('./drawer.less');
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


<template>
	<el-drawer v-model="drawer" :before-close="closes" :show-close="false" :direction="'btt'" size="40%" :append-to-body="true">
		<div class="tip__container">
			<div class="tip__content">
				<div class="tips-dialog">
					<div>
						<div class="t-text-lg">打赏小费</div>
						<div class="t-mt-3">
							<div class="t-grid">
								<div class="chip-btn" v-for="item in btn" :key="item" :class="{active: isBtnActive === item}" @click="choose(item)">
									<div class="chip-btn-item">
										<div :class="`chip_default_${item}`"></div>
										<div class="t-mt-1">{{ item }}</div>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div class="t-mb-1">
						<div class="t-button" :class="{ disabled: !isActive }" @click="confirm">确定</div>
					</div>
				</div>
			</div>
		</div>
	</el-drawer>
</template>
<script  setup>
import { ref, watch, defineEmits } from 'vue';

const isActive = ref(false);
const btn = ref([5, 25, 100, 500, 1000, 5000, 10000, 100000]);

const props = defineProps({
	isShow: {
		type: Boolean,
		required: false,
		default: false,
	},
});

const isBtnActive = ref(0)

const drawer = ref(false);

const emit = defineEmits(['close']);

const closes = () => {
	emit('close', false);
    isBtnActive.value = 0;
    isActive.value = false;
	drawer.value = false;
};

const confirm=()=>closes()

const choose=(v)=>{
    isBtnActive.value = v
    isActive.value = true;
};
watch(
	() => props.isShow,
	(v) => {
		drawer.value = v;
	}
);
</script>
<style lang="less" scoped>
@import url('./tip.less');
</style>


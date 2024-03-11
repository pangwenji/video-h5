<template>
	<div class="t-page">
		<Header />
		<div class="t-tables">
			<div class="table-section each-table">
				<div class="t-section__header">
					<div grid-area="info-row-1">
						<div class="t-tag rou-fast">
							<div class="left"><span>Roulette</span></div>
							<div class="right"><span>C022</span></div>
						</div>
						<div class="t-banker t-mr-3"><span class="t-mr-0.5">R</span><span>5</span></div>
						<div class="t-player t-mr-3 t-text-white"><span class="t-mr-0.5">B</span><span>6</span></div>
						<div class="t-tie t-mr-3"><span class="t-mr-0.5">Z</span><span>0</span></div>
						<div class="t-tie t-mr-3"><span class="t-mr-0.5"> ZZ </span><span>0</span></div>
					</div>
					<div grid-area="info-row-2">
						<div class="t-limit" @click="(e)=>showTablePanel(e)">
							<span class="t-mr-1">0.1K - 2K</span>
							<div class="icon-arrow t-mr-0.5"></div>
						</div>
						<div class="t-number-of-players">
							<div class="icon-people t-mr-0.5"></div>
							<span>0</span>
						</div>
						<div class="t-credit">
							<div class="icon-credit t-mr-0.5"></div>
							<span>0</span>
						</div>
					</div>
					<div grid-area="logo"><div class="t-logo room-logo cgy"></div></div>
				</div>
				<div class="t-section__body">
					<div class="t-h-full">
						<div class="road-canvas road" incremental-mode="">
							<div class="room-logo-watermark cgy">
								<div class="chart" style="width: 523px; height: 196.75px">
									<svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
										<defs>
											<pattern
												id="gridrect-0.13907389814733429"
												x="0.5"
												y="0.5"
												width="32.625"
												height="32.625"
												patternUnits="userSpaceOnUse"
											>
												<rect width="32.625" height="32.625" fill="none" stroke="#d8d8d8" stroke-width="1"></rect>
											</pattern>
										</defs>
										<rect width="523" height="196.75" fill="url(#gridrect-0.13907389814733429)"></rect>
									</svg>
									<canvas width="1046" height="393.5" style="width: 523px; height: 196.75px" ref="canvasRef"></canvas>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div class="t-section__vip-reserved" style="display: none">
					<span class="t-section__vip-reserved__text">VIP</span>
				</div>
				<div class="t-section__supersix" style="display: none">
					<img src="" alt="img-supersix" />
				</div>
			</div>
		</div>

		<TablePanel v-if="isShowTableInfo" :data="list" @table-panel="tablePanel" :isShowPlayerMessage = "false"/>
	</div>
</template>
<script  setup>
import { ref, watch, defineEmits, onMounted } from 'vue';
import Header from '@/components/header/header.vue';
import { useDrawCanvas } from '@/hook/useDrawCanvas';

import TablePanel from "@/components/table-panel/table-panel.vue"
const { drawRect, drawText } = useDrawCanvas();

const  list=ref([
	{label:'Big/Small',value:'0.1k-2k'},
	{label:'Red/Black',value:'0.1k-2k'},
	{label:'Odd/Even',value:'0.1k-2k'},
	{label:'Dozen',value:'0.01k-1k'},
	{label:'Column',value:'0.01k-1k'},
	{label:'Line',value:'0.01k-0.4k'},
	{label:'Five Number',value:'0.01k-0.05k'},
	{label:'Corner',value:'0.01k-0.3k'},
	{label:'Street',value:'0.01k-0.2k'},
	{label:'Trio',value:'0.01k-0.2k'},
	{label:'Split',value:'0.01k-0.1k'}
])

const isShowTableInfo = ref(false);

const canvasRef = ref();

const drawCanvas = () => {
	const canvas = canvasRef.value;
	if (canvas) {
		const ctx = canvas.getContext('2d');
		const gridSize = canvas.width / 16;
		for (let i = 0; i < 6; i++) {
			for (let j = 0; j < 16; j++) {
				if (i === 4 && j === 6) {
					//画方格
					drawRect(ctx, j, i, gridSize, 'red');
					// 文字
					drawText(ctx, '16', 40, '500', j * gridSize + gridSize / 2, i * gridSize + gridSize / 2, '#ffffff');
				}

			}
		}
	}
};

const tablePanel=(v)=>{
	isShowTableInfo.value = v;
};

const showTablePanel=(e)=>{
	e.stopPropagation();
	isShowTableInfo.value = true
}

onMounted(() => {
	drawCanvas();
});
</script>
<style scoped lang="less">
@import url('./Roulette.less');
</style>


<template>
	<div class="t-page">
		<Header />
		<div class="t-tables">
			<div class="table-section each-table">
				<div class="t-section__header">
					<div grid-area="info-row-1">
						<div class="t-tag rou-fast">
							<div class="left"><span>Bull</span></div>
							<div class="right"><span>C022</span></div>
						</div>
						<div class="t-banker t-mr-3"><span class="t-mr-0.5">R</span><span>5</span></div>
						<div class="t-player t-mr-3 t-text-white"><span class="t-mr-0.5">B</span><span>6</span></div>
						<div class="t-tie t-mr-3"><span class="t-mr-0.5">Z</span><span>0</span></div>
						<div class="t-tie t-mr-3"><span class="t-mr-0.5"> ZZ </span><span>0</span></div>
					</div>
					<div grid-area="info-row-2">
						<div class="t-limit" @click="(e) => showTablePanel(e)">
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
						<div id="road-canvas" class="road-canvas road">
							<div class="room-logo-watermark cgy">
								<div class="t-flex t--mr-0.5">
									<div class="chart" cellsize="15.28125" style="width: 180.094px; height: 98.6875px">
										<svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
											<defs>
												<pattern
													id="gridrect-0.9150456127798012"
													x="0.5"
													y="0.5"
													width="16.28125"
													height="16.28125"
													patternUnits="userSpaceOnUse"
												>
													<rect width="16.28125" height="16.28125" fill="none" stroke="#d8d8d8" stroke-width="1"></rect>
												</pattern>
											</defs>
											<rect width="180.09375" height="98.6875" fill="url(#gridrect-0.9150456127798012)"></rect>
										</svg>
										<canvas
											width="360.1875"
											ref="canvasRef"
											height="197.375"
											style="width: 180.094px; height: 98.6875px"
										></canvas>
									</div>
									<div class="chart t-translate-x" style="width: 342.906px; height: 98.6875px">
										<svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
											<defs>
												<pattern
													id="gridrect-0.15178513116979864"
													x="0.5"
													y="0.5"
													width="16.28125"
													height="16.28125"
													patternUnits="userSpaceOnUse"
												>
													<rect width="16.28125" height="16.28125" fill="none" stroke="#d8d8d8" stroke-width="1"></rect>
												</pattern>
											</defs>
											<rect width="342.90625" height="98.6875" fill="url(#gridrect-0.15178513116979864)"></rect>
										</svg>
										<canvas ref="luChart" width="685.8125" height="197.375" style="width: 342.906px; height: 98.6875px"></canvas>
									</div>
								</div>
								<div style="padding-top: 6.5125px">
									<div class="chart t-niu-luchart" style="width: 504.5px; height: 95.675px; margin-top: 0.4rem">
										<canvas ref="niuChart" width="1009" height="191.35" style="width: 504.5px; height: 95.675px"></canvas>
									</div>
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

		<TablePanel v-if="isShowTableInfo" 
		:data="list" 
		@table-panel="tablePanel" 
		:isShowPlayerMessage = "false"/>
	</div>
</template>
<script  setup>
import { ref, onMounted } from 'vue';

import { useDrawCanvas } from '@/hook/useDrawCanvas';

import TablePanel from '@/components/table-panel/table-panel.vue';
const { 
	drawRect, 
	drawTopLine, 
	drawText, 
	drawCirclePie, 
	drawDiagonalLines, 
	drawCircle, 
	drawBottomLine , 
	drawCircles,
	drawSpecialRect,
	drawAnnotation 
} = useDrawCanvas();

const niuChart = ref();

const list = ref([]);

const isShowTableInfo = ref(false);

const canvasRef = ref();

const luChart = ref();

const drawCanvas = () => {
	drawCanvasLeft();
	drawLuChart();
	drawNiuChart();
};

const drawCanvasLeft = () => {
	const canvas = canvasRef.value;
	if (canvas) {
		const ctx = canvas.getContext('2d');
		const gridSize = canvas.width / 11;
		for (let i = 0; i < 6; i++) {
			for (let j = 0; j < 11; j++) {
				// 画圆饼
				drawCirclePie(j * gridSize + gridSize / 2, i * gridSize + gridSize / 2, gridSize / 2 - 5, 'blue', ctx);

				// 文字
				drawText(ctx, 'B', 20, 500, j * gridSize + gridSize / 2, i * gridSize + gridSize / 2, '#ffffff');

				// 画左上角小圆
				drawCirclePie(j * gridSize + gridSize / 2 - 8, i * gridSize + gridSize / 2 - 10, (gridSize / 2 - 5) / 4, 'red', ctx);

				// 画右下角小圆
				drawCirclePie(j * gridSize + gridSize / 2 + 10, i * gridSize + gridSize / 2 + 8, (gridSize / 2 - 5) / 4, 'green', ctx);
			}
		}
	}
};

const drawLuChart = () => {
	const canvas = luChart.value;
	if (canvas) {
		const ctx = canvas.getContext('2d');
		const gridSize = canvas.width / 21;
		for (let i = 0; i < 6; i++) {
			for (let j = 0; j < 21; j++) {
				// 画圈
				drawCircle(j * gridSize + gridSize / 2, i * gridSize + gridSize / 2, gridSize / 2 - 6, 'blue', ctx);

				// 圆内文字
				drawText(ctx, '1', 18, 500, j * gridSize + gridSize / 2, i * gridSize + gridSize / 2 + 2, 'green');

				// 画左上角小圆
				drawCirclePie(j * gridSize + gridSize / 2 - 8, i * gridSize + gridSize / 2 - 10, (gridSize / 2 - 5) / 4, 'red', ctx);

				// 画斜线
				drawDiagonalLines(
					ctx,
					2,
					j * gridSize + gridSize / 2,
					i * gridSize + gridSize,
					j * gridSize + gridSize,
					i * gridSize + gridSize / 2,
					'red'
				);
				// 画右下角小圆
				drawCirclePie(j * gridSize + gridSize / 2 + 9, i * gridSize + gridSize / 2 + 8, (gridSize / 2 - 5) / 4, 'blue', ctx);
			}
		}
	}
};


const drawNiuChart = () => {
	const canvas = niuChart.value;
	if (canvas) {
		const ctx = canvas.getContext('2d');
		const gridSize = canvas.width / 17;

		for (let i = 0; i < 2; i++) {
			let step = 8;
			for (let j = 0; j < 17; j++) {
				
				//画方格
				drawRect(ctx, j, i, gridSize, 'transparent');

				//画 注解
				drawAnnotation(ctx,i,j,gridSize)

				
				// 庄家
				if (i == 0 && j !== 0 && j !== 16) {
					if([1,4].includes(j)){
						drawSpecialRect(ctx, i, j, gridSize, 'red', 'top')
					}
					drawText(ctx, 'JPMON', 8, 500, j * gridSize + gridSize / 2, i * gridSize + gridSize / 2 - 12, 'red');
					drawText(ctx, '5', 20, 500, j * gridSize + gridSize / 2, i * gridSize + gridSize / 2 + 4, 'red');
				
				}
				// 闲家
				if (i === 1 && j !== 0 && j !== 16) {
					if([2,3,4].includes(j)){
						drawSpecialRect(ctx, i, j, gridSize, 'blue', 'bottom')
					}

					drawText(ctx, '5', 20, 500, j * gridSize + gridSize / 2, i * gridSize + gridSize / 2 + 4, 'blue');
					drawText(ctx, 'JPMON', 8, 500, j * gridSize + gridSize / 2, i * gridSize + gridSize / 2 + 16, 'blue');
					drawCircles(ctx,j, i, gridSize,'red','B');
					if(j === 2){
						drawCircles(ctx,j, i, gridSize,'blue','P');
					}
					if([4,5,6,8,11,12,13,15,16].includes(j)){
						drawCircles(ctx,j, i, gridSize,'blue','P');
					}
				
				}
				++step;
				if (i === 1) {
					drawText(
						ctx,
						`${i === 1 && j === 0 ? 'Round' : step}`,
						18,
						500,
						j * gridSize + gridSize / 2,
						i * gridSize + gridSize / 2 + 58,
						'black'
					);
				}
			}
		}

		//画上边
		drawTopLine(ctx, canvas, gridSize);
		// 画底边
		drawBottomLine(ctx, canvas, gridSize);
	}
};

const showTablePanel = (e) => {
	e.stopPropagation();
	isShowTableInfo.value = true;
};

const tablePanel = (v) => {
	isShowTableInfo.value = v;
};

onMounted(() => {
	drawCanvas();
});
</script>
<style scoped lang="less">
@import url('../roulette/Roulette.less');
.t-tag.rou-fast div.left {
	background-color: rgba(255, 95, 0, 1) !important;
}

.t-tag.rou-fast div {
	border-color: rgba(255, 95, 0, 1) !important;
}
.t-flex {
	display: flex;
}
.t--mr-0\.5 {
	margin-right: -0.125rem;
}
</style>


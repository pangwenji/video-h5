<template>
	<div class="canvas-enlarge" @click="(e) => show(e, false)">
		<div>
			<div class="t-bg-white" @click="(e) => show(e, true)">
				<div class="chart road" style="width: 20.51rem; height: 19.8rem">
					<div class="chart-canvas room-logo-watermark royce t-flex-col" style="">
						<canvas
							width="985.2500"
							height="422.2500"
							ref="zhuZaiLu"
							style="width: 20.51rem; height: 8.8rem; transform: translateZ(0px)"
						></canvas>
						<div class="lu-chart">
							<canvas
								width="985.2500267028809"
								height="211.1250057220459"
								ref="daLu"
								style="width: 20.51rem; height: 4.4rem; transform: translateZ(0px)"
							></canvas
							><canvas
								width="985.2500267028809"
								height="105.56250286102295"
								ref="daYanLu"
								style="width: 20.51rem; height: 2.2rem; transform: translateZ(0px)"
							></canvas>
							<div class="t-flex t-flex-col">
								<canvas
									width="985.2500267028809"
									height="105.56250286102295"
									ref="smallLu"
									style="width: 20.51rem; height: 2.2rem; transform: translateZ(0px)"
								></canvas
								><canvas
									width="985.2500267028809"
									height="105.56250286102295"
									ref="smallQintLu"
									style="width: 20.51rem; height: 2.2rem; transform: translateZ(0px)"
								></canvas>
							</div>
						</div>
					</div>
				</div>
				<div class="bottom-gray">
					<div class="ask-btn" >
						<span class="t-text-red-600"> 庄 </span>
						<span
							class="icon"
							:style="{
								background: `url(${setWenImage(bankerInfo.daYanLu)}) 50% / contain no-repeat`,
							}"
							style
						></span>
						<span
							class="icon"
							:style="{
								background: `url(${setWenImage(bankerInfo.smallLu)}) 50% / contain no-repeat`,
							}"
						></span>
						<span
							class="icon"
							:style="{
								background: `url(${setWenImage(bankerInfo.smallQianLu)}) 50% / contain no-repeat`,
							}"
						></span>
					</div>
					<div class="line"></div>
					<div class="ask-btn" >
						<span class="t-text-blue-600"> 闲 </span>
						<span
							class="icon player-hollow"
							:style="{
								background: `url(${setWenImage(playerInfo.daYanLu)}) 50% / contain no-repeat`,
							}"
						></span>
						<span
							class="icon"
							:style="{
								background: `url(${setWenImage(playerInfo.smallLu)}) 50% / contain no-repeat`,
							}"
						></span>
						<span
							class="icon"
							:style="{
								background: `url(${setWenImage(playerInfo.smallQianLu)}) 50% / contain no-repeat`,
							}"
						></span>
					</div>
				</div>
			</div>
		</div>
		<div class="close-btn" style="--translateX: 233.1875px">
			<img src="@/assets/svg/chart-close.svg" />
		</div>
	</div>
</template>
<script setup>
import { defineEmits, defineProps, onMounted, onBeforeMount, ref, watch, nextTick,toRefs } from 'vue';
import { useDrawCanvas } from '@/hook/useDrawCanvas';
import { convertOriginalData, colorRec, setWenImage } from '@/utils';
import Roadmap from './js/Roadmap';
const emit = defineEmits(['close']);
const props = defineProps({
	data: Object,
	bankerInfo: Object,
	playerInfo: Object,
});

const { bankerInfo ,playerInfo} = toRefs(props)

const { drawRect, drawCirclePie, drawText, drawCircle, drawDiagonalLines } = useDrawCanvas();

const zhuZaiLu = ref();

const daLu = ref();

const routeData = ref();

const daYanLu = ref();

const smallLu = ref();

const smallQintLu = ref();

const show = (e, v) => {
	e.stopPropagation();
	emit('close', v);
};

const drawZhuZiLu = () => {
	const canvas = zhuZaiLu.value;
	commonRect(canvas, 14, 6);
};

const drawDaLu = () => {
	const canvas = daLu.value;
	commonRect(canvas, 28, 6);
};

const drawDaYanLu = () => {
	const canvas = daYanLu.value;
	commonRect(canvas, 28, 3);
};

const drawSmallLu = () => {
	const canvas = smallLu.value;
	commonRect(canvas, 28, 3);
};

const drawSmallQintLu = () => {
	const canvas = smallQintLu.value;
	commonRect(canvas, 28, 3);
};

const commonRect = (canvas, cols, rows) => {
	if (canvas) {
		const ctx = canvas.getContext('2d');
		const gridSize = canvas.width / cols;
		for (let col = 0; col < cols; col++) {
			for (let row = 0; row < rows; row++) {
				drawRect(ctx, col, row, gridSize, 'transparent');
			}
		}
	}
};

const drawRects = () => {
	// 画珠仔路
	drawZhuZiLu();
	// 画主路
	drawDaLu();
	// 画大眼路
	drawDaYanLu();
	// 画小路
	drawSmallLu();
	// 画小强路
	drawSmallQintLu();
};

const drawCanvas = () => {
	// 画方框
	drawRects();
};

const drawBeadPlateData = () => {
	const { matrix,cols,rows } = routeData.value.breadplate;
	if (matrix.length > 0) {
		const canvas = zhuZaiLu.value;
		if (canvas) {
			const ctx = canvas.getContext('2d');
			const gridSize = canvas.width / 14;
			const r = canvas.width / 14 / 2 - 4;
			for (let i = 0; i < cols; i++) {
				for (let j = 0; j < rows; j++) {
					if (matrix[j] && matrix[j][i]) {
						const { winner, isPair, text } = matrix[j][i];
						const x = i * gridSize + gridSize / 2;
						const y = j * gridSize + gridSize / 2;
						drawCirclePie(x, y, r, colorRec[winner], ctx);
						// 画文字
						drawText(ctx, text, 40, '500', x, y, '#ffffff');
						// 画对子 右下角
						if (isPair.indexOf('Banker') >= 0) {
							const leftX = i * gridSize + gridSize - 63; // 63
							const leftY = j * gridSize + gridSize - 60; // 60
							drawCirclePie(leftX, leftY, 3, colorRec['Banker'], ctx);
						}
						//左上角
						if (isPair.indexOf('Player') >= 0) {
							const rightX = i * gridSize + gridSize - 10; 
							const rightY = j * gridSize + gridSize - 10;
							drawCirclePie(rightX, rightY, 3, colorRec['Player'], ctx);
						}
					}
				}
			}
		}
	}
};

const drawBigRoad = () => {
	const { matrix } = routeData.value.bigroad;
	if (matrix.length > 0) {
		const canvas = daLu.value;
		if (canvas) {
			const ctx = canvas.getContext('2d');
			const gridSize = canvas.width / 28;
			const r = canvas.width / 28 / 2 - 3;
			for (let i = 0; i < 28; i++) {
				for (let j = 0; j < 6; j++) {
					if (matrix[j][i]) {
						const { winner, isPair, text, isTie, tie_count } = matrix[j][i];
						const x = i * gridSize + gridSize / 2;
						const y = j * gridSize + gridSize / 2;
						drawCircle(x, y, r, colorRec[winner], ctx);
						if (isPair) {
							// 右下角
							if (isPair.indexOf('Banker') >= 0) {
								const leftX = i * gridSize + gridSize - 28; 
								const leftY = j * gridSize + gridSize - 30; 
								drawCirclePie(leftX, leftY, 3, colorRec['Banker'], ctx);
							}
							// 左上角
							if (isPair.indexOf('Player') >= 0) {
								const rightX = i * gridSize + gridSize - 3;
								const rightY = j * gridSize + gridSize - 6;
								drawCirclePie(rightX, rightY, 3, colorRec['Player'], ctx);
							}
						}
						if (isTie) {
							// 画文字
							drawText(ctx, tie_count, 30, '500', x, y, '#1d8919');
							//画斜线
							const startX = i * gridSize + gridSize / 2;
							const startY = j * gridSize + gridSize;

							const endX = i * gridSize + gridSize;
							const endY = j * gridSize + gridSize / 2;
							drawDiagonalLines(ctx, 2, startX, startY, endX, endY, '#1d8919');
						}
					}
				}
			}
		}
	}
};

const drawBigEyeLu = () => {
	const { matrix } = routeData.value.bigeyeboy;
	if (matrix.length > 0) {
		const canvas = daYanLu.value;
		if (canvas) {
			const ctx = canvas.getContext('2d');
			const gridSize = canvas.width / 56;
			const r = canvas.width / 28 / 4 - 3;
			for (let i = 0; i < 56; i++) {
				for (let j = 0; j < 6; j++) {
					if (matrix[j][i]) {
						const { eyeColor } = matrix[j][i];
						const x = i * gridSize + 10;
						const y = j * gridSize + 10;
						if (eyeColor) {
							drawCircle(x, y, r, eyeColor, ctx);
						}
					}
				}
			}
		}
	}
};

// 小路
const drawSmallRoad = () => {
	const { matrix } = routeData.value.smallroad;
	if (matrix.length > 0) {
		const canvas = smallLu.value;
		if (canvas) {
			const ctx = canvas.getContext('2d');
			const gridSize = canvas.width / 56;
			const r = canvas.width / 28 / 4 - 3;
			for (let i = 0; i < 56; i++) {
				for (let j = 0; j < 6; j++) {
					if (matrix[j][i]) {
						const { smallRoadColor } = matrix[j][i];
						const x = i * gridSize + 10;
						const y = j * gridSize + 10;
						if (smallRoadColor) {
							drawCirclePie(x, y, r, smallRoadColor, ctx);
						}
					}
				}
			}
		}
	}
};

// 小强路
const drawCockroachPig = () => {
	const { matrix } = routeData.value.cockroachPig;
	if (matrix.length > 0) {
		const canvas = smallQintLu.value;
		if (canvas) {
			const ctx = canvas.getContext('2d');
			const gridSize = canvas.width / 56;
			for (let i = 0; i < 56; i++) {
				for (let j = 0; j < 6; j++) {
					if (matrix[j][i]) {
						const { cockroachColor } = matrix[j][i];
						if (cockroachColor) {

							//画斜线
							const startX = i * gridSize + gridSize / 2 - 7;
							const startY = j * gridSize + gridSize;

							const endX = i * gridSize + gridSize - 3;
							const endY = j * gridSize + gridSize / 2 - 5;

							// const startX = i * gridSize + gridSize / 2 - 3;
							// const startY = j * gridSize + gridSize + 4;

							// const endX = i * gridSize + gridSize - 2;
							// const endY = j * gridSize + gridSize / 2 - 2;
							drawDiagonalLines(ctx, 2, startX, startY, endX, endY, cockroachColor);
						}
					}
				}
			}
		}
	}
};

const drawRoute = () => {
	console.log(routeData.value, '看一下数据routeData.value');
	if (routeData.value) {
		// 画珠仔路
		drawBeadPlateData();
		// 画大路
		drawBigRoad();
		// 画大眼路
		drawBigEyeLu();
		// 画小路
		drawSmallRoad();
		// 小强路
		drawCockroachPig();
	}
};

const handlerData = (array) => {
	if (Array.isArray(array) && array.length > 0) {
		const convertedData = convertOriginalData(array, colorRec);
		routeData.value = new Roadmap({
			results: convertedData,
		});
		if (zhuZaiLu.value) {
			routeData.value.update();
		}
		// 画路途
		drawRoute();
	}
};

const changeCanvasSize = () => {
	//   console.log('Screen resolution change detected. Updating canvas size...');
	//   const canvasList = [zhuZaiLu, daLu, daYanLu, smallLu, smallQintLu];

	//   canvasList.forEach(canvasRef => {
	//     if (canvasRef.value) {
	//       const canvas = canvasRef.value;
	//       const parentWidth = canvas.parentElement.clientWidth;
	//       const proportion = parentWidth / 20.51; // You can adjust this value as needed

	//       canvas.width = parentWidth;
	//       canvas.height = proportion * 8.8; // Adjust the height proportionally

	//       drawCanvas();
	//       drawRoute();
	//     }
	//   });

	drawCanvas();
	drawRoute();
	const width = zhuZaiLu.value.width / 3;
};

onMounted(() => {
	drawCanvas();
	nextTick(() => {
		handlerData(props.data.mapList);
	});

	window.addEventListener('resize', changeCanvasSize);
});

watch(
	() => props.data.mapList,
	(v) => {
		handlerData(v);
	},
	{
		immediate: true,
		deep: true,
	}
);
</script>
<style lang="less" scoped>
@import url('./canvas-enlarge.less');
</style>


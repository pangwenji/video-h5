<template>
	<div class="t-flex chart-canvas room-logo-watermark royce" id="canvas-area">
		<canvas
			:width="canvasLeftArg.canvasWidth"
			:height="canvasLeftArg.canvasHeight"
			ref="canvasLeftRef"
			:style="{
				width: `${canvasLeftArg.width}px`,
				height: `${canvasLeftArg.height}px`,
				transform: `translateZ(${0}px)`,
			}"
		></canvas>
		<div class="lu-chart" id="lu-charts">
			<canvas
				:width="canvasRightTopArg.canvasWidth"
				:height="canvasRightTopArg.canvasHeight"
				ref="canvasRightTopRef"
				:style="{
					width: `${canvasRightTopArg.width}px`,
					height: `${canvasRightTopArg.height}px`,
					transform: `translateZ(${0}px)`,
				}"
			>
			</canvas>

			<canvas
				:width="canvasRightMiddleArg.canvasWidth"
				:height="canvasRightMiddleArg.canvasHeight"
				ref="canvasRightMiddleRef"
				:style="{
					width: `${canvasRightMiddleArg.width}px`,
					height: `${canvasRightMiddleArg.height}px`,
					transform: `translateZ(${0}px)`,
				}"
			></canvas>
			<div class="t-flex">
				<canvas
					:width="canvasRightBottomLeftArg.canvasWidth"
					:height="canvasRightBottomLeftArg.canvasHeight"
					:style="{
						border: 'none',
						width: `${canvasRightBottomLeftArg.width}px`,
						height: `${canvasRightBottomLeftArg.height}px`,
						transform: `translateZ(${0}px)`,
					}"
					ref="canvasBottomLeftRef"
				>
				</canvas>
				<canvas
					:width="canvasRightBottomRightArg.canvasWidth"
					:height="canvasRightBottomRightArg.canvasHeight"
					ref="canvasBottomRightRef"
					:style="{
						border: 'none',
						width: `${canvasRightBottomRightArg.width}px`,
						height: `${canvasRightBottomRightArg.height}px`,
						transform: `translateZ(${0}px)`,
					}"
				></canvas>
			</div>
		</div>
	</div>
</template>
<script setup>
import { ref, onMounted, defineProps, toRefs, watch, onUnmounted } from 'vue';
import { useDrawCanvas } from '@/hook/useDrawCanvas';
import { useDynamicCalculation } from '@/hook/useDynamicCalculation.js';
import { convertOriginalData, colorRec } from '@/utils';
import Roadmap from '@/components/routeMaps/js/Roadmap';
const { drawRect, drawCirclePie, drawText, drawCircle, drawDiagonalLines } = useDrawCanvas();

import { nextTick } from 'process';
const props = defineProps({
	width: Number,
	height: Number,
	mapList: Array,
});

const interval = ref();

const { width, height, mapList } = toRefs(props);

const gridSizeShip = ref();

const { calculationCanvas } = useDynamicCalculation();

const routeData = ref();

//珠仔路
const canvasLeftRef = ref();

// 大路
const canvasRightTopRef = ref();

// 大眼路
const canvasRightMiddleRef = ref();

//小路
const canvasBottomLeftRef = ref();

// 小强路
const canvasBottomRightRef = ref();

const canvasLeftArg = ref({
	canvasWidth: 0,
	canvasHeight: 0,
	width: 0,
	height: 0,
});

const canvasRightTopArg = ref({
	canvasWidth: 0,
	canvasHeight: 0,
	width: 0,
	height: 0,
});

const canvasRightMiddleArg = ref({
	canvasWidth: 0,
	canvasHeight: 0,
	width: 0,
	height: 0,
});

const canvasRightBottomLeftArg = ref({
	canvasWidth: 0,
	canvasHeight: 0,
	width: 0,
	height: 0,
});

const canvasRightBottomRightArg = ref({
	canvasWidth: 0,
	canvasHeight: 0,
	width: 0,
	height: 0,
});

const drawZhuZaiLuRect = () => {
	const canvas = canvasLeftRef.value;
	if (canvas) {
		const ctx = canvas.getContext('2d');
		const gridSize = canvas.height / 6;
		for (let col = 0; col < 6; col++) {
			for (let row = 0; row < 6; row++) {
				drawRect(ctx, col, row, gridSize, 'transparent');
			}
		}
	}
};
const drawDaLuRect = () => {
	const canvas = canvasRightTopRef.value;
	if (canvas) {
		const ctx = canvas.getContext('2d');
		const gridSize = canvas.height / 6;
		gridSizeShip.value = gridSize;
		for (let col = 0; col < 56; col++) {
			for (let row = 0; row < 6; row++) {
				drawRect(ctx, col, row, gridSize, 'transparent');
			}
		}
	}
};

const drawDaYanLuRect = () => {
	const canvas = canvasRightMiddleRef.value;
	if (canvas) {
		const ctx = canvas.getContext('2d');
		for (let col = 0; col < 56; col++) {
			for (let row = 0; row < 3; row++) {
				drawRect(ctx, col, row, gridSizeShip.value, 'transparent');
			}
		}
	}
};

const drawSmallLuRect = () => {
	const canvas = canvasBottomLeftRef.value;
	if (canvas) {
		const ctx = canvas.getContext('2d');
		for (let col = 0; col < 28; col++) {
			for (let row = 0; row < 3; row++) {
				drawRect(ctx, col, row, gridSizeShip.value, 'transparent');
			}
		}
	}
};

const drawSmallQianaLu = () => {
	const canvas = canvasBottomRightRef.value;
	if (canvas) {
		const ctx = canvas.getContext('2d');
		for (let col = 0; col < 28; col++) {
			for (let row = 0; row < 3; row++) {
				drawRect(ctx, col, row, gridSizeShip.value, 'transparent');
			}
		}
	}
};

const drawAllRect = () => {
	drawZhuZaiLuRect();
	drawDaLuRect();
	drawDaYanLuRect();
	drawSmallLuRect();
	drawSmallQianaLu();
};

const drawBeadPlateData = () => {
	const { matrix, results } = routeData.value.breadplate;
	if (matrix.length > 0) {
		const canvas = canvasLeftRef.value;
		if (canvas) {
			const ctx = canvas.getContext('2d');

			// 当没有数据时候清除画布
			if (results.length === 0) {
				ctx.clearRect(0, 0, canvas.width, canvas.height);
				// 重新绘制方格
				drawZhuZaiLuRect();
			}

			const gridSize = canvas.height / 6;
			const r = canvas.height / 6 / 2 - 6;
			for (let i = 0; i < matrix.length; i++) {
				for (let j = 0; j < matrix[i].length; j++) {
					if (matrix[j] && matrix[j][i]) {
						const { winner, isPair, text } = matrix[j][i];
						const x = i * gridSize + gridSize / 2;
						const y = j * gridSize + gridSize / 2;
						drawCirclePie(x, y, r, colorRec[winner], ctx);
						// 画文字
						drawText(ctx, text, 40, '500', x, y, '#ffffff');
						// 画对子 左上角
						if (isPair.indexOf('Banker') >= 0) {
							const leftX = i * gridSize + gridSize / 7;
							const leftY = j * gridSize + gridSize / 7;
							drawCirclePie(leftX, leftY, 4, colorRec['Banker'], ctx);
						}
						//右下角
						if (isPair.indexOf('Player') >= 0) {
							const stepX = i * gridSize + gridSize - 12;
							const stepY = j * gridSize + gridSize - 12;
							const rightX = stepX; // 10
							const rightY = stepY; // 10
							drawCirclePie(rightX, rightY, 4, colorRec['Player'], ctx);
						}
					}
				}
			}
		}
	}
};

const drawBigRoad = () => {
	const { matrix, cols, rows, results } = routeData.value.bigroad;
	console.log(matrix, 'matrix大路图');
	if (matrix.length > 0) {
		const canvas = canvasRightTopRef.value;
		if (canvas) {
			const ctx = canvas.getContext('2d');

			// 当没有数据时候清除画布
			if (results.length === 0) {
				ctx.clearRect(0, 0, canvas.width, canvas.height);
				// 重新绘制方格
				drawDaLuRect();
			}

			const gridSize = canvas.height / 6;
			const r = canvas.height / 6 / 2 - 3;
			for (let i = 0; i < 20; i++) {
				for (let j = 0; j < 6; j++) {
					const item = matrix[j][i];
					if (item) {
						console.log(matrix, 'matrix');
						const { winner, isPair, text, isTie, tie_count } = matrix[j][i];
						const x = i * gridSize + gridSize / 2;
						const y = j * gridSize + gridSize / 2;
						drawCircle(x, y, r, colorRec[winner], ctx);
						if (isPair) {
							// 左上角
							if (isPair.indexOf('Banker') >= 0) {
								const leftX = i * gridSize + gridSize / 5;
								const leftY = j * gridSize + gridSize / 5;
								drawCirclePie(leftX, leftY, 4, colorRec['Banker'], ctx);
							}
							//  右下角
							if (isPair.indexOf('Player') >= 0) {
								const stepX = i * gridSize + gridSize - 6;
								const stepY = j * gridSize + gridSize - 6;
								const rightX = stepX; // 3
								const rightY = stepY; // 6
								drawCirclePie(rightX, rightY, 3, colorRec['Player'], ctx);
							}
						}
						if (isTie) {
							console.log(tie_count, 'tie_count');
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
	const { matrix, results } = routeData.value.bigeyeboy;
	if (matrix.length > 0) {
		const canvas = canvasRightMiddleRef.value;
		if (canvas) {
			const ctx = canvas.getContext('2d');

			// 当没有数据时候清除画布
			if (results.length === 0) {
				ctx.clearRect(0, 0, canvas.width, canvas.height);
				// 重新绘制方格
				drawDaYanLuRect();
			}

			const gridSize = canvas.height / 6;
			const r = canvas.height / 6 / 2 - 2;
			for (let i = 0; i < 40; i++) {
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
	const { matrix , results} = routeData.value.smallroad;
	if (matrix.length > 0) {
		const canvas = canvasBottomLeftRef.value;
		if (canvas) {
			const ctx = canvas.getContext('2d');
			// 当没有数据时候清除画布
			if (results.length === 0) {
				ctx.clearRect(0, 0, canvas.width, canvas.height);
				// 重新绘制方格
				drawSmallLuRect();
			}

			const gridSize = canvas.height / 6;
			const r = canvas.height / 6 / 2 - 4;
			for (let i = 0; i < 20; i++) {
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
	const { matrix, results } = routeData.value.cockroachPig;
	if (matrix.length > 0) {
		const canvas = canvasBottomRightRef.value;
		if (canvas) {
			const ctx = canvas.getContext('2d');

				// 当没有数据时候清除画布
				if (results.length === 0) {
				ctx.clearRect(0, 0, canvas.width, canvas.height);
				// 重新绘制方格
				drawSmallQianaLu();
			}

			const gridSize = canvas.height / 6;
			for (let i = 0; i < 20; i++) {
				for (let j = 0; j < 6; j++) {
					if (matrix[j][i]) {
						const { cockroachColor } = matrix[j][i];
						if (cockroachColor) {
							//画斜线
							const startX = i * gridSize + gridSize / 2 - 7;
							const startY = j * gridSize + gridSize;

							const endX = i * gridSize + gridSize - 3;
							const endY = j * gridSize + gridSize / 2 - 5;
							drawDiagonalLines(ctx, 2, startX, startY, endX, endY, cockroachColor);
						}
					}
				}
			}
		}
	}
};

const drawRoute = () => {
	// drawCanvasLeft(canvasLeftRef, props.data);
	if (routeData.value) {
		// 画珠仔路
		drawBeadPlateData();
		// 画大路
		drawBigRoad();
		// 画大眼路
		drawBigEyeLu();
		// 画小路
		drawSmallRoad();
		// // 小强路
		drawCockroachPig();
	}
};

const drawCanvas = async () => await drawAllRect();

const initRouteData = () => {
	const convertedData = convertOriginalData(mapList.value, colorRec);
	routeData.value = new Roadmap({
		results: convertedData,
	});
	if (canvasLeftRef.value) {
		routeData.value.update();
	}
	drawRoute();
};

const reCanvasSize = async () => {
	const canvasWidthAndHeight = {
		width: width.value,
		height: height.value,
	};
	await calculationCanvas(
		canvasWidthAndHeight,
		canvasLeftArg,
		canvasRightTopArg,
		canvasRightMiddleArg,
		canvasRightBottomLeftArg,
		canvasRightBottomRightArg
	);
	await drawCanvas();
	await initRouteData();
};

onMounted(() => {
	nextTick(() => {
		reCanvasSize();
	});
	window.addEventListener('resize', reCanvasSize);
});

watch(
	() => props.mapList,
	(v) => {
		console.log(props.mapList, 'props.mapListprops.mapList');
		initRouteData();
	},
	{
		immediate: true,
		deep: true,
	}
);
watch(
	() => width.value,
	(v) => {
		reCanvasSize();
	},
	{
		immediate: true,
		deep: true,
	}
);
</script>

<style lang="less" scoped>
@import url('./road-map.less');
</style>


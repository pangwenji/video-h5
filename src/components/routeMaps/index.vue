<script setup>
import { ref, onMounted, toRefs, watch, onBeforeMount, nextTick } from 'vue';
import { fabric } from 'fabric';
import Roadmap from '@/components/routeMaps/js/Roadmap';


import BankeImg from '../../assets/route-map-img/zh_Banker.png'
import PlayerImg from '../../assets/route-map-img/zh_Player.png'
import TieImg from '../../assets/route-map-img/zh_Tie.png'

const props = defineProps({
	mapList: Array,
	mapId: String,
	width: Number,
	height: Number,
});

const { mapList, mapId, width, height } = toRefs(props);

const roadMap = ref();

const mapListCopy = ref([])

// watch(mapList, (val) => {
// 	if (mapList.value && Array.isArray(mapList.value)) {
// 		init(val);
// 	}
// });

function init(list) {
	if(list && list.length) {
		mapListCopy.value = list
		const convertedData = convertOriginalData();
		roadMap.value = new Roadmap({
			results: convertedData,
		});
		if (mainCanvas.value) {
			roadMap.value.update();
		}
		draw();
	}
}

// 转换原始数据
function convertOriginalData() {
	let arr = new Array();
	mapListCopy.value.forEach((element) => {
		if (element.original_data) {
			const original_data = JSON.parse(element.original_data);
			const winnerEnumInfo = enumInfoList.winner[original_data.winner_mark];
			const isPairEnumInfo = enumInfoList.pair[original_data.winner_pair_mark];
			arr.push({
				original_data,
				winner: winnerEnumInfo.name,
				isPair: isPairEnumInfo,
				color: colorRec[winnerEnumInfo.name],
				text: winnerEnumInfo.text,
			});
		}
	});

	return arr;
}

// 设置 庄闲和对应的颜色
const colorRec = {
	Player: '#2033d9',
	Banker: '#d9202c',
	Tie: '#21d924',
};

const enumInfoList = {
	winner: {
		1: {
			name: 'Player',
			text: '闲',
		},
		2: {
			name: 'Tie',
			text: '和',
		},
		3: {
			name: 'Banker',
			text: '庄',
		},
	},
	pair: {
		1: '', // 没有对子
		2: 'Player', // 闲家对子
		3: 'Banker', //庄家对子
		4: 'Player,Banker', // 庄家闲家都是对子
	},
};

const mainCanvas = ref(null);

// 珠盘路
const beadPlateRect = ref(null);
const beadPlateOptions = ref({
	rowNum: 6,
	columnNum: 6,
	gridSize: 54,
});

// 大路
const bigRoadRect = ref(null);
const bigRoadOptions = ref({
	rowNum: 6,
	columnNum: 20,
	gridSize: 27,
});

// 大眼路
const bigEyeRect = ref(null);
const bigEyeOptions = ref({
	rowNum: 3,
	columnNum: 20,
	gridSize: 27,
});

// 小路
const smallRoadRect = ref(null);
const smallRoadOptions = ref({
	rowNum: 3,
	columnNum: 10,
	gridSize: 27,
});

// 小强路
const cockroachRoadRect = ref(null);
const cockroachRoadOptions = ref({
	rowNum: 3,
	columnNum: 10,
	gridSize: 27,
});

// 用图片代替庄闲和文字
function winnerTextPaint({winner, top, left, width, height, gridSize}) {
	let imgUrl = null
	if(winner === "Banker") {
		imgUrl = BankeImg
	}
	if(winner === "Player") {
		imgUrl = PlayerImg
	}
	if(winner === "Tie") {
		imgUrl = TieImg
	}
	fabric.Image.fromURL(imgUrl, img=> {
		var scale = (gridSize-6) / Math.min(img.width, img.height);
    img.set({
        left: left,
        top: top,
        scaleX: scale,
        scaleY: scale,
    });
    // var centeredLeft = left + (gridSize - img.width * scale) / 2;
    // var centeredTop = top + (gridSize - img.height * scale) / 2 +2;
    
    // img.set({
    //     left: centeredLeft,
    //     top: centeredTop,
    // });
		mainCanvas.value.add(img)
	})
}

// 换成 用线画格子
function createBlockByLine(options) {
	const { rowNum, columnNum, gridSize, leftBase, topBase } = options

	if(!rowNum || !columnNum || !gridSize) {
		return 
	}
	var linesCache = [];
	// 竖线
	for (var i = 0; i <= columnNum; i++) {
			linesCache.push(new fabric.Line([leftBase + i * gridSize, topBase, leftBase + i * gridSize, topBase + rowNum * gridSize], {
					stroke: '#dedede',
					selectable: false,
			}));
	}
	// 横线
	for (var j = 0; j <= rowNum; j++) {
			linesCache.push(new fabric.Line([leftBase, topBase + j * gridSize, leftBase + columnNum * gridSize, topBase + j * gridSize], {
					stroke: '#dedede',
					selectable: false,
			}));
	}

	linesCache.forEach(function(line) {
		mainCanvas.value.add(line);
	});
	linesCache = []
}

function createBeadPlateBlock() {
	const { blockWidth, blockHeight, rowNum, columnNum, gridSize } = beadPlateOptions.value;
	createBlockByLine({rowNum, columnNum, gridSize,leftBase:0,topBase:0})
}

function createBigRoadBlock() {
	const { blockWidth, blockHeight, rowNum, columnNum, gridSize } = bigRoadOptions.value;
	const leftBase = beadPlateOptions.value.gridSize * beadPlateOptions.value.columnNum;
	createBlockByLine({rowNum, columnNum, gridSize,leftBase, topBase: 0})
}

function createBigEyeBlock() {
	const { blockWidth, blockHeight, rowNum, columnNum, gridSize } = bigEyeOptions.value;
	const leftBase = beadPlateOptions.value.gridSize * beadPlateOptions.value.columnNum;
	const topBase = bigRoadOptions.value.gridSize * bigRoadOptions.value.rowNum;
	createBlockByLine({rowNum, columnNum, gridSize,leftBase, topBase})
}

function createSmallRoadBlock() {
	const { blockWidth, blockHeight, rowNum, columnNum, gridSize } = smallRoadOptions.value;
	const leftBase = beadPlateOptions.value.gridSize * beadPlateOptions.value.columnNum;
	const topBase = bigEyeOptions.value.gridSize * bigEyeOptions.value.rowNum + bigRoadOptions.value.rowNum * bigRoadOptions.value.gridSize;
	createBlockByLine({rowNum, columnNum, gridSize,leftBase, topBase})
}

function createCockroachRoadBlock() {
	const { blockWidth, blockHeight, rowNum, columnNum, gridSize } = smallRoadOptions.value;
	const leftBase =
		beadPlateOptions.value.gridSize * beadPlateOptions.value.columnNum + smallRoadOptions.value.gridSize * smallRoadOptions.value.columnNum;
	const topBase = bigEyeOptions.value.gridSize * bigEyeOptions.value.rowNum + bigRoadOptions.value.rowNum * bigRoadOptions.value.gridSize;
	createBlockByLine({rowNum, columnNum, gridSize,leftBase, topBase})
}

// 画整个格子
function createMapPlaces() {
	createBeadPlateBlock();
	createBigRoadBlock();
	createBigEyeBlock();
	createSmallRoadBlock();
	createCockroachRoadBlock();
	// 将画出的格子 转换成 图片 再作为画布的背景图
	var canvasDataUrl = mainCanvas.value.toDataURL({
		format: 'png',
		quality: .8
	});
	mainCanvas.value.clear()
	mainCanvas.value.setBackgroundImage(canvasDataUrl, mainCanvas.value.renderAll.bind(mainCanvas.value), {
		originX: 'left',
		originY: 'top',
	});
}

function fillBeadPlateData(beadPlateMatrixData) {
	const { matrix } = beadPlateMatrixData;
	if (!matrix || matrix.length === 0) {
		return;
	}

	for (let i = 0; i < matrix.length; i++) {
		for (let j = 0; j < matrix[i].length; j++) {
			if (matrix[j] && matrix[j][i]) {
				const { winner, isPair, text } = matrix[j][i];

				// let alreadyExists = false;
        //         mainCanvas.value.forEachObject(obj => {
        //             if (
        //                 obj instanceof fabric.Circle &&
        //                 obj.radius ===20 &&
        //                 obj.top === j * 53.3 &&
        //                 obj.left === i * 53.3 &&
        //                 obj.width === 53.3 &&
        //                 obj.height === colorRec[winner]
        //             ) {
        //                 alreadyExists = true;
        //             }
        //         });

				// if(!alreadyExists){

					// 创建图形
					// const shape = new fabric.Circle({
					// 	radius: 20,
					// 	top: j * 53.3,
					// 	left: i * 53.3,
					// 	width: 53.3,
					// 	height: 53.3,
					// 	fill: colorRec[winner],
					// });
					// const winnerText = new fabric.Text(`${matrix[j][i].text}`);
					// winnerText.textAlign = 'center';
					// winnerText.textBaseline = 'middle';
					// winnerText.fill = '#fff';
					// winnerText.fontSize = '26';
					// winnerText.centerX = shape.left + shape.width / 2;
					// winnerText.centerY = shape.top + shape.height / 2;
					// winnerText.left = winnerText.centerX - winnerText.width / 2 + 7; // 设置了文本大小 修改位移
					// winnerText.top = winnerText.centerY - winnerText.height / 2 + 8;
					// mainCanvas.value.add(shape);
					// mainCanvas.value.add(winnerText);
					
					// 用图片代替
					winnerTextPaint({
						winner,
						top: j*54+4,
						left: i*54+3,
						width: 54,
						height: 54,
						gridSize: 54
					})

					// 检查 是否对子 庄对子/闲对子 位置左上角
					if (isPair.indexOf('Banker') >= 0) {
						// 闲家是对子
						const bankerPairCircle = new fabric.Circle({
							radius: 8,
							top: j * 54,
							left: i * 54,
							stroke: '#fff',
							strokeWidth: 2,
							fill: colorRec['Banker'],
						});
						mainCanvas.value.add(bankerPairCircle);
					}
	
					if (isPair.indexOf('Player') >= 0) {
						// 闲家是对子  位置右下角
						const playerPairCircle = new fabric.Circle({
							radius: 8,
							top: j * 54,
							left: i * 54,
							stroke: '#fff',
							strokeWidth: 2,
							fill: colorRec['Player'],
						});
						mainCanvas.value.add(playerPairCircle);
					}
				// }
			}
		}
	}
}

function fillBigRoadData(bigRoadMatrixData) {
	const { matrix, cols, rows } = bigRoadMatrixData;
	if (!matrix || matrix.length === 0) {
		return;
	}
	const baseLeft = beadPlateOptions.value.gridSize * beadPlateOptions.value.columnNum;
	const baseTop = 0;
	const { gridSize, columnNum, rowNum } = bigRoadOptions.value;
	for (let i = 0; i < matrix.length; i++) {
		for (let j = 0; j < matrix[i].length; j++) {
			const item = matrix[i][j];
			if (item) {
				let winner = item.winner;
				let isTie = item.isTie || false;
					// 创建图形
					const shape = new fabric.Circle({
						radius: 10,
						top: i * gridSize,
						left: j * gridSize + baseLeft,
						width: gridSize,
						height: gridSize,
						// strokeWidth: 2, // 圆环的宽度
						stroke: colorRec[winner], // 圆环的颜色
						fill: 'transparent', // 内部填充透明
					});
					mainCanvas.value.add(shape);
	
					// 添加 是否 有对子
					if (item.isPair) {
						if (item.isPair.indexOf('Banker') >= 0) {
							const bankerPairCircle = new fabric.Circle({
								radius: 5,
								top: i * 27,
								left: baseLeft + j * 27,
								stroke: '#fff',
								fill: colorRec['Banker'],
							});
							mainCanvas.value.add(bankerPairCircle);
						}
	
						if (item.isPair.indexOf('Player') >= 0) {
							const playerPairCircle = new fabric.Circle({
								radius: 5,
								top: shape.top + shape.height - 10,
								left: baseLeft + 27 * (j + 1) - 10,
								stroke: '#fff',
								fill: colorRec['Player'],
							});
							mainCanvas.value.add(playerPairCircle);
						}
					}
	
					// 如果有和局，添加和局标记
					if (isTie) {
						const tieText = new fabric.Text(`${item.tie_count}`, {
							fontSize: 16,
							fill: '#1d8919',
							left: shape.left + shape.width / 2 - 4,
							top: shape.top + shape.height / 2 - 9,
						});
						mainCanvas.value.add(tieText);
						// 计算线的起始和结束点
						const lineStartX = shape.left + shape.width / 2;
						const lineStartY = shape.top + shape.height;
						const lineEndX = shape.left + shape.width;
						const lineEndY = shape.top + shape.height / 2;
						const tieLine = new fabric.Line([lineStartX, lineStartY, lineEndX, lineEndY], {
							stroke: '#1d8919',
							strokeWidth: 2,
						});
						mainCanvas.value.add(tieLine);
					}
			}
		}
	}
}

function fillBigEyeRoadData(bigEyeMatrixData) {
	const { matrix, cols, rows } = bigEyeMatrixData;
	if (!matrix || matrix.length === 0) {
		return;
	}
	const baseLeft = beadPlateOptions.value.gridSize * beadPlateOptions.value.columnNum;
	const baseTop = bigRoadOptions.value.gridSize * bigRoadOptions.value.rowNum;
	for (let i = 0; i < matrix.length; i++) {
		for (let j = 0; j < matrix[i].length; j++) {
			const item = matrix[i][j];
			if (item) {
					const sharp = new fabric.Circle({
						radius: 5,
						top: baseTop + (i * 53) / 4,
						left: baseLeft + (j * 53) / 4,
						width: 53.3 / 4,
						height: 53.3 / 4,
						stroke: item.eyeColor,
						fill: 'transparent',
					});
					mainCanvas.value.add(sharp);
			}
		}
	}
}

function fillSmallRoadData(smallMatrixData) {
	const { matrix, cols, rows } = smallMatrixData;
	if (!matrix || matrix.length === 0) {
		return;
	}
	const baseLeft = beadPlateOptions.value.gridSize * beadPlateOptions.value.columnNum;
	const baseTop = bigRoadOptions.value.gridSize * bigRoadOptions.value.rowNum + bigEyeOptions.value.gridSize * bigEyeOptions.value.rowNum;
	for (let i = 0; i < matrix.length; i++) {
		for (let j = 0; j < matrix[i].length; j++) {
			const item = matrix[i][j];
			if (item) {
					const sharp = new fabric.Circle({
						radius: 5,
						top: baseTop + (i * 53) / 4,
						left: baseLeft + (j * 53) / 4,
						width: 53.3 / 4,
						height: 53.3 / 4,
						fill: item.smallRoadColor,
					});
					mainCanvas.value.add(sharp);
			}
		}
	}
}

function fillCockroachRoadData(CockroachRoadMatrixData) {
	const { matrix, cols, rows } = CockroachRoadMatrixData;
	if (!matrix || matrix.length === 0) {
		return;
	}
	const baseLeft =
		beadPlateOptions.value.gridSize * beadPlateOptions.value.columnNum + smallRoadOptions.value.gridSize * smallRoadOptions.value.columnNum;
	const baseTop = bigRoadOptions.value.gridSize * bigRoadOptions.value.rowNum + bigEyeOptions.value.gridSize * bigEyeOptions.value.rowNum;
	for (let i = 0; i < matrix.length; i++) {
		for (let j = 0; j < matrix[i].length; j++) {
			const item = matrix[i][j];
			if (item) {
					const sharp = new fabric.Circle({
						radius: 5,
						top: baseTop + (i * 53) / 4,
						left: baseLeft + (j * 53) / 4,
						width: 53.3 / 4,
						height: 53.3 / 4,
						fill: item.cockroachColor,
					});
					const lineStartX = sharp.left;
					const lineStartY = sharp.top + sharp.height * 0.8;
					const lineEndX = sharp.left + sharp.width * 0.8;
					const lineEndY = sharp.top;
					const line = new fabric.Line([lineStartX, lineStartY, lineEndX, lineEndY], {
						stroke: item.cockroachColor,
						strokeWidth: 2,
					});
					mainCanvas.value.add(line);
			}
		}
	}
}

function draw() {
	// roadMap.value.update()
	// 填入 珠盘图 矩阵数据
	roadMap.value && fillBeadPlateData(roadMap.value.breadplate);
	// 填入 大路图 数据
	roadMap.value && fillBigRoadData(roadMap.value.bigroad);
	// 填入 大眼图 数据
	roadMap.value && fillBigEyeRoadData(roadMap.value.bigeyeboy);
	// 填入 小路图 数据
	roadMap.value && fillSmallRoadData(roadMap.value.smallroad);
	// 填入 小强路 数据
	roadMap.value && fillCockroachRoadData(roadMap.value.cockroachPig);
}

function updateMapList(round_item) {
	if (round_item) {
		roadMap.value.push(round_item);
		roadMap.value.update();
		if (mainCanvas && mainCanvas.value) {
			mainCanvas.value.clear();
			draw();
		}
	}
}

function reDrawCanvas() {
	if (mainCanvas && mainCanvas.value) {
		mainCanvas.value.clear();
		createMapPlaces()
		draw();
	}
}

// let cachedCanvases = {};
onMounted(() => {
	mainCanvas.value = new fabric.StaticCanvas(document.querySelector(`[data-set='${mapId.value}']`))
	// 画格子
	createMapPlaces()

  // 初始化缓存对象

// // 获取Canvas元素的引用
// let canvasElement = document.querySelector(`[data-set='${mapId.value}']`);

// // 检查是否已经缓存了Canvas
// let cachedCanvas = cachedCanvases[mapId.value];

// if (!cachedCanvas) {
//     // 如果没有缓存，创建一个新的Canvas并缓存它
//     cachedCanvas = new fabric.StaticCanvas(canvasElement);
//     cachedCanvases[mapId.value] = cachedCanvas;
// } else {
//     // 如果已经缓存了Canvas，则清除原有内容
//     cachedCanvas.clear();
// }

// // 将Canvas放入mainCanvas的value中
// mainCanvas.value = cachedCanvas;

// 	nextTick(() => {
// 		init();
// 		draw();
// 	});
});

defineExpose({
	draw,
	init,
	reDrawCanvas,
	updateMapList,
});
</script>

<template>
	<canvas
		id="route-map"
		class="route-map"
		:data-set="mapId"
		width="864"
		height="324"
		:style="{
			width: width + 'px',
			height: height + 'px',
		}"
	></canvas>
</template>

<style scoped lang="less">
#route-map {
	will-change: transform;
	transform-origin: top left;
}
</style>


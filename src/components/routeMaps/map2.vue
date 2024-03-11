<script setup>
import { ref, onMounted, toRefs, watch, onBeforeMount, nextTick } from 'vue'
import { fabric } from 'fabric'
import RoadmapGenerator from './roadmapGenerator';
import { onUnmounted } from 'vue';

const props = defineProps({
  mapList: Array,
  mapId: String,
})

const { mapList, mapId } = toRefs(props)

const roadMap = ref()

const painted = ref(true)

watch(mapList, (val) => {
  if (mapList.value && Array.isArray(mapList.value)) {
    if (painted.value) {
      clear()
      init()
    }
  }
})

const mapListConvertedData = ref([])

// 保存所有画布上的元素，重绘画布时删除，减少缓存
const canvasCacheObj = ref([])

function init() {
  if (mapList.value.length) {
    mapListConvertedData.value = convertOriginalData()
    draw()
  }
}

// 转换原始数据
function convertOriginalData() {
  if (mapList.value.length) {
    let arr = new Array()
    for (let i in mapList.value) {
      if (mapList.value[i].original_data) {
        const original_data = JSON.parse(mapList.value[i].original_data)
        const winnerEnumInfo = enumInfoList.winner[original_data.winner_mark]
        const isPairEnumInfo = enumInfoList.pair[original_data.winner_pair_mark]
        arr.push({
          winner: winnerEnumInfo.name,
          isPair: isPairEnumInfo,
          color: colorRec[winnerEnumInfo.name],
          text: winnerEnumInfo.text,
        })
      }
    }
    return arr
  } else {
    return []
  }
}

// 设置 庄闲和对应的颜色
const colorRec = {
  "Player": "#2033d9",
  "Banker": "#d9202c",
  "Tie": "#21d924",
  "player": "#2033d9",
  "banker": "#d9202c",
  "tie": "#21d924",
}

const enumInfoList = {
  winner: {
    '1': {
      name: "Player",
      text: "闲",
    },
    "2": {
      name: "Tie",
      text: "和"
    },
    "3": {
      name: "Banker",
      text: "庄",
    }
  },
  "player": {
    text: "闲"
  },
  "banker": {
    text: "庄"
  },
  "tie": {
    text: "和"
  },
  pair: {
    "1": "", // 没有对子
    "2": "Player", // 闲家对子
    "3": "Banker", //庄家对子
    "4": "Player,Banker", // 庄家闲家都是对子
  }
}

const mainCanvas = ref(null)

// 珠盘路
const beadPlateRect = ref(null)
const beadPlateOptions = ref({
  rowNum: 6,
  columnNum: 6,
  gridSize: 54
})

// 大路
const bigRoadRect = ref(null)
const bigRoadOptions = ref({
  rowNum: 6,
  columnNum: 20,
  gridSize: 27
})

// 大眼路
const bigEyeRect = ref(null)
const bigEyeOptions = ref({
  rowNum: 3,
  columnNum: 20,
  gridSize: 27
})

// 小路
const smallRoadRect = ref(null)
const smallRoadOptions = ref({
  rowNum: 3,
  columnNum: 10,
  gridSize: 27
})

// 小强路
const cockroachRoadRect = ref(null)
const cockroachRoadOptions = ref({
  rowNum: 3,
  columnNum: 10,
  gridSize: 27
})

function createBeadPlateBlock() {
  const { blockWidth, blockHeight, rowNum, columnNum, gridSize } = beadPlateOptions.value
  for (let i = 0; i < rowNum; i++) {
    for (let j = 0; j < columnNum; j++) {
      mainCanvas.value.add(new fabric.Rect({
        left: j * gridSize,
        top: i * gridSize,
        fill: '#efefef',
        width: gridSize,
        height: gridSize,
        stroke: "#dedede",
      }))
    }
  }
}

function createBigRoadBlock() {
  const { blockWidth, blockHeight, rowNum, columnNum, gridSize } = bigRoadOptions.value
  const leftBase = beadPlateOptions.value.gridSize * beadPlateOptions.value.columnNum
  for (let i = 0; i < rowNum; i++) {
    for (let j = 0; j < columnNum; j++) {
      mainCanvas.value.add(new fabric.Rect({
        left: leftBase + j * gridSize,
        top: i * gridSize,
        fill: '#efefef',
        width: gridSize,
        height: gridSize,
        stroke: "#dedede",
      }))
    }
  }
}

function createBigEyeBlock() {
  const { blockWidth, blockHeight, rowNum, columnNum, gridSize } = bigEyeOptions.value
  const leftBase = beadPlateOptions.value.gridSize * beadPlateOptions.value.columnNum
  const topBase = bigRoadOptions.value.gridSize * bigRoadOptions.value.rowNum
  for (let i = 0; i < rowNum; i++) {
    for (let j = 0; j < columnNum; j++) {
      mainCanvas.value.add(new fabric.Rect({
        left: leftBase + j * gridSize,
        top: topBase + i * gridSize,
        fill: '#efefef',
        width: gridSize,
        height: gridSize,
        stroke: "#dedede",
      }))
    }
  }
}

function createSmallRoadBlock() {
  const { blockWidth, blockHeight, rowNum, columnNum, gridSize } = smallRoadOptions.value
  const leftBase = beadPlateOptions.value.gridSize * beadPlateOptions.value.columnNum
  const topBase = bigEyeOptions.value.gridSize * bigEyeOptions.value.rowNum + bigRoadOptions.value.rowNum * bigRoadOptions.value.gridSize
  for (let i = 0; i < rowNum; i++) {
    for (let j = 0; j < columnNum; j++) {
      mainCanvas.value.add(new fabric.Rect({
        left: leftBase + j * gridSize,
        top: topBase + i * gridSize,
        fill: '#efefef',
        width: gridSize,
        height: gridSize,
        stroke: "#dedede",
      }))
    }
  }
}

function createCockroachRoadBlock() {
  const { blockWidth, blockHeight, rowNum, columnNum, gridSize } = smallRoadOptions.value
  const leftBase = beadPlateOptions.value.gridSize * beadPlateOptions.value.columnNum + smallRoadOptions.value.gridSize * smallRoadOptions.value.columnNum
  const topBase = bigEyeOptions.value.gridSize * bigEyeOptions.value.rowNum + bigRoadOptions.value.rowNum * bigRoadOptions.value.gridSize
  for (let i = 0; i < rowNum; i++) {
    for (let j = 0; j < columnNum; j++) {
      mainCanvas.value.add(new fabric.Rect({
        left: leftBase + j * gridSize,
        top: topBase + i * gridSize,
        fill: '#efefef',
        width: gridSize,
        height: gridSize,
        stroke: "#dedede",
      }))
    }
  }
}


// 画整个格子
function createMapPlaces() {
  createBeadPlateBlock()
  createBigRoadBlock()
  createBigEyeBlock()
  createSmallRoadBlock()
  createCockroachRoadBlock()
}

function fillBeadPlateData(beadPlateMatrixData) {
  const matrix = beadPlateMatrixData
  // if (!matrix || matrix.length === 0) {
  //   return
  // }
  for (let i = 0; i < matrix.length; i++) {
    for (let j = 0; j < matrix[i].length; j++) {
      if (matrix[j] && matrix[j][i]) {
        const { winner, isPair, text } = matrix[j][i]
        // 创建图形
        const shape = new fabric.Circle({
          radius: 20,
          top: j * 53.3,
          left: i * 53.3,
          width: 53.3,
          height: 53.3,
          fill: colorRec[winner],
        });
        const winnerText = new fabric.Text(`${text}`)
        winnerText.textAlign = 'center';
        winnerText.textBaseline = 'middle';
        winnerText.fill = '#fff'
        winnerText.fontSize = '26'
        winnerText.centerX = shape.left + shape.width / 2
        winnerText.centerY = shape.top + shape.height / 2
        winnerText.left = winnerText.centerX - winnerText.width / 2 + 7 // 设置了文本大小 修改位移
        winnerText.top = winnerText.centerY - winnerText.height / 2 + 8
        mainCanvas.value.add(shape);
        mainCanvas.value.add(winnerText);
        canvasCacheObj.value.push(shape)
        canvasCacheObj.value.push(winnerText)
        // 检查 是否对子 庄对子/闲对子 位置左上角
        if (isPair.indexOf('Banker') >= 0) {
          // 闲家是对子
          const bankerPairCircle = new fabric.Circle({
            radius: 5,
            top: j * 53 + 6,
            left: i * 53 + 6,
            stroke: '#fff',
            fill: colorRec["Banker"]
          })
          mainCanvas.value.add(bankerPairCircle)
          canvasCacheObj.value.push(bankerPairCircle)
        }

        if (isPair.indexOf('Player') >= 0) {
          // 闲家是对子  位置右下角
          const playerPairCircle = new fabric.Circle({
            radius: 5,
            top: shape.top + shape.height - 16,
            left: shape.left + shape.width - 16,
            stroke: '#fff',
            fill: colorRec["Player"]
          })
          mainCanvas.value.add(playerPairCircle)
          canvasCacheObj.value.push(playerPairCircle)
        }
      }
    }
  }
}

function fillBigRoadData(bigRoadMatrixData) {
  const matrix = bigRoadMatrixData
  // if (!matrix || matrix.length === 0) {
  //   return;
  // }
  const baseLeft = beadPlateOptions.value.gridSize * beadPlateOptions.value.columnNum
  const baseTop = 0
  const { gridSize, columnNum, rowNum } = bigRoadOptions.value
  for (let i = 0; i < matrix.length; i++) {
    for (let j = 0; j < matrix[i].length; j++) {
      const item = matrix[i][j];
      if (item) {
        let winner = item.winner;
        let isTie = item.ties && item.ties.length > 0 || false;
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
        canvasCacheObj.value.push(shape)

        // 添加 是否 有对子
        if (item.isPair) {
          if (item.isPair.indexOf("Banker") >= 0) {
            const bankerPairCircle = new fabric.Circle({
              radius: 5,
              top: i * 27,
              left: baseLeft + j * 27,
              stroke: "#fff",
              fill: colorRec['Banker']
            })
            mainCanvas.value.add(bankerPairCircle)
            canvasCacheObj.value.push(bankerPairCircle)
          }

          if (item.isPair.indexOf("Player") >= 0) {
            const playerPairCircle = new fabric.Circle({
              radius: 5,
              top: shape.top + shape.height - 10,
              left: baseLeft + 27 * (j + 1) - 10,
              stroke: "#fff",
              fill: colorRec['Player']
            })
            mainCanvas.value.add(playerPairCircle)
            canvasCacheObj.value.push(playerPairCircle)
          }
        }

        // 如果有和局，添加和局标记
        if (isTie) {
          const ties = item.ties
          const tieText = new fabric.Text(`${ties.length}`, {
            fontSize: 16,
            fill: '#1d8919',
            left: shape.left + shape.width / 2 - 4,
            top: shape.top + shape.height / 2 - 9
          });
          mainCanvas.value.add(tieText)
          canvasCacheObj.value.push(tieText)
          // 计算线的起始和结束点
          const lineStartX = shape.left + shape.width / 2;
          const lineStartY = shape.top + shape.height;
          const lineEndX = shape.left + shape.width;
          const lineEndY = shape.top + shape.height / 2;
          const tieLine = new fabric.Line([lineStartX, lineStartY, lineEndX, lineEndY], {
            stroke: "#1d8919",
            strokeWidth: 2
          });
          mainCanvas.value.add(tieLine);
          canvasCacheObj.value.push(tieLine)
        }
      }
    }
  }
}

function fillBigEyeRoadData(bigEyeMatrixData) {
  const baseLeft = beadPlateOptions.value.gridSize * beadPlateOptions.value.columnNum
  const baseTop = bigRoadOptions.value.gridSize * bigRoadOptions.value.rowNum
  for (let i = 0; i < bigEyeMatrixData.length; i++) {
    for (let j = 0; j < bigEyeMatrixData[i].length; j++) {
      const item = bigEyeMatrixData[i][j]
      if (item) {
        const sharp = new fabric.Circle({
          radius: 5,
          top: baseTop + i * 53 / 4,
          left: baseLeft + j * 53 / 4,
          width: 53.3 / 4,
          height: 53.3 / 4,
          stroke: item,
          fill: 'transparent',
        })
        mainCanvas.value.add(sharp)
        canvasCacheObj.value.push(sharp)
      }
    }
  }
}

function fillSmallRoadData(smallMatrixData) {
  const baseLeft = beadPlateOptions.value.gridSize * beadPlateOptions.value.columnNum
  const baseTop = bigRoadOptions.value.gridSize * bigRoadOptions.value.rowNum + bigEyeOptions.value.gridSize * bigEyeOptions.value.rowNum
  for (let i = 0; i < smallMatrixData.length; i++) {
    for (let j = 0; j < smallMatrixData[i].length; j++) {
      const item = smallMatrixData[i][j]
      if (item) {
        const sharp = new fabric.Circle({
          radius: 5,
          top: baseTop + i * 53 / 4,
          left: baseLeft + j * 53 / 4,
          width: 53.3 / 4,
          height: 53.3 / 4,
          fill: item
        })
        mainCanvas.value.add(sharp)
        canvasCacheObj.value.push(sharp)
      }
    }
  }
}

function fillCockroachRoadData(CockroachRoadMatrixData) {
  const baseLeft = beadPlateOptions.value.gridSize * beadPlateOptions.value.columnNum + smallRoadOptions.value.gridSize * smallRoadOptions.value.columnNum
  const baseTop = bigRoadOptions.value.gridSize * bigRoadOptions.value.rowNum + bigEyeOptions.value.gridSize * bigEyeOptions.value.rowNum
  for (let i = 0; i < CockroachRoadMatrixData.length; i++) {
    for (let j = 0; j < CockroachRoadMatrixData[i].length; j++) {
      const item = CockroachRoadMatrixData[i][j]
      if (item) {
        const sharp = new fabric.Circle({
          radius: 5,
          top: baseTop + i * 53 / 4,
          left: baseLeft + j * 53 / 4,
          width: 53.3 / 4,
          height: 53.3 / 4,
          fill: item
        })
        const lineStartX = sharp.left
        const lineStartY = sharp.top + sharp.height * .8
        const lineEndX = sharp.left + sharp.width * .8
        const lineEndY = sharp.top
        const line = new fabric.Line([lineStartX, lineStartY, lineEndX, lineEndY], {
          stroke: item,
          strokeWidth: 2,
        });
        mainCanvas.value.add(line)
        canvasCacheObj.value.push(line)
      }
    }
  }
}

function convertGeneralResultsList(results) {
  let arr = new Array()
  const copyArr = JSON.parse(JSON.stringify(mapList.value))
  for (let i in copyArr) {
    if (copyArr[i].original_data) {
      const original_data = JSON.parse(copyArr[i].original_data)
      const winnerEnumInfo = enumInfoList.winner[original_data.winner_mark]
      const isPairEnumInfo = enumInfoList.pair[original_data.winner_pair_mark]
      arr.push({
        winner: winnerEnumInfo.name,
        isPair: isPairEnumInfo,
        color: colorRec[winnerEnumInfo.name],
        text: winnerEnumInfo.text,
        outcome: winnerEnumInfo.name.toLocaleLowerCase(),
        natural: "none",
        pair: enumInfoList.pair[copyArr[i].winner_pair_mark] || "none"
      })
    }
  }
  return arr
}

function convertToMatrix(dataList) {
  let matrix = [];
  let currentColor = '';
  let currentColumn = -1;

  for (let item of dataList) {
    if (item !== currentColor || matrix[currentColumn]?.length === 6) {
      currentColor = item;
      currentColumn++;
      matrix[currentColumn] = [];
    }

    matrix[currentColumn].push(item);
  }

  matrix = matrix.map(column => {
    while (column.length < 6) {
      column.push("");
    }
    return column;
  });

  let result = [];
  for (let i = 0; i < 6; i++) {
    result[i] = [];
    for (let j = 0; j < matrix.length; j++) {
      result[i][j] = matrix[j][i];
    }
  }

  return result;
}

function draw() {
  const timer1 = +new Date()
  const roadmapGenerator = new RoadmapGenerator();
  // 画格子
  createMapPlaces()
  // 处理数据
  const lastResultList = convertGeneralResultsList()
  const beadPlateList = new Array(6).fill(0).map(() => new Array(6).fill(0))
  const lastBeadPlateData = roadmapGenerator.beadPlate(lastResultList, { columns: 6, rows: 6 })
  for (let i in lastBeadPlateData) {
    const { column, row, result } = lastBeadPlateData[i]
    beadPlateList[row][column] = result
  }
  // 填入 珠盘图 矩阵数据
  fillBeadPlateData(beadPlateList)

  // 填入 大路图 数据
  const lastBigRoadData = roadmapGenerator.bigRoad(lastResultList, { columns: 20, rows: 6 })
  const bigRoadList = new Array(6).fill(0).map(() => new Array(20).fill(0))
  for (let i in lastBigRoadData) {
    const { column, row, result, ties } = lastBigRoadData[i]
    bigRoadList[row][column] = {
      ...result,
      ties
    }
  }
  fillBigRoadData(bigRoadList)

  // 填入 大眼图 数据
  const lastBigEyeReuslt = roadmapGenerator.bigEyeRoad(roadmapGenerator.bigRoad(lastResultList, { columns: 40, rows: 6, scroll: false }))
  fillBigEyeRoadData(convertToMatrix(lastBigEyeReuslt))

  // 填入 小路
  const lastSmallReuslt = roadmapGenerator.smallRoad(roadmapGenerator.bigRoad(lastResultList, { columns: 40, rows: 6, scroll: false }))
  fillSmallRoadData(convertToMatrix(lastSmallReuslt))

  // 填入 小强路
  const lastCockroachReuslt = roadmapGenerator.cockroachPig(roadmapGenerator.bigRoad(lastResultList, { columns: 40, rows: 6, scroll: false }))
  fillCockroachRoadData(convertToMatrix(lastCockroachReuslt))
}

function reDrawCanvas() {
  if (mainCanvas && mainCanvas.value) {
    mainCanvas.value.clear()
    draw()
  }
}

function drawRouteBg() {
  if (mainCanvas && mainCanvas.value) {
    createMapPlaces()
  }
}

function dispose() {
  if (mainCanvas && mainCanvas.value) {
    mainCanvas.value.dispose()
  }
}

function clear() {
  if (mainCanvas && mainCanvas.value) {
    mainCanvas.value.clear()
    if (canvasCacheObj.value && canvasCacheObj.value.length) {
      for (let obj in canvasCacheObj.value) {
        mainCanvas.value && mainCanvas.valueNaNpxove(mainCanvas.value[obj])
      }
      createMapPlaces()
    }
  }
}

onMounted(() => {
  // mainCanvas.value = new fabric.Canvas(document.querySelector(`[data-set='${mapId.value}']`))
  mainCanvas.value = new fabric.StaticCanvas(document.querySelector(`[data-set='${mapId.value}']`))
  painted.value = false
  nextTick(() => {
    clear()
    init()
    draw()
    painted.value = true
  })
})

onUnmounted(() => {
  mapList.value = []
  clear()
  dispose()
})

defineExpose({
  draw,
  clear,
  dispose,
  reDrawCanvas,
  drawRouteBg
})

</script>

<template>
  <canvas id="route-map" class="route-map" :data-set="mapId" width="864" height="324"></canvas>
</template>

<style scoped lang="less">
#route-map {
  will-change: transform;
  transform-origin: top left;
}
</style>

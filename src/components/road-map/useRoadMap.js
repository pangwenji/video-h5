import { useDrawCanvas } from '@/hook/useDrawCanvas.js';

const {
	drawRect,
	drawCirclePie,
	drawText,
	drawCircle,
	drawDiagonalLines,
	drawTopLine,
	drawAnnotation,
	drawBottomLine,
	drawCircles,
	drawSpecialRect,
} = useDrawCanvas();
export const useRoadMap = () => {
	const setDrawArgument = (ctx, i, j, gridSize, mark, duiZi) => {
		// 闲赢
		if (mark === 1) {
			drawCirclePie(j * gridSize + gridSize / 2, i * gridSize + gridSize / 2, gridSize / 2 - 5, 'blue', ctx);
			drawText(ctx, 'P', 40, 500, j * gridSize + gridSize / 2, i * gridSize + gridSize / 2 + 5, '#ffffff');
			if (duiZi === 1 || duiZi === 4) {
				drawCirclePie(j * gridSize + gridSize / 2 - 20, i * gridSize + gridSize / 2 - 20, (gridSize / 2 - 15) / 4, 'red', ctx);
			}
			// 和局
		} else if (mark === 2) {
			drawCirclePie(j * gridSize + gridSize / 2, i * gridSize + gridSize / 2, gridSize / 2 - 5, 'green', ctx);
			drawText(ctx, 'T', 40, 500, j * gridSize + gridSize / 2, i * gridSize + gridSize / 2 + 5, '#ffffff');
			// 庄赢
		} else if (mark === 3) {
			drawCirclePie(j * gridSize + gridSize / 2, i * gridSize + gridSize / 2, gridSize / 2 - 5, 'red', ctx);
			drawText(ctx, 'B', 40, 500, j * gridSize + gridSize / 2, i * gridSize + gridSize / 2 + 5, '#ffffff');
			if (duiZi === 3 || duiZi === 4) {
				drawCirclePie(j * gridSize + gridSize / 2 - 20, i * gridSize + gridSize / 2 - 20, (gridSize / 2 - 15) / 4, 'red', ctx);
			}
		}
	};

	const drawZhuZai = (ctx, i, j, gridSize, array) => {
		array.forEach((element, index) => {
			const mark = element.original_info.winner_mark;
			const duiZi = element.winner_pair_mark;
			if (i === 0 && j === 0 && index === 0) {
				setDrawArgument(ctx, i, j, gridSize, mark, duiZi);
			}
			if (i === 1 && j === 0 && index === 1) {
				setDrawArgument(ctx, i, j, gridSize, mark, duiZi);
			}
			if (i === 2 && j === 0 && index === 2) {
				setDrawArgument(ctx, i, j, gridSize, mark, duiZi);
			}
			if (i === 3 && j === 0 && index === 3) {
				setDrawArgument(ctx, i, j, gridSize, mark, duiZi);
			}
			if (i === 4 && j === 0 && index === 4) {
				setDrawArgument(ctx, i, j, gridSize, mark, duiZi);
			}
			if (i === 5 && j === 0 && index === 5) {
				setDrawArgument(ctx, i, j, gridSize, mark, duiZi);
			}
			if(j === 1 && i === 0 && index === 6){
				setDrawArgument(ctx, i, j, gridSize, mark, duiZi);
			}
		});
	};


	// 绘制大路
	const drawCanvasLeft = (canvasLeftRef, array) => {
		console.log(array, 'shuju ');
		const canvas = canvasLeftRef.value;
		if (canvas) {
			const gridSize = canvas.height / 6;
			const ctx = canvas.getContext('2d');
			for (let i = 0; i < 6; i++) {
				for (let j = 0; j < 5; j++) {
					//画方格
					drawRect(ctx, j, i, gridSize, 'transparent');

					drawZhuZai(ctx, i, j, gridSize, array);
					//  // 画圆饼
					// drawCirclePie(j * gridSize + gridSize / 2, i * gridSize + gridSize / 2, gridSize / 2 - 5, 'blue', ctx);

					// // 圆内文字
					// drawText(ctx, 'P', 40, 500, j * gridSize + gridSize / 2, i * gridSize + gridSize / 2 + 5, '#ffffff');

					// // 画左上角小圆
					// drawCirclePie(j * gridSize + gridSize / 2 - 20, i * gridSize + gridSize / 2 - 20, (gridSize / 2 - 15) / 4, 'red', ctx);

					// // 画右下角小圆
					//  drawCirclePie(j * gridSize + gridSize / 2 + 20, i * gridSize + gridSize / 2 + 20, (gridSize / 2 - 15) / 4, 'yellow', ctx);
				}
			}
		}
	};

	// 大眼路
	const drawCanvasRightTop = (canvasRightTopRef) => {
		const canvas = canvasRightTopRef.value;
		if (canvas) {
			const gridSize = canvas.width / 22;
			const ctx = canvas.getContext('2d');
			for (let i = 0; i < 6; i++) {
				for (let j = 0; j < 22; j++) {
					//画方格
					drawRect(ctx, j, i, gridSize, 'transparent');

					// 画圈
					drawCircle(j * gridSize + gridSize / 2, i * gridSize + gridSize / 2, gridSize / 2 - 6, 'blue', ctx);

					// 圆内文字
					drawText(ctx, '1', 30, 500, j * gridSize + gridSize / 2, i * gridSize + gridSize / 2 + 5, 'green');

					// 画左上角小圆
					drawCirclePie(j * gridSize + gridSize / 2 - 12, i * gridSize + gridSize / 2 - 14, (gridSize / 2 - 5) / 4, 'red', ctx);

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
					drawCirclePie(j * gridSize + gridSize / 2 + 14, i * gridSize + gridSize / 2 + 12, (gridSize / 2 - 5) / 4, 'blue', ctx);
				}
			}
		}
	};

	// 小路
	const drawCanvasRightMiddle = (canvasRightMiddleRef) => {
		const canvas = canvasRightMiddleRef.value;
		if (canvas) {
			const gridSize = canvas.width / 22;
			const ctx = canvas.getContext('2d');
			for (let i = 0; i < 3; i++) {
				for (let j = 0; j < 22; j++) {
					//画方格
					drawRect(ctx, j, i, gridSize, 'transparent');
					// 画四个小圈
					for (let k = 0; k < 4; k++) {
						let circleX = j * gridSize + gridSize / 4 + ((k % 2) * gridSize) / 2;
						let circleY = i * gridSize + gridSize / 4 + (Math.floor(k / 2) * gridSize) / 2;

						drawCircle(circleX, circleY, gridSize / 6, 'blue', ctx);
					}
				}
			}
		}
	};

	//小路
	const drawCanvasBottomLeft = (canvasBottomLeftRef) => {
		const canvas = canvasBottomLeftRef.value;
		if (canvas) {
			const gridSize = canvas.width / 11;
			const ctx = canvas.getContext('2d');
			for (let i = 0; i < 3; i++) {
				for (let j = 0; j < 11; j++) {
					//画方格
					drawRect(ctx, j, i, gridSize, 'transparent');

					// 画四个圆饼
					for (let k = 0; k < 4; k++) {
						let circleX = j * gridSize + gridSize / 4 + ((k % 2) * gridSize) / 2;
						let circleY = i * gridSize + gridSize / 4 + (Math.floor(k / 2) * gridSize) / 2;
						drawCirclePie(circleX, circleY, gridSize / 6, 'blue', ctx);
					}
				}
			}
		}
	};

	const drawDiagonalLine = (canvasBottomRightRef) => {
		const canvas = canvasBottomRightRef.value;
		if (canvas) {
			const gridSize = canvas.width / 11;
			const ctx = canvas.getContext('2d');
			for (let i = 0; i < 3; i++) {
				for (let j = 0; j < 11; j++) {
					//画方格
					drawRect(ctx, j, i, gridSize, 'transparent');

					// 左上角
					drawDiagonalLines(
						ctx,
						2,
						j * gridSize + gridSize / 8 / 2,
						i * gridSize + gridSize / 2,
						j * gridSize + gridSize / 2 - 4,
						i * gridSize + gridSize / 10,
						'blue'
					);

					// 左下角斜线
					drawDiagonalLines(
						ctx,
						2,
						j * gridSize + gridSize / 10 / 2,
						i * gridSize + gridSize,
						j * gridSize + gridSize / 2 - 3,
						i * gridSize + gridSize / 2 + 5,
						'orange'
					);
					// 右上角斜线
					drawDiagonalLines(
						ctx,
						2,
						j * gridSize + gridSize / 2 + 2,
						i * gridSize + gridSize / 2,
						j * gridSize + gridSize - 4,
						i * gridSize + gridSize / 14,
						'blue'
					);

					// 右下角斜线
					drawDiagonalLines(
						ctx,
						2,
						j * gridSize + gridSize / 2,
						i * gridSize + gridSize,
						j * gridSize + gridSize,
						i * gridSize + gridSize / 2,
						'red'
					);
				}
			}
		}
	};

	return {
		drawCanvasLeft,
		drawCanvasRightTop,
		drawCanvasRightMiddle,
		drawCanvasBottomLeft,
		drawDiagonalLine,
	};
};


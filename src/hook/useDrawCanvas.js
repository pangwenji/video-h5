export const useDrawCanvas = () => {
	/**
	 *
	 * @param ctx
	 * @param j
	 * @param i
	 * @param gridSize
	 * @param fillStyle
	 */
	const drawRect = (ctx, j, i, gridSize, fillStyle) => {
		const x = j * gridSize; // 计算方格左上角 x 坐标
		const y = i * gridSize; // 计算方格左上角 y 坐标
		ctx.strokeStyle = '#cccccc';
		ctx.fillStyle = fillStyle;
		// 使用 fillRect 方法绘制方格
		ctx.fillRect(x, y, gridSize, gridSize);
		// 使用 strokeRect 方法画边框
		ctx.strokeRect(x, y, gridSize, gridSize);
		ctx.lineWidth = 1;
	};

	const drawTopLeftCorner = (ctx, i, j, gridSize) => {
		const x = j * gridSize; // 计算方格左上角 x 坐标
		const y = i * gridSize; // 计算方格左上角 y 坐标
		const cornerRadius = 10; // 圆角的半径
		ctx.fillStyle = 'red';
		ctx.strokeStyle = '#ccc';
		ctx.beginPath();
		ctx.moveTo(x + cornerRadius, y);
		ctx.arcTo(x, y, x, y + cornerRadius, cornerRadius);
		ctx.lineTo(x, y + gridSize);
		ctx.lineTo(x + gridSize, y + gridSize);
		ctx.lineTo(x + gridSize, y + cornerRadius);
		ctx.arcTo(x + gridSize, y, x + cornerRadius, y, 0);
		ctx.closePath();
		ctx.fill();
		ctx.stroke();
		ctx.lineWidth = 1;
	};

	const drawBottomLeftCorner = (ctx, i, j, gridSize) => {
		const x = j * gridSize; // 计算方格左上角 x 坐标
		const y = i * gridSize; // 计算方格左上角 y 坐标
		const cornerRadius = 10; // 圆角的半径
		ctx.fillStyle = 'blue';
		ctx.strokeStyle = '#ccc';
		ctx.beginPath();
		ctx.moveTo(x + cornerRadius, y);
		ctx.arcTo(x + gridSize, y, x + gridSize, y + gridSize, 0);
		ctx.arcTo(x + gridSize, y + gridSize, x, y + gridSize, 0);
		ctx.arcTo(x, y + gridSize, x, y, cornerRadius);
		ctx.arcTo(x, y, x + gridSize, y, 0);
		ctx.closePath();
		ctx.fill();
		ctx.stroke();
		ctx.lineWidth = 1;
	};

	const drawSpecialRect = (ctx, i, j, gridSize, color, type) => {
		const x = j * gridSize; // 计算方格左上角 x 坐标
		const y = i * gridSize; // 计算方格左上角 y 坐标
		// 创建线性渐变对象
		const gradient = ctx.createLinearGradient(x, y, x, y + gridSize);
		if (type === 'top') {
			// 底部颜色
			gradient.addColorStop(0, color);
			// 顶部颜色
			gradient.addColorStop(1, 'white');
		} else {
			gradient.addColorStop(1, color); // 顶部颜色
			gradient.addColorStop(0, 'white'); // 底部颜色
		}

		ctx.strokeStyle = '#ccc';
		ctx.fillStyle = gradient;
		// 使用 fillRect 方法绘制方格
		ctx.fillRect(x, y, gridSize, gridSize);
		// 使用 strokeRect 方法画边框
		ctx.strokeRect(x, y, gridSize, gridSize);
		ctx.lineWidth = 1;
	};

	/**
	 *
	 * @param x 横坐标
	 * @param y 纵坐标
	 * @param r 半径
	 * @param color 圆的颜色
	 * @param ctx 画布
	 */
	const drawCirclePie = (x, y, r, color, ctx) => {
		ctx.beginPath();
		ctx.arc(x, y, r, 0, 2 * Math.PI);
		// 填充颜色
		ctx.fillStyle = color;
		// 填充
		ctx.fill();
		// 边缘的颜色
		ctx.strokeStyle = color;
		// 边缘大小
		ctx.lineWidth = 2;
		ctx.stroke();
	};

	// 画文字
	/**
	 *
	 * @param text          文字内容
	 * @param fontSize      文字大小
	 * @param fontWeigh     文字比重
	 * @param x             横坐标
	 * @param y               纵坐标
	 * @param color          文字颜色
	 * @param ctx 画布
	 */
	const drawText = (ctx, text, fontSize, fontWeigh, x, y, color) => {
		ctx.fillStyle = color;
		ctx.font = `${fontWeigh} ${fontSize}px Arial`;
		ctx.textAlign = 'center';
		ctx.textBaseline = 'middle';
		ctx.fillText(text, x, y);
	};

	/**
	 *
	 * @param x 横坐标
	 * @param y 纵坐标
	 * @param r 半径
	 * @param color 圆的颜色
	 * @param ctx 画布
	 */
	const drawCircle = (x, y, r, color, ctx) => {
		ctx.beginPath();
		ctx.arc(x, y, r, 0, 2 * Math.PI);
		// 边缘的颜色
		ctx.strokeStyle = color;
		// 边缘大小
		ctx.lineWidth = 2;
		ctx.stroke();
	};

	// 画斜线

	/**
	 *
	 * @param ctx       画布
	 * @param lineWidth 线宽
	 * @param startX    开始点 X 坐标
	 * @param startY    开始点 Y 坐标
	 * @param endX      结束点 X 坐标
	 * @param endY      结束点 Y 坐标
	 * @param color     线的颜色
	 */
	const drawDiagonalLines = (
		ctx,
		lineWidth,
		startX,
		startY,
		endX,
		endY,
		color
	) => {
		ctx.strokeStyle = color;
		ctx.lineWidth = lineWidth;
		// 开始绘制
		ctx.beginPath();
		// 起点坐标 (x, y)
		ctx.moveTo(startX, startY);
		// 终点坐标 (x, y)
		ctx.lineTo(endX, endY);
		// 执行绘制
		ctx.stroke();
		ctx.closePath();
	};

	// // 手动画方框
	// const drawCustomRect = (
	// 	i,
	// 	j,
	// 	ctx: CanvasRenderingContext2D,
	// 	gridSize,
	// 	lineColor: lineColorType,
	// 	lineWidth: lineWidthType
	// ) => {
	// 	// 计算方格左上角 x 坐标
	// 	const x = j * gridSize;
	// 	// 计算方格左上角 y 坐标
	// 	const y = i * gridSize;

	// 	ctx.strokeStyle = lineColor.top;
	// 	ctx.beginPath();
	// 	ctx.moveTo(x, y);
	// 	ctx.lineTo(x + gridSize, y);
	// 	ctx.lineWidth = lineWidth.top;
	// 	ctx.stroke();

	// 	ctx.beginPath();
	// 	ctx.moveTo(x + gridSize, y);
	// 	ctx.lineTo(x + gridSize, y + gridSize);
	// 	ctx.strokeStyle = lineColor.right;
	// 	ctx.closePath();
	// 	ctx.lineWidth = lineWidth.right;
	// 	ctx.stroke();

	// 	ctx.beginPath();
	// 	ctx.moveTo(x + gridSize, y + gridSize);
	// 	ctx.lineTo(x, y + gridSize);
	// 	ctx.strokeStyle = lineColor.bottom;
	// 	ctx.closePath();
	// 	ctx.lineWidth = lineWidth.bottom;
	// 	ctx.stroke();

	// 	ctx.beginPath();
	// 	ctx.moveTo(x, y + gridSize);
	// 	ctx.lineTo(x, y);
	// 	ctx.strokeStyle = lineColor.left;
	// 	ctx.closePath();
	// 	ctx.lineWidth = lineWidth.left;
	// 	ctx.stroke();
	// };

	const drawTopLine = (ctx, canvas, gridSize) => {
		ctx.strokeStyle = 'red'; // 边框颜色
		// 绘制带有圆角的方框
		const cornerRadius = 10;
		const width = canvas.width;
		ctx.beginPath();
		ctx.moveTo(0, gridSize);
		ctx.arcTo(0, 0, gridSize, 0, cornerRadius);
		ctx.lineTo(width - cornerRadius, 0);
		ctx.arcTo(width, 0, width, gridSize, cornerRadius);
		ctx.lineTo(width, gridSize);
		ctx.lineWidth = 6;
		ctx.stroke();
	};

	const drawBottomLine = (ctx, canvas, gridSize) => {
        ctx.strokeStyle = 'blue'; // 边框颜色
        // 绘制带有圆角的方框
        const cornerRadius = 10;
        const width = canvas.width;
        const height = 2* gridSize;
    
        ctx.beginPath();
        ctx.moveTo(width, gridSize);
    
        // 右下角圆度
        ctx.arcTo(width, height, width - gridSize, height, cornerRadius);
    
        ctx.lineTo(gridSize, height);
    
        // 左下角圆度
        ctx.arcTo(0, height, 0, height - gridSize, cornerRadius);
    
        ctx.lineTo(0, gridSize);
        ctx.lineWidth = 4;
        ctx.stroke();
	};

	const drawCircles = (ctx, j, i, gridSize, color, text) => {
		drawCirclePie(j * gridSize + gridSize / 2, i * gridSize + gridSize / 2 - 30, gridSize / 2 - 12, color, ctx);
		drawText(ctx, text, 30, 500, j * gridSize + gridSize / 2, i * gridSize + gridSize / 2 - 28, '#ffffff');
	};

	const drawAnnotation = (ctx, i, j, gridSize) => {
		if (i === 0 && j === 0) {
			drawTopLeftCorner(ctx, i, j, gridSize);
			drawText(ctx, '庄', 36, 500, j * gridSize + gridSize / 2, i * gridSize + gridSize / 2 - 4, '#ffffff');
			drawText(ctx, 'BANKER', 12, 400, j * gridSize + gridSize / 2, i * gridSize + gridSize / 2 + 20, '#ffffff');
		}
		if (i === 1 && j === 0) {
			drawBottomLeftCorner(ctx, i, j, gridSize);
			drawText(ctx, '闲', 36, 500, j * gridSize + gridSize / 2, i * gridSize + gridSize / 2 - 4, '#ffffff');
			drawText(ctx, 'PLAYER', 12, 400, j * gridSize + gridSize / 2, i * gridSize + gridSize / 2 + 20, '#ffffff');
		}
	};

	return {
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
	};
};


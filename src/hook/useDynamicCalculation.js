
export const useDynamicCalculation = () => {
	const calculationCanvas = (
        canvasItem, 
        canvasLeftArg, 
        canvasRightTopArg,
        canvasRightMiddleArg, 
        canvasRightBottomLeftArg, 
        canvasRightBottomRightArg
        ) => {
		// 计算珠仔路宽高
        const zhuZaiHeight = canvasItem?.height ;
		const zhuZaiWidth = zhuZaiHeight ;
		canvasLeftArg.value.width = zhuZaiWidth;
		canvasLeftArg.value.height = zhuZaiHeight ;
		canvasLeftArg.value.canvasWidth = zhuZaiWidth * 3;
		canvasLeftArg.value.canvasHeight = zhuZaiHeight * 3;

        // 计算 主路宽 高 
        const daLuWidth  =  (zhuZaiHeight/12)*20;
        const height = canvasItem?.height  / 4 
        canvasRightTopArg.value.width = daLuWidth;
        canvasRightTopArg.value.height =   height *2;
        canvasRightTopArg.value.canvasWidth =  daLuWidth * 3;
        canvasRightTopArg.value.canvasHeight = canvasRightTopArg.value.height * 3;

         // 计算大眼路 
        canvasRightMiddleArg.value.width = daLuWidth;
        canvasRightMiddleArg.value.height = height;
        canvasRightMiddleArg.value.canvasWidth = daLuWidth * 3;
        canvasRightMiddleArg.value.canvasHeight = height * 3;

        // 计算 小路
        canvasRightBottomLeftArg.value.width =  daLuWidth / 2 ;
        canvasRightBottomLeftArg.value.height = height;

        canvasRightBottomLeftArg.value.canvasWidth =  (daLuWidth / 2) * 3 ;
        canvasRightBottomLeftArg.value.canvasHeight = height * 3;

        // 计算小强路
        canvasRightBottomRightArg.value.width = daLuWidth / 2;
        canvasRightBottomRightArg.value.height = height;

        canvasRightBottomRightArg.value.canvasWidth =  (daLuWidth / 2) * 3 ;
        canvasRightBottomRightArg.value.canvasHeight = height * 3;

	};

	return {
		calculationCanvas,
	};
};


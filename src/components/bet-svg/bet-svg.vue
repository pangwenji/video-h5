<template>
	<div>
		<svg width="64" height="64" class="svg-chip">
			<g data-v-6c52f977="" transform="translate(12,12)" class="">
				<g style="transform: translate(17.5px, 37.5px) translate(-30px, -15px) rotateX(60deg)">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 60 60"
						width="60"
						height="60"
						preserveAspectRatio="xMidYMid meet"
						style="width: 100%; height: 100%; transform: translate3d(0px, 0px, 0px)"
					>
						<defs>
							<clipPath id="__lottie_element_261"><rect width="60" height="60" x="0" y="0"></rect></clipPath>
						</defs>
						<g clip-path="url(#__lottie_element_261)">
							<g transform="matrix(1,0,0,1,30,30)" opacity="1" :style="{ display: out_circle ? 'block' : 'none' }">
								<g opacity="1" transform="matrix(1,0,0,1,0,0)">
									<path
										stroke-linecap="butt"
										stroke-linejoin="miter"
										fill-opacity="0"
										stroke-miterlimit="4"
										stroke="rgb(211,178,122)"
										stroke-opacity="1"
										stroke-width="3.3333333333333335"
										d=" M0,-19.565217971801758 C10.798044204711914,-19.565217971801758 19.565217971801758,-10.798044204711914 19.565217971801758,0 C19.565217971801758,10.798044204711914 10.798044204711914,19.565217971801758 0,19.565217971801758 C-10.798044204711914,19.565217971801758 -19.565217971801758,10.798044204711914 -19.565217971801758,0 C-19.565217971801758,-10.798044204711914 -10.798044204711914,-19.565217971801758 0,-19.565217971801758z"
									></path>
								</g>
							</g>
							<g transform="matrix(1,0,0,1,30,30)" opacity="1" :style="{ display: inter_circle ? 'block' : 'none' }">
								<g opacity="1" transform="matrix(1,0,0,1,0,0)">
									<path
										stroke-linecap="butt"
										stroke-linejoin="miter"
										fill-opacity="0"
										stroke-miterlimit="4"
										stroke="rgb(255,235,199)"
										stroke-opacity="1"
										stroke-width="4.090909090909091"
										d=" M0,-11.739130020141602 C6.47882604598999,-11.739130020141602 11.739130020141602,-6.47882604598999 11.739130020141602,0 C11.739130020141602,6.47882604598999 6.47882604598999,11.739130020141602 0,11.739130020141602 C-6.47882604598999,11.739130020141602 -11.739130020141602,6.47882604598999 -11.739130020141602,0 C-11.739130020141602,-6.47882604598999 -6.47882604598999,-11.739130020141602 0,-11.739130020141602z"
									></path>
								</g>
							</g>
						</g>
					</svg>
				</g>

				<image x="0" v-for="item in listChip" :y="item.valueY" width="35" height="23" :xlink:href="setImage(item.label)"></image>
				<rect x="-6.380859375" y="7" rx="4" ry="4" width="47.76171875" height="16" class="highlight-rext" v-if="total > 0"></rect>
				<text x="17.5" y="20" text-anchor="middle" font-size="12px" class="highlight-text" v-if="total > 0">{{ total }}</text>
			</g>
		</svg>
	</div>
</template>
<script setup>
import { defineProps, watch, ref, onMounted, defineExpose, watchEffect } from 'vue';


import {  useTableStore } from '@/store';
const props = defineProps({
	chip: Number,
});

let total = ref(0);
let newValueY = [26, 19, 12, 5];

const out_circle = ref(false);

const inter_circle = ref(false);

const useTables = useTableStore();

const listChip = ref([])

const betChips = ref([]);

const moveAndUpdateArray = (arr, newValueY) => {
	// 移动数组最后一位到数组最前
	const lastItem = arr.pop();
	arr.unshift(lastItem);

	// 更新数组的valueY值
	for (let i = 0; i < 4; i++) {
		arr[i].valueY = newValueY[i];
	}

	return arr;
};

const setListChipValue = () => {
	if (listChip.value[0]) {
		listChip.value[0].valueY = 26;
	}
	if (listChip.value[1]) {
		listChip.value[1].valueY = 19;
	}
	if (listChip.value[2]) {
		listChip.value[2].valueY = 12;
	}
	if (listChip.value[3]) {
		listChip.value[3].valueY = 5;
	}

	if (
		total.value === 25 ||
		total.value === 100 ||
		total.value === 500 ||
		total.value === 1000 ||
		total.value === 5000 ||
		total.value === 10000 ||
		total.value === 100000 ||
		total.value === 500000 ||
		total.value === 1000000
	) {
		listChip.value = [];
		listChip.value.push({ label: total.value, valueY: 26 });
		return;
	}
	if (listChip.value.length > 4) {
		listChip.value = listChip.value.slice(-4);
	}
};

const setAnimate = () => {
	//先显示内圈 隔个1s后显示外圈
	inter_circle.value = true;
	setTimeout(() => {
		inter_circle.value = false;
		out_circle.value = true;
	}, 10);

	setTimeout(() => {
		out_circle.value = false;
	}, 20);
};

const handlerChip = () => {
	setAnimate();
	if (props.chip) {
		total.value += props.chip;
		listChip.value.push({
			label: props.chip,
			valueY: 0,
		});
		betChips.value.push(props.chip);

		// 计算筹码位置
		setListChipValue();
	}
};
const clearChip = () => {
	listChip.value = [];
	total.value = 0;
	betChips.value = [];
};

const setImage = (v) => {
	return new URL(`../../assets/svg/bet/chip${v}.svg`, import.meta.url).href;
};


defineExpose({
	handlerChip,
	clearChip,
	betChips,
	listChip,
	total,
});

</script>

<style lang="less">
@import url('./bet-svg.less');
</style>


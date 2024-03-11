<template>
	<div class="bet-result game-result">
		<div class="bet-result-bg">
			<div class="win-lose">
				<span clas="t-opacity-0">&nbsp;</span>
				<span class="t-text-gold-500" style="display: none"> 您赢 0 </span>
				<span class="t-text-gray-400" style="display: none"> 您输 0 </span>
			</div>
			<div id="9D01" class="bet-result-cards">
				<div class="cards-container player">
					<div class="electronic-player electronic-card">
						<div class="third-card-player" v-if="player?.firstCard?.type">
							<span class="e-card horizontal flipped third"
								><figure
									class="e-front card_type"
									:style="{
										'background-image': `url(${setWenImage(player.firstCard.type)})`, 
										'background-position': `-${player.firstCard.position}px 0px`,
									}"
								>
									&nbsp;
								</figure>
								<figure class="e-back">&nbsp;</figure></span
							>
						</div>
						<div>
							<span class="e-card flipped first" v-if="player?.secondCard?.type"
								>
								<figure
									class="e-front card_type"
									:style="{
										'background-image': `url(${setWenImage(player.secondCard.type)})`,
										'background-position': `-${player.secondCard.position}px 0px`,
									}"
								>
									&nbsp;
								</figure>
								<figure class="e-back">&nbsp;</figure>
							</span>
							<span class="e-card flipped second" v-if="player?.thirdCard?.type"
								><figure
									class="e-front"
									style="background-repeat: no-repeat; background-size: cover"
									:style="{
										'background-image': `url(${setWenImage(player.thirdCard.type)})`,
										'background-position': `-${player.thirdCard.position}px 0px`,
									}"
								>
									&nbsp;
								</figure>
								<figure class="e-back">&nbsp;</figure>
							</span>
						</div>
					</div>
					<div class="points">
						<div class="fade-animation t-text-blue-500">{{ player?.point }}</div>
					</div>
					<div class="board-wrapper">
						<div class="board player-board"></div>
						<div class="board-text player-text"><span>闲</span> PLAYER</div>
					</div>
				</div>
				<div class="cards-container banker">
					<div class="points">
						<div class="fade-animation t-text-red-500">{{ banker?.point }}</div>
					</div>
					<div class="electronic-banker electronic-card">
						<div class="third-card">
							<span class="e-card horizontal flipped third" v-if="banker?.firstCard?.type"
								><figure
									class="e-front card_type"
									:style="{
										'background-image': `url(${setWenImage(banker.firstCard.type)})`,
										'background-position': `-${banker.firstCard.position}px 0px`,
									}"
								>
									&nbsp;
								</figure>
								<figure class="e-back">&nbsp;</figure></span
							>
						</div>
						<div>
							<span class="e-card flipped first" v-if="banker?.secondCard?.type"
								><figure
									class="e-front card_type"
									:style="{
										'background-image': `url(${setWenImage(banker.secondCard.type)})`,
										'background-position': `-${banker.secondCard.position}px 0px`,
									}"
								>
									&nbsp;
								</figure>
								<figure class="e-back">&nbsp;</figure></span
							><span class="e-card flipped second" v-if="banker?.thirdCard?.type"
								><figure
									class="e-front card_type"
									:style="{
										'background-image': `url(${setWenImage(banker.thirdCard.type)})`,
										'background-position': `-${banker.thirdCard.position}px 0px`,
									}"
								>
									&nbsp;
								</figure>
								<figure class="e-back">&nbsp;</figure></span
							>
						</div>
					</div>
					<div class="board-wrapper">
						<div class="board banker-board"></div>
						<div class="board-text banker-text">BANKER <span>庄</span></div>
					</div>
				</div>
				<div class="electronic-center">
					<div class="winner-icon winner-animation">
						<img :src="setImage()" class="t-absolute t-z-10 t-w-full t-h-auto" />

						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 430 250"
							width="430"
							height="250"
							preserveAspectRatio="xMidYMid meet"
							style="width: 100%; height: 100%; transform: translate3d(0px, 0px, 0px)"
						>
							<defs>
								<clipPath id="__lottie_element_272"><rect width="430" height="250" x="0" y="0"></rect></clipPath>
								<image xlink:href="../../assets/lottery-results/img_0.png"></image>
								<image xlink:href="../../assets/lottery-results/img_1.png"></image>
								<image xlink:href="../../assets/lottery-results/img_2.png"></image>
								<image xlink:href="../../assets/lottery-results/img_3.png"></image>
								<image xlink:href="../../assets/lottery-results/img_4.png"></image>
							</defs>
							<g clip-path="url(#__lottie_element_272)">
								<g
									class="png"
									transform="matrix(0.9173569679260254,0,0,0.9173569679260254,17.76824951171875,10.330375671386719)"
									opacity="0.9592500000002104"
									style="display: block"
								>
									<image
										width="430px"
										height="250px"
										preserveAspectRatio="xMidYMid slice"
										xlink:href="../../assets/lottery-results/img_4.png"
									></image>
								</g>
								<g
									class="png"
									transform="matrix(0.712451159954071,0,0,0.712451159954071,61.822998046875,35.943603515625)"
									opacity="1"
									style="display: block"
								>
									<image
										width="430px"
										height="250px"
										preserveAspectRatio="xMidYMid slice"
										xlink:href="../../assets/lottery-results/img_3.png"
									></image>
								</g>
								<g
									class="png"
									transform="matrix(0.533251166343689,0,0,0.533251166343689,100.35099792480469,58.343605041503906)"
									opacity="1"
									style="display: block"
								>
									<image
										width="430px"
										height="250px"
										preserveAspectRatio="xMidYMid slice"
										xlink:href="../../assets/lottery-results/img_2.png"
									></image>
								</g>
								<g
									class="png"
									transform="matrix(0.824451208114624,0,0,0.824451208114624,37.74299621582031,21.94359588623047)"
									opacity="1"
									style="display: block"
								>
									<image
										width="430px"
										height="250px"
										preserveAspectRatio="xMidYMid slice"
										xlink:href="../../assets/lottery-results/img_1.png"
									></image>
								</g>
								<g class="png" transform="matrix(1,0,0,1,0,0)" opacity="1" style="display: block">
									<image
										width="430px"
										height="250px"
										preserveAspectRatio="xMidYMid slice"
										xlink:href="../../assets/lottery-results/img_0.png"
									></image>
								</g>
							</g>
						</svg>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
<script setup>
import { defineProps, toRaw, ref, watch } from 'vue';
import { setWenImage } from '@/utils';
const props = defineProps({
	player: {
		firstCard: {
			type: '',
			position: '',
		},
		secondCard: {
			type: '',
			position: '',
		},
		thirdCard: {
			type: '',
			position: '',
		},
		point: Number,
	},
	banker: {
		firstCard: {
			type: '',
			position: '',
		},
		secondCard: {
			type: '',
			position: '',
		},
		thirdCard: {
			type: '',
			position: '',
		},

		point: Number,
	},
	displayStatus: {
		display: Boolean,
		imageType: String,
	},
});

const player = toRaw(props.player);

const isDisplay = ref(props.displayStatus.display);

const setImage = () => {
	return new URL(`../../assets/table-view/${props.displayStatus.imageType}.png`, import.meta.url).href;
};
</script>
<style scoped lang="less">
@import url('./lottery-results.less');
</style>


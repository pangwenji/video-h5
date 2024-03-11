<template>
	<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" class="t-btn-next">
			<g filter="url(#select_next_chip_A)">
				<path
					d="M11.667 6.347a1.56 1.56 0 0 0 0-2.694L5.833.285A1.56 1.56 0 0 0 3.5 1.632v6.736a1.56 1.56 0 0 0 2.333 1.347l5.833-3.368z"
					fill="#FCEFBC"
				></path>
			</g>
			<defs>
				<filter
					id="select_next_chip_A"
					x=".389"
					y=".074"
					width="15.167"
					height="16.074"
					filterUnits="userSpaceOnUse"
					color-interpolation-filters="sRGB"
				>
					<feFlood flood-opacity="0" result="A"></feFlood>
					<feColorMatrix in="SourceAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"></feColorMatrix>
					<feOffset dy="3.11111"></feOffset>
					<feGaussianBlur stdDeviation="1.556"></feGaussianBlur>
					<feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"></feColorMatrix>
					<feBlend in2="A"></feBlend>
					<feBlend in="SourceGraphic"></feBlend>
				</filter>
			</defs>
	</svg>
</template>

<style scoped>
.t-btn-next{
    place-self: center;
    grid-row: 1/2;
    z-index: 1;
    width:14px;
    height:14px;
    transform: translateZ(0);
    grid-column: 3/4;

}
</style>

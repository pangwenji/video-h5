<template>
	<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" class="select-arrow-chip">
		<g filter="url(#select_prev_chip_A)">
			<path
				d="M4.333 6.347a1.56 1.56 0 0 1 0-2.694L10.167.285A1.56 1.56 0 0 1 12.5 1.632v6.736a1.56 1.56 0 0 1-2.333 1.347L4.333 6.347z"
				fill="#FCEFBC"
			></path>
		</g>
		<defs>
			<filter
				id="select_prev_chip_A"
				x=".444"
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
.select-arrow-chip{
    place-self: center;
    grid-row: 1/2;
    z-index: 1;
    width:14px;
    height:14px;
    transform: translateZ(0);
    grid-column: 1/2;
}
</style>

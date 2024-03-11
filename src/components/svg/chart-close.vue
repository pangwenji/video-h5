<template>
	<svg
		xmlns="http://www.w3.org/2000/svg"
		xmlns:xlink="http://www.w3.org/1999/xlink"
		text-anchor="middle"
		dominant-baseline="middle"
		aria-hidden="true"
		class="chart-close"
	>
		<path
			fill-rule="evenodd"
			d="M23.35 3.43c.717-.708.725-1.864.017-2.581S21.502.124 20.785.832l-8.673 8.562L3.439.832C2.722.124 1.566.131.858.849S.157 2.722.875 3.43l8.639 8.529-8.951 8.836c-.717.708-.725 1.864-.017 2.581s1.864.725 2.581.017l8.984-8.869 8.984 8.869c.717.708 1.873.701 2.581-.017s.701-1.873-.017-2.581l-8.951-8.836L23.35 3.43z"
			fill="url(#closeLuchart_A)"
		></path>
		<defs>
			<linearGradient id="closeLuchart_A" x1="22.476" y1="23.83" x2="22.923" y2="1.65" gradientUnits="userSpaceOnUse">
				<stop stop-color="#ff3737"></stop>
				<stop offset="1" stop-color="#fed0a5"></stop>
			</linearGradient>
		</defs>
	</svg>
</template>

<style scoped lang="less">
@import url('./common.style.less');
.chart-close {
    width: 1.25rem;
	height: 1.25rem;
}
</style>


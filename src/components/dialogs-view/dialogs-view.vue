<template>
	<div   class="dialogs-view" style="z-index: 1000">
		<div  class="dialogs-view-mask" style=""></div>
		<div
			
			aria-expanded="true"
			role="dialog"
			aria-modal="true"
			tabindex="-1"
			class="dialogs-view_container"
			style=""
		>
			<div  class="dialogs-view_content">
				<div  class="dialogs-view_section casino royce">
					<div  class="dialogs-view__body">
						<div  class="room-logo royce" :style="{'background-image':`url(${cover})`}"></div>
						<div  class="casino-name t-mt-2">晨丽度假村</div>
						<div  class="t-mt-2 casino-subtitle zh-cn">五星级酒店 &amp; 赌场度假村</div>
						<div  class="t-text-base t-mt-2">正在为您准备 {{tableNumber}} 桌</div>
						<img  width="110" src="@/assets/table-view/loading.gif" alt="loading...." class="t-mt-2" />
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
<script setup>
import {defineProps, ref} from 'vue';

const props = defineProps({
    tableCode:Number,
	cover:String
})
const tableNumber = ref(props.tableCode)
</script>

<style lang="less">
@import url('./dialogs-view.less');
</style>


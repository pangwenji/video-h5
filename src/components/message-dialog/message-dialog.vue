<template>
	<div   class="v-dialog__container" :style="{display:displays ? 'block':'none'}">
		<div tabindex="-1"  class="v-dialog__content v-dialog__content--active" style="z-index: 202; ">
			<div class="v-dialog v-dialog--active v-dialog--persistent" >
				<div  class="toast-wrapper">{{info}}</div>
			</div>
		</div>
	</div>
</template>
<script setup>
import { defineProps, ref, watch , defineEmits} from 'vue';

const props = defineProps({
	message: {
		type: String,
	},
	isShow: {
		type: Boolean,
	},
});

const emit= defineEmits(['close'])

const info = ref(null);

const displays = ref(false);
const viableSetTimeOut=()=>{
    setTimeout(()=>{
        displays.value = false;
        info.value = null;
        emit('close')
    },3000)
}

watch(
	() => props.isShow,
	(v) => {
		displays.value = v;
		info.value = props.message;
        viableSetTimeOut()
	},
	{
		immediate: true,
	}
);
</script>

<style lang="less" scope>
.v-dialog__container {
	position: absolute;
}

.v-dialog__content {
	align-items: center;
	display: flex;
	height: 100%;
	justify-content: center;
	left: 0;
	position: fixed;
	top: 0;
	transition: 0.2s cubic-bezier(0.25, 0.8, 0.25, 1);
	width: 100%;
	z-index: 6;
	outline: none;
}
.v-dialog {
	min-width: 120px;
	width: auto;
	text-align: center;
}
.v-dialog:not(.v-dialog--fullscreen) {
	max-height: 90%;
}

.v-dialog {
	box-shadow:
		0 11px 15px -7px rgba(0, 0, 0, 0.2),
		0 24px 38px 3px rgba(0, 0, 0, 0.14),
		0 9px 46px 8px rgba(0, 0, 0, 0.12);
	margin: 24px;
	overflow-y: auto;
	pointer-events: auto;
	transition: 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
	z-index: inherit;
}

.v-dialog {
	max-width: unset;
	border-radius: 4px;
}

.toast-wrapper {
	padding: 8px;
	border: 1px solid hsla(0, 0%, 59.2%, 0.6);
	box-shadow: 0 4px 16px 2px rgba(0, 0, 0, 0.74);
	border-radius: 4px;
	background-color: rgba(0, 0, 0, 0.6);
	color: #ffffff;
}
</style>


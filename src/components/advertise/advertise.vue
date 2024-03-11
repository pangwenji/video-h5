<template>
	<div class="advertise-inset" style="z-index: 1000">
        <div  class="vfm__overlay" style=""></div>
		<div class="advertise_container" style="" @click="(e)=>mainStatus(e,false)">
			<div class="advertise_content">
				<div class="advertise_dialog-content" @click="(e)=>mainStatus(e,true)">
					<div class="casino casino-info-img " >
						<img :src="imagePath" alt="" srcset="">
					</div>
					<div class="text-area">
						<div>
							<div class=" title text-center t-text-gold-500 ">马尼拉索莱尔世界</div>
							<div class="t-text-gold-500 t-text-center t-text-sm">马尼拉晨丽度假城</div>
							<p class="subTitle">
								马尼拉索莱尔世界是菲律宾第一个一站式、不间断的娱乐和休闲目的地，呈现给您刺激的娱乐、世界级的表演、独一无二的活动和令人兴奋的生活方式。
							</p>
						</div>
						<div  class="t-button" @click="(e)=>closes(e)">关闭</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
<script lang="ts" setup>
import { toRefs } from 'vue';
import {defineEmits,defineProps, onMounted} from 'vue';

const props = defineProps({
	imagePath:String
})
const {imagePath} = toRefs(props)
const emit = defineEmits(['close'])
const closes=(e)=>{
	e.stopPropagation()
	emit('close',false)
}

const mainStatus=(e,v:boolean)=>{
	e.stopPropagation();
	emit('close',v)
}

</script>
<style lang="less">
@import url('./advertise.less');
</style>


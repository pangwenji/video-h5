<template>
	<div class="notice-area" style="z-index: 1000" @click="(e) => closeNotice(e, false)">
		<div class="notice-overlay" style=""></div>
		<div aria-expanded="true" role="dialog" aria-modal="true" tabindex="-1" class="notice-container" style="">
			<div class="notice-content" @click="(e) => closeNotice(e, true)">
				<div class="base-dialog-content">
					<span class="title">游戏信息</span>
					<div vid="9D03" class="text-gold-500">
						<table class="t-info">
							<thead>
								<tr class="t-border-gold-500">
									<th width="53">玩法</th>
									<th>说明</th>
									<th width="53px">赔率</th>
								</tr>
							</thead>
							<tbody>
								<tr  >
									<td>庄</td>
									<td class="t-table-description"> {{ data?.banker_winner?.name }} </td>
									<td>1:{{data?.banker_winner?.ratio ?? 0}}</td>
								</tr>
								
								<tr>
									<td>闲</td>
									<td class="t-table-description"> {{data?.player_winner?.name}} </td>
									<td>1:{{data?.player_winner?.ratio ?? 0}}</td>
								</tr>
								<tr>
									<td>和</td>
									<td class="t-table-description"> {{data?.banker_player_same_pointer?.name}}</td>
									<td>1:{{data?.banker_player_same_pointer?.ratio ?? 0}}</td>
								</tr>
								<tr>
									<td>庄对</td>
									<td class="t-table-description"> {{data?.first_banker_pair?.name}}</td>
									<td>1:{{data?.first_banker_pair?.ratio ?? 0}}</td>
								</tr>
								<tr>
									<td>闲对</td>
									<td class="t-table-description"> {{data?.first_player_pair?.name}} </td>
									<td>1:{{data?.first_player_pair?.ratio ?? 0}}</td>
								</tr>
							
							</tbody>
						</table>
					</div>
					<div class="close" @click="(e)=> closeNotice(e, false)">关闭</div>
				</div>
			</div>
		</div>
	</div>
</template>
<script lang="ts" setup>
import { defineEmits,defineProps , toRefs } from 'vue';

const props = defineProps({
	data:Object
})
const { data } = toRefs(props)
const emits = defineEmits(['close']);

const closeNotice = (e: MouseEvent, v: boolean) => {
	e.stopPropagation();
	emits('close', v);
};

</script>
<style lang="less" scoped>
@import url('./notice-area.less');
</style>


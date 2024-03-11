<template>
	<div class="content">
		<div class="vfm__overlay"></div>
		<div
			class="vfm__container"
			@click="closeNetWork"
		>
			<div  class="vfm__content">
				<div  class="base-dialog-content" @click="(e)=>maintainState(e)">
					<div  class="base-dialog-title">网络状态说明</div>
					<div  class="network-status">
						<div   class="network-measurement hide-scrollbar">
							<div  class="charts">
								<div  class="chart video">
									<span  class="label">现场视频品质</span>
									<div
										class="pie-chart"
										style="width: 90px; height: 90px; clip-path: circle(42.5px at 50% 50%)"
									>
										<div  class="pie spinner"></div>
										<div  class="pie filler" style="background-color: rgb(255, 0, 0)"></div>
										<div  class="mask"></div>
										<div  class="text" style="width: 78px; height: 78px; clip-path: circle(36px at 50% 50%)">
											<span  class="note">暂无数据<br />请进桌再试</span>
										</div>
									</div>
								</div>
								<div  class="chart game">
									<span  class="label">游戏连线品质</span>
									<div
										class="pie-chart"
										style="width: 90px; height: 90px; clip-path: circle(42.5px at 50% 50%); background-color: rgb(34, 238, 131)"
									>
										<div
											class="pie spinner"
											style="background-color: rgb(34, 238, 131); transform: rotate(360deg); transition-duration: 1500ms"
										></div>
										<div
											
											class="pie filler"
											style="
												background-color: rgb(34, 238, 131);
												opacity: 1;
												transition-duration: 1500ms, 0ms;
												transition-delay: 0ms, 750ms;
											"
										></div>
										<div  class="mask" style="opacity: 0; transition-delay: 750ms"></div>
										<div  class="text" style="width: 78px; height: 78px; clip-path: circle(36px at 50% 50%)">
											<span  class="label" style="color: rgb(34, 238, 131)">Good</span
											>
										</div>
									</div>
								</div>
							</div>
							<div  class="warning-message"></div>
							<div  class="networking">
								<div  class="channel">
									<span >-</span><span  class="label">视频线路</span>
								</div>
								<div  class="bitrate">
									<span >-</span><span  class="label">传输速率</span>
								</div>
								<div  class="ping">
									<span >20 ms</span><span  class="label">PING</span>
								</div>
							</div>
							<div  class="notify">
								<span  class="base-checkbox-input"></span
								><span >Poor network signal notification</span>
							</div>
							<div  class="explain">
								<div >
									如果网路信号为黄色或红色，表示网路连线不佳，可能造成您无法观看视频或投注。
									<br/> 
									处理方式：
									<ol>
										<li>1. 切换视频线路</li>
										<li>2. 请检查您的网路连线，确认连线质量稳定</li>
										<li>3. 更换网路来源</li>
										<li>4. 如果无法改善，请联系客服</li>
									</ol>
								</div>
							</div>
						</div>
					</div>
					<div  class="base-dialog-footer">
						<div   class="Confirm" @click="(e)=>close(e)">确定</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
<script lang="ts" setup>
import { defineEmits } from 'vue';

const emits = defineEmits(['close'])
const closeNetWork=()=>{
	emits('close',false)
}

const close=(e)=>{
	e.stopPropagation();
	closeNetWork();
}

const maintainState=(e)=>{
	e.stopPropagation();
	emits('close',true)
}
</script>
<style lang="less" scoped>
@import url('./network-statsu.less');
</style>


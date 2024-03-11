<template>
	<div class="baccarat-live-player">
		<div id="player-contianer"></div>
	</div>
</template>
<script setup>
import { useTableStore } from '@/store';
import { onMounted, ref, toRefs, inject, onUnmounted, watch, nextTick, onBeforeMount } from 'vue';

const useTables = useTableStore();
const props = defineProps({
	liveUrl: String,
});

// SEI信息提交
const SEIDataReport = inject('SEIDataReport');

const liveUrl = ref(props.liveUrl || '');

const player = ref();

const SEIData = ref([]);

// 调试信息
const showOperateBtns = false;

function playerInit() {
	player.value = new JessibucaPro({
		container: document.getElementById('player-contianer'),
		videoBuffer: 0.1, // 缓存时长
		videoBufferDelay: 1, // 单位s
		// decoder: "../src/utils/kk-player/js/decoder-pro.js",
		decoder: '../../../../kk-player/js/decoder-pro.js',
		isResize: false,
		text: '',
		loadingText: '视频连线中',
		debug: false,
		debugLevel: 'debug',
		useMSE: true,
		useSIMD: true,
		useWCS: true,
		showBandwidth: showOperateBtns, // 显示网速
		showPerformance: showOperateBtns, // 显示性能
		operateBtns: {
			fullscreen: showOperateBtns,
			screenshot: showOperateBtns,
			play: showOperateBtns,
			audio: showOperateBtns,
			ptz: showOperateBtns,
			quality: showOperateBtns,
			performance: showOperateBtns,
		},
		hotKey: true,
		timeout: 10000,
		heartTimeoutReplayUseLastFrameShow: false,
		supportDblclickFullscreen: false,
		audioEngine: 'worklet',
		// qualityConfig: ['普清', '高清', '超清', '4K', '8K'],
		forceNoOffscreen: true,
		isNotMute: true,
		heartTimeout: 10,
		// ptzClickType: 'mouseDownAndUp',
		// ptzZoomShow: true,
		// ptzMoreArrowShow: false,
		// ptzApertureShow: false,
		// ptzFocusShow: true,
		useCanvasRender: false,
		useWebGPU: true,
		// controlHtml: '<div>我是 <span style="color: red">test</span>文案</div>',
		isEmitSEI: true,
		// audioEngine:"worklet",
		isFlv: true,
		// isFullResize: true,
	});

	// 绑定事件
	player.value.on('ptz', (arrow) => {
		console.log('ptz', arrow);
	});

	// player.value.on('streamQualityChange', (value) => {
	//   console.log('streamQualityChange', value);
	// })

	// player.value.on('timeout', info => {
	//   console.log('player-timeout-播放器超时-当心跳或流无数据返回时', info);
	// })

	// player.value.on('timeUpdate', (value) => {
	//   console.log('timeUpdate', value);
	// })

	// player.value.on('stats', (stats) => {
	//   // console.log('播放器状态', `FPS: ${stats.fps} DFPS: ${stats.dfps}`);
	//   // console.log('播放器状态', `缓存时长: ${stats.buf} 缓存时长【录像流】: ${stats.playbackCacheDataDuration}`);
	// })
	const playerError = ref('');
	player.value.on('error', (error) => {
		console.log('播放器报错详情', error);
		playerError.value = error;
	});

	watch(
		() => player.value?.getStatus?.(),
		(val) => {
			// destroy paused destroy paused
			console.log('watch-播放器状态', val);
			if (val === 'paused' && playerError.value === 'fetchError') {
				playerError.value = '';
				setTimeout(() => {
					if (player.value.getStatus() === 'paused') {
						toPlay();
					}
				}, 1500);
			}
		}
	);

	player.value.on('videoSEI', (value) => {
		const { ts, data } = value;
		//解析自定义的SEI信息
		if (data[0] === 6 && data[1] === 127) {
			let startDataCount = 0;
			for (let i = 2; i < data.length; i++) {
				if (data[i] < 255) {
					startDataCount += i;
					break;
				}
			}
			const dataArray = data.slice(startDataCount + 1, data.length - 1);
			const seiString = String.fromCharCode.apply(null, dataArray);
			try {
				const seiObj = JSON.parse(seiString);
				SEIData.value.push(seiObj);
				// console.log('videoSEI sei接收时间:', +new Date(), seiObj);
				SEIDataReport(seiObj);
			} catch (error) {
				console.log('收到的sei信息格式不对', error);
			}
		}
	});
}

const handlePageHide = () => {
	if (document.visibilityState === 'hidden') {
		player.value?.destroy?.();
	} else {
		playerInit();
		toPlay();
	}
};

onBeforeMount(() => {
	document.removeEventListener('visibilitychange', handlePageHide);
});

onMounted(() => {
	liveUrl.value = useTables.getTableInformation?.pull_address;
	if (liveUrl.value) {
		playerInit();
		setTimeout(() => {
			toPlay();
		}, 1200);
	}
	document.addEventListener('visibilitychange', handlePageHide);
});

// 销毁播放器
function destoryPlayer() {
	if (player.value) {
		player.value.destroy().then(() => {
			player.value = ref();
		});
	}
}

onUnmounted(() => {
	destoryPlayer();
});

// 播放
function toPlay() {
	if (player.value && liveUrl) {
		player.value?.play?.(liveUrl.value);
	}
}

// 重播
function replay() {
	if (player.value) {
		player.value.destroy().then(() => {
			playerInit();
			toPlay();
		});
	} else {
		playerInit();
		toPlay();
	}
}

function resize() {
	if (player.value) {
		player.value.resize();
	}
}

defineExpose({ destoryPlayer, resize });
</script>
<style scoped lang="less">
.baccarat-live-player {
	width: 100%;
	max-width: 564px;
	height: 100%;
	position: relative;
	left: 0;
	top: 0;
	border-radius: 0 0px 10px 10px;
	overflow: hidden;

	#player-contianer {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;

		video {
			width: 100%;
			height: 100%;
			max-width: 564px;
		}
	}
}
</style>


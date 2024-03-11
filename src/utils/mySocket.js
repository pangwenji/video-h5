import { useWebSocket } from '@vueuse/core';
import { ref } from 'vue';
import {} from 'element-plus';

export default async function () {
	const token = localStorage.getItem('TOKEN') ;
	if (!token) {
		ElMessage.warning({
			message: "请输入带有token的URL",
			offset: window.screen.height / 2,
		});
		return;
	}
	const wsUrl = import.meta.env.VITE_WS_BASE_PATH;
	const disconnectSignal = ref();
	const {
		status,
		data,
		open,
		close: _close,
		send,
		onerror,
	} = await useWebSocket(`${wsUrl}?token=${token}`, {
		autoReconnect: {
			retries: 3,
			delay: 1000,
			onFailed() {
				console.log('ws connect error');
			},
		},
		// heartbeat: true,
		onConnected(e) {
			console.log('ws已连接', e);
		},
		onDisconnected(e, v) {
			const { code, reason } = v;
			// 退出登录，登录token失效，
			close();

			if (code && code === 4000) {
				disconnectSignal.value = v;
				// token 为空 被断开
			}
			if (code && code === 4001) {
				disconnectSignal.value = v;
			}
		},
	});
	const close = () => {
		console.log('触发 ws close');
		_close?.();
	};

	await new Promise((resolve) => {
		const checkReadyState = () => {
			if (status.value === 'OPEN') {
				resolve(true);
			} else {
				setTimeout(checkReadyState, 100);
			}
		};
		checkReadyState();
	});

	return {
		status,
		data,
		open,
		close,
		send,
		onerror,
		disconnectSignal,
	};
}

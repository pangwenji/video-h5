class WebSocketClient {
	socket;
	url;
	reconnectionAttempts;
	maxReconnectionAttempts;
	heartbeatInterval;
	heartbeatTimer;
	constructor(url, maxReconnectionAttempts = 3, heartbeatTimer = 3000) {
		this.url = url;
		this.maxReconnectionAttempts = maxReconnectionAttempts;
		this.heartbeatTimer = heartbeatTimer;

        this.reconnectionAttempts = 0;
		this.socket = new WebSocket(this.url);
		this.socket.onopen = this._onopen.bind(this);
		this.socket.onmessage = this._onmessage.bind(this);
		this.socket.onerror = this._onerror.bind(this);
		this.socket.onclose = this._onclose.bind(this);
	}

	_onopen() {
		console.log('web已链接');
		// 心跳检测
		this.reconnectionAttempts = 0;

		this.startHeartBeat();
	}

	_onmessage() {
		console.log('web onmessage');
	}

	_onerror() {
		console.log('web onerror');
        // 如果监听到onerror
        this.reConnection()
	}

	_onclose() {
		console.log('web onclose');
        // 触发关闭时候尝试重连
        this.reConnection();
	}

	send(message) {
		if (message) {
			if (this.socket.readyState === WebSocket.OPEN) {
				this.socket.send(message);
			}
		}
	}

	addListenEvent(event, callBack) {
		this.socket.addEventListener(event, callBack);
	}

	// 实现重连机制
	reConnection() {
        if(this.reconnectionAttempts < this.maxReconnectionAttempts){
             this.socket = new WebSocket(this.url);
             this.reconnectionAttempts++;
        }else {
            console.log('尝试重连，超过3次')
        }
    }

    // 心跳检测
	startHeartBeat() {
		this.heartbeatInterval = setInterval(() => {
			if (this.socket.readyState === WebSocket.OPEN) {
				this.send('heart Beat');
			} else {
				this.stopHeartBeat();
			}
		}, this.heartbeatTimer);
	}

    // 停止心跳检测
	stopHeartBeat() {
		clearInterval(this.heartbeatInterval);
	}
}



const ws = new WebSocketClient('http:',)
ws.addListenEvent()

import { InstanceBase, runEntrypoint, InstanceStatus, combineRgb } from '@companion-module/base'
import WebSocket from 'ws'
import { upgradeScripts } from './upgrade.js'
import { setupActions } from './actions.js'
import { setupFeedbacks } from './feedbacks.js'
import { configFields } from './config.js'
import { variables } from './variables.js';


class WebsocketInstance extends InstanceBase {
	isInitialized = false

	async init(config) {
		this.config = config

		this.setVariableDefinitions(variables);

		this.slideShowActive = false;
		this.totalSlideCount = 0;
		this.currentSlide = 0;
		this.fileName = "";
		this.mediaStatus = {};

		this.setVariableValues({
            slideNotes: null
        })

		this.initWebSocket()
		this.isInitialized = true

		this.initActions()
		this.initFeedbacks()
	}

	async destroy() {
		this.isInitialized = false
		if (this.reconnect_timer) {
			clearTimeout(this.reconnect_timer)
			this.reconnect_timer = null
		}
		if (this.ws) {
			this.ws.close(1000)
			delete this.ws
		}
	}

	async configUpdated(config) {
		this.config = config
		this.initWebSocket()
	}

	maybeReconnect() {
		if (this.isInitialized && this.config.reconnect) {
			if (this.reconnect_timer) {
				clearTimeout(this.reconnect_timer)
			}
			this.reconnect_timer = setTimeout(() => {
				this.initWebSocket()
			}, 500)
		}
	}

	sendPing() {
        if (this.ws && this.ws.readyState === 1) {
			this.hasAnsweredPing = false;
            this.ws.ping();
			this.pingTimeout = setTimeout(() => {
                if (!this.hasAnsweredPing) {
					this.updateStatus(InstanceStatus.Disconnected, "Connection lost")
					if(this.pingInterval) {
						clearInterval(this.pingInterval);
						this.pingInterval = null;
					}
                    this.maybeReconnect(); // Rufen Sie die maybeReconnect-Methode auf, wenn keine Pong empfangen wurde
                }
            }, 3000);
        }
    }

	initializePingPong() {
        this.pingInterval = setInterval(() => {
            this.sendPing();
        }, 3000);

        this.ws.on('pong', () => {
			this.hasAnsweredPing = true;
        });
    }

	maybeReconnect() {
		if (this.isInitialized && this.config.reconnect) {
			if (this.reconnect_timer) {
				clearTimeout(this.reconnect_timer)
			}
			this.reconnect_timer = setTimeout(() => {
				this.initWebSocket()
			}, 5000)
		}
	}


	initWebSocket() {
		if (this.reconnect_timer) {
			clearTimeout(this.reconnect_timer)
			this.reconnect_timer = null
		}

		const url = "ws://" + this.config.targetIp + ":" + this.config.targetPort +  "/ws"
		if (!url || !this.config.targetIp) {
			this.updateStatus(InstanceStatus.BadConfig, `Target IP is missing`)
			return
		}

		this.updateStatus(InstanceStatus.Connecting)

		if (this.ws) {
			this.ws.close(1000)
			delete this.ws
		}
		this.ws = new WebSocket(url)

		this.ws.on('open', () => {
			this.updateStatus(InstanceStatus.Ok);
			this.initializePingPong();
		})
		this.ws.on('close', (code) => {
			this.updateStatus(InstanceStatus.Disconnected, `Connection closed with code ${code}`)
			this.maybeReconnect()
		})

		this.ws.on('message', this.messageReceivedFromWebSocket.bind(this))

		this.ws.on('error', (data) => {
			this.log('error', `WebSocket error: ${data}`)
		})
	}


	parsePowerPointStatus(data) {
		if("slideShowActive" in data) {
			this.slideShowActive = data.slideShowActive;
		}
		if("totalSlideCount" in data) {
			this.totalSlideCount = data.totalSlideCount;
		}
		if("currentSlide" in data) {
			this.currentSlide = data.currentSlide;
		}
		if("slideNotes" in data) {
            this.setVariableValues({
                slideNotes: data.slideNotes
            })
        }
		if("fileName" in data) {
			this.fileName = data.fileName;
			if(this.fileName == null) {
				this.fileName = "---";
			}
		}
		if("mediaStatus" in data) {
			var mediaIndex = data.mediaId
			if (!this.mediaStatus[mediaIndex]) {
        		this.mediaStatus[mediaIndex] = {};
    		}
			this.mediaStatus[mediaIndex].status = data.mediaStatus
			
			if("elapsedTime" in data) {
				this.mediaStatus[mediaIndex].elapsedTime = data.elapsedTime
			}
			if("totalLength" in data) {
				this.mediaStatus[mediaIndex].totalLength = data.totalLength
			}
			if("remainingTime" in data) {
				this.mediaStatus[mediaIndex].remainingTime = data.remainingTime
			}
			console.log(this.mediaStatus[mediaIndex])
		}
		this.checkFeedbacks();
	}

	messageReceivedFromWebSocket(data) {
		let msgValue = null
		try {
			msgValue = JSON.parse(data)
		} catch (e) {
			msgValue = data
		}
		this.parsePowerPointStatus(msgValue);
	}

	getConfigFields() {
		return configFields;
	}

	initFeedbacks() {
		setupFeedbacks(this);
	}

	initActions() {
		setupActions(this);
	}
}

runEntrypoint(WebsocketInstance, upgradeScripts)

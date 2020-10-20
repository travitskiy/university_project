
class WebsocketSession extends EventEmitter {

    constructor(path) {
        super();
        this.tryConnect(path);
    }

    tryConnect(path) {
        this._ws = new WebSocket(path);
        this._ws.onopen = e => this.emit('connect', e);
        this._ws.onclose = e => this.emit('disconnect ', e);
        this._ws.onerror = e => this.emit('error ', e);
        this._ws.onmessage = message => this.emit('message', message)
    }

    send(data) {
        this._ws.send(data);
    }
}
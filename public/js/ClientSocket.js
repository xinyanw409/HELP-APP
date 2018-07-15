'use strict';

class ClientSocket {
    constructor() {
        this.socket = io.connect('https://murmuring-retreat-94612.herokuapp.com');
        // this.socket = io.connect('http://localhost:3000');
        // this.socket = io({transports: ['websocket'], upgrade: false}).connect('http://localhost:3000');
    }

    handleError(error, func) {
        if (error.status == 403 || error.status == 500) {
            func();
        } else {
            alert(error.data.message); 
        }
    }
}

const mysocket = new ClientSocket();
Object.freeze(mysocket);

export default mysocket;


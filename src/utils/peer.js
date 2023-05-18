import Peer from "simple-peer";
import io from "socket.io-client";

const socket = io("http://localhost:8000");
const peerConfig = {
    iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' },
        { urls: 'stun:stun2.l.google.com:19302' },
        { urls: 'stun:stun3.l.google.com:19302' },
        { urls: 'stun:stun4.l.google.com:19302' },
    ],
};

const peerOptions = {
    initiator: true,
    trickle: false,
    config: peerConfig,
};

const acceptRequest = (swarmid, uuid) => {
    Peer.prototype.signal = function (data) {
        this._channel.send(JSON.stringify(data));
    }

    const peer = new Peer(peerOptions);

    peer.on('signal', (data) => {
        socket.emit('signal', { uuid, swarmid, data });
    }
    );

    peer.on('connect', () => {
        console.log("Connected");
    }
    );
    
    peer.on('data', (data) => {
        console.log(data);
    }
    );
}

const sendRequest = (swarmid, uuid) => {
    Peer.prototype.signal = function (data) {
        this._channel.send(JSON.stringify(data));
    }

    const peer = new Peer(peerConfig);

    peer.on('signal', (data) => {
        socket.emit('signal', { uuid, swarmid, data });
    }
    );

    peer.on('connect', () => {
        console.log("Connected");
    }
    );

    peer.on('data', (data) => {
        console.log(data);
    }
    );
}

export { acceptRequest, sendRequest };
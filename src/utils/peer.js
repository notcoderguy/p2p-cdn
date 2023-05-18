import Peer from "simple-peer";

const peerConfig = {
    iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' },
        { urls: 'stun:stun2.l.google.com:19302' },
        { urls: 'stun:stun3.l.google.com:19302' },
        { urls: 'stun:stun4.l.google.com:19302' },
    ],
};

const acceptRequest = () => {
    setRequested(false);
    const peer = new Peer({
        initiator: false,
        trickle: false
    });
    peer.on("signal", (data) => {
        socket.current.emit(SOCKET_EVENT.ACCEPT_REQUEST, { signal: data, to: peerUsername });
    });
    peer.on("connect", () => {
        setReceiving(true);
    });
    const fileChunks = [];
    peer.on('data', data => {

        if (data.toString() === 'EOF') {
            // Once, all the chunks are received, combine them to form a Blob
            const file = new Blob(fileChunks);
            setReceivedFilePreview(URL.createObjectURL(file));
            setReceiving(false);
        } else {
            // Keep appending various file chunks
            fileChunks.push(data);
        }

    });

    peer.signal(peerSignal);
    peerInstance.current = peer;

};

const rejectRequest = () => {
    socket.current.emit(SOCKET_EVENT.REJECT_REQUEST, { to: peerUsername });
    setRequested(false);
};

const sendRequest = (username) => {
    setLoading(true);
    setPeerUsername(username);
    const peer = new Peer({
        initiator: true,
        trickle: false,
        config: peerConfig,
    });
    peer.on("signal", (data) => {
        socket.current.emit(SOCKET_EVENT.SEND_REQUEST, {
            to: username,
            signal: data,
            username: myUsername,
        });
        setSentRequest(true);
        setLoading(false);
    });
    peer.on("connect", async () => {
        setSending(true);
        setSentRequest(false);
        let buffer = await file.arrayBuffer();
        const chunkSize = 16 * 1024;
        while (buffer.byteLength) {
            const chunk = buffer.slice(0, chunkSize);
            buffer = buffer.slice(chunkSize, buffer.byteLength);

            // Off goes the chunk!
            peer.send(chunk);
        }
        peer.send('EOF');
        setSending(false);
    });
    peerInstance.current = peer;

};

export { acceptRequest, rejectRequest, sendRequest };
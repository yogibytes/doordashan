import { WebSocket as NodeWebSocket, WebSocketServer } from 'ws';
const wss = new WebSocketServer({
    port: 8080
});
/*
{
    senderMsg:{
    type:"sender"
    },
    recieverMsg:{
    type:"reciever"
    },
    createOffer:{
        "type":"sender",
        "description":"this is sdp of the sender"
    },
    createAnswer:{
        "type":"reciever",
        "description":"this is sdp of the reciever"
    },
    iceCandidate:{
        "type":"iceCandidate",
        "description":"candidate:842163049 1 udp 1686052607 192.168.1.5 54321 typ host generation 0 ufrag a1B2"
    }
}
*/
let senderSocket = null;
let recieverSocket = null;
wss.on('connection', function connection(ws) {
    ws.on('error', (error) => console.log(error));
    ws.on('message', function message(data) {
        try {
            const message = JSON.parse(data);
            console.log('received', message);
            // console.log(message.type);  
            if (message.type === 'sender') {
                senderSocket = ws;
                senderSocket?.send('sender Connected');
                console.log("sender connected");
            }
            else if (message.type === 'reciever') {
                recieverSocket = ws;
                recieverSocket?.send('reciever Connected');
                console.log("reciever connected");
            }
            else if (message.type === 'createOffer') {
                if (ws !== senderSocket) {
                    return;
                }
                recieverSocket?.send(JSON.stringify({
                    type: 'createOffer',
                    sdp: message.sdp
                }));
            }
            else if (message.type === 'createAnswer') {
                if (ws !== recieverSocket) {
                    return;
                }
                senderSocket?.send(JSON.stringify({
                    type: 'createAnswer',
                    sdp: message.sdp
                }));
            }
            else if (message.type === 'iceCandidate') {
                if (ws === senderSocket) {
                    recieverSocket?.send(JSON.stringify({ type: 'iceCandidate', candidate: message.candidate }));
                }
                else if (ws === recieverSocket) {
                    senderSocket?.send(JSON.stringify({ type: 'iceCandidate', candidate: message.candidate }));
                }
            }
        }
        catch (error) {
            console.log("error is:", error);
            ws.send('invalid input json');
        }
    });
});
//# sourceMappingURL=index.js.map
import { useEffect } from 'react';

export default function Reciever() {
    console.log('reciever is executing')
    useEffect(() => {
        const socket = new WebSocket('ws://localhost:8080');
        socket.onopen = () => {
            socket.send(JSON.stringify({
                type:'reciever'
            }))
        }
        startRecieving(socket);
    })

    function startRecieving(socket: WebSocket) {
        
        const video = document.createElement('video');
        document.body.appendChild(video);
        // console.log("control reached under the startRecieving")
        const pc = new RTCPeerConnection();
        pc.ontrack = (event) => {
            video.srcObject = new MediaStream([event.track]);
            video.play();
        }

        socket.onmessage = async (event) => { // 5. Browser 2 receives the offer from the signaling server
            const message = JSON.parse(event.data);
            if (message.type === 'createOffer') {   
                await pc.setRemoteDescription(message.sdp); // 6. Browser 2 sets the remote description to the offer
                const answer = await pc.createAnswer(); // 7. Browser 2 sets the remote description to the offer
                await pc.setLocalDescription(answer);   
                socket.send(JSON.stringify({
                    type: 'createAnswer',
                    sdp:answer
                }))
            } else if (message.type === 'iceCandidate') {
                await pc.addIceCandidate(message.candidate);
            }
        }
        
    }
    return <>
        recievr
    </>
}
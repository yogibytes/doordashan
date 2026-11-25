import {useEffect, useState} from 'react' 

export default function Sender() {
    const [socket, setSocket] = useState<WebSocket | null>(null);
    // const [pc, setPC] = useState<RTCPeerConnection | null>(null);
    
    useEffect(() => {
        const socket = new WebSocket('ws://localhost:8080');    
        setSocket(socket);
        socket.onopen = () =>{
        socket.send(
            JSON.stringify({
                type:'sender'
            })
        )}
    }, [])
    
    const initConnection = async () => {
        if (!socket) {
            alert('socket not present')
            return

        };
        // message from the other side Browser 2
        socket.onmessage = async (event) => {
            const message = JSON.parse(event.data);
            if (message.type === 'createAnswer') {
                await pc.setRemoteDescription(message.sdp)
            } else if (message.type === 'iceCandidate') {
                await pc.addIceCandidate(message.candidate)
            }
        }

        const pc = new RTCPeerConnection(); // Browser 1 create RTCPeerConnection
        // setPC(pc);
        
        pc.onicecandidate = (event) => { // gathering the candidates
            console.log("gathering candidates !")
            if (event.candidate) {
                socket?.send(JSON.stringify({
                    type: 'iceCandidate',
                    candidate: event.candidate
                }))
                console.log(event.candidate);
            }
        }

        // if new connection Needed (perform every time assumes every time as new offer)
        pc.onnegotiationneeded = async () => {
            const offer = await pc.createOffer(); // 2. Browser 1 creates an offer
            await pc.setLocalDescription(offer);    // 3. Browser 1 sets the local description to the offer

            // 4. Browser 1 sends the offer to the other side through the signaling server(ws)
            socket?.send(JSON.stringify({
                type: 'createOffer',
                sdp: pc.localDescription
            }))
        }
        getCameraStreamAndSend(pc);
    }
        const getCameraStreamAndSend = (pc: RTCPeerConnection) => {
            navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
                const video = document.createElement('video');
                video.srcObject = stream;
                video.play();
                // this is wrong, should propogate via a component
                document.body.appendChild(video);
                stream.getTracks().forEach((track) => {
                    pc?.addTrack(track);
                });
            });

        }
    
    return <>
        <b> Sender </b> 
    <button onClick={initConnection}> Send Data </button>
    </>
}
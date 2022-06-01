import { useEffect, useRef } from "react";
import styled from "styled-components";

const Video = styled.video.attrs({autoPlay: true, playsInline: true, width: 400, height: 400})`
`

const Msg = styled.iframe`
    all: unset;
    position: fixed;
    right: 0;
    border: 1px solid blue;
    width: 500px;
    height: 100vh;
`

function VideoChat() {

    const myStream = useRef<MediaStream>();

    const videoEl = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        const getMedia = async () => {
            try{
                if(!videoEl.current) {
                    return;
                }
                myStream.current = await navigator.mediaDevices.getUserMedia({
                    audio: true,
                    video: {
                        facingMode: "user"
                    },
                });
                videoEl.current.srcObject = myStream.current;
            } catch(err: any) {
                console.log(err);
            }
        }
        getMedia();
    }, [])

    return (
        <div>
            <Video ref={videoEl}/>
            <Msg src="/chat" />
        </div>
    );
}

export default VideoChat;
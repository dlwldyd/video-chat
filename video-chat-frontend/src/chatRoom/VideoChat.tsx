import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import SockJS from "sockjs-client";
import Stomp from "stompjs";
import { FaRegPaperPlane } from "react-icons/fa";
import { useParams } from "react-router";

const InputPanel = styled.div`
    position: sticky;
    left: 0;
    right: 0;
    bottom: 0;
    height: 6vh;    
    background-color: ${props => props.theme.color.bgColor};
    padding-left: 20px;
    padding-right: 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-shrink: 0;
`

const InputBox = styled.div`
    height: 5vh;
    background-color: ${props => props.theme.color.bgColor};
    display: flex;
    padding: 0px 10px;
    align-items: center;
    flex-grow: 1;
    font-size: 15px;
    &:hover {
        cursor: text;
    }
`

const InputChat = styled.textarea`
    resize: none;
    width: 100%;
    color: ${props => props.theme.color.textColor};
    background-color: ${props => props.theme.color.bgColor};
    border: none;
    overflow: hidden;
    vertical-align: middle;
    font-size: inherit;
    border-bottom: 1px solid ${props => props.theme.color.borderColor};
    &:focus {
        outline: none;
        border-bottom: 2px solid ${props => props.theme.color.borderColor};
    }
`

const SendChatBtn = styled.button`
    height: 40px;
    width: 40px;
    margin-left: 10px;
    background-color: ${props => props.theme.color.bgColor};
    color: ${props => props.theme.color.textColor};
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    border: none;
    &:active {
        background-color: ${props => props.theme.color.clickColor};
    }
    &:not(:active) {
        transition: background-color 0.3s ease-out;
    }
`

const MessageBox = styled.div`
    margin-left: 15px;
    height: 3vh;
    display: flex;
    align-items: center;
`

const Message = styled.span`
    font-family: ${props => props.theme.font};
    color: ${props => props.theme.color.textColor};
    font-size: 14px;
`

const ChatLog = styled.div`
    overflow: auto;
`

const Video = styled.video.attrs({autoPlay: true, playsInline: true, width: 400, height: 400})`
`

const Msg = styled.div`
    position: fixed;
    right: 0;
    top: 0;
    bottom: 0;
    border: 1px solid blue;
    width: 500px;
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
`

const VideoGrid = styled.div`
    display: grid;
`

function VideoChat() {

    const myStream = useRef<MediaStream>();

    const videoEl = useRef<HTMLVideoElement>(null);

    const {roomKey} = useParams();

    const stomp = useRef<Stomp.Client>();
    
    const inputChat = useRef<HTMLTextAreaElement>(null);
    
    const [receivedMsg, setReceivedMsg] = useState<string[]>([]);
    
    const [msg, setMsg] = useState("");

    const chatLog = useRef<HTMLDivElement>(null);
    
    useEffect(() => {
        const ws = new SockJS("http://localhost:8080/stomp");
        stomp.current = Stomp.over(ws);
        stomp.current.connect({}, () => {
            stomp.current?.subscribe(`/exchange/chat.exchange/room.${roomKey}`, (message) => {
                const {nickname, msg: msgBody} = JSON.parse(message.body);
                setReceivedMsg(receivedMsg => [...receivedMsg, `${nickname} : ${msgBody}`]);
            });
        });
        return () => {
            stomp.current?.disconnect(() => {});
        }
    }, [roomKey]);
    
    useEffect(() => {
        if(chatLog.current) {
            chatLog.current.scrollTop = chatLog.current.scrollHeight;
        }
        // window.scrollBy({top: 100});
    }, [receivedMsg])
    
    const onEnter = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if(event.key === "Enter") {
            event.preventDefault();
            stomp.current?.send(`/chat/room.${roomKey}`, {}, JSON.stringify({nickname: `${sessionStorage.getItem("nickname")}`, msg: `${msg}`}));
            setMsg("");
        }
    }
    
    const onChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setMsg(event.target.value);
    }
    
    const onBtnClick = () => {
        stomp.current?.send(`/chat/room.${roomKey}`, {}, JSON.stringify({nickname: `${sessionStorage.getItem("nickname")}`, msg: `${msg}`}));
        setMsg("");
    }
    
    const onInputBoxClick = () => {
        inputChat.current?.focus();
    }

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
            <VideoGrid>
                <Video ref={videoEl}/>
            </VideoGrid>
            <Msg>
                <ChatLog ref={chatLog}>
                    {receivedMsg.map((msg, idx) => 
                    <MessageBox key={idx}>
                        <Message>{msg}</Message>
                    </MessageBox>)}
                </ChatLog>
                <InputPanel>
                    <InputBox onClick={onInputBoxClick}>
                        <InputChat rows={1} placeholder="메세지를 입력해 주세요" maxLength={100} required onKeyDown={onEnter} onChange={onChange} value={msg} ref={inputChat}/>
                    </InputBox>
                    <SendChatBtn onClick={onBtnClick}><FaRegPaperPlane/></SendChatBtn>
                </InputPanel>
            </Msg>
        </div>
    );
}

export default VideoChat;
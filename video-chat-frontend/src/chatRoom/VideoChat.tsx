import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import SockJS from "sockjs-client";
import Stomp from "stompjs";
import { FaRegPaperPlane } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router";
import axios from "axios";

const InputPanel = styled.div`
    position: sticky;
    left: 0;
    right: 0;
    bottom: 0;
    height: 60px;    
    background-color: ${props => props.theme.color.bgColor};
    border-top: 2px solid #e6d5d5;
    padding-left: 20px;
    padding-right: 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-shrink: 0;
`

const InputBox = styled.div`
    height: 50px;
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
    height: 30px;
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

const Video = styled.video.attrs({autoPlay: true, playsInline: true, width: 640, height: 320})`
    width: 100%;
    height: 100%;
`

const Msg = styled.div`
    position: fixed;
    right: 0;
    top: 0;
    bottom: 0;
    border-left: 4px solid #e6d5d5;
    width: 460px;
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    background-color: whitesmoke;
`

const VideoGrid = styled.div`
    height: 980px;
    width: 1400px;
    justify-content: center;
    display: grid;
    grid-template-columns: repeat(3, 400px);
    grid-auto-rows: 320px;
    gap: 3px;
    padding-right: 460px;
    padding-top: 10px;
`

const Stream = styled.div`
    background-color: black;
`

function VideoChat() {

    const videoEl = useRef<HTMLVideoElement>(null);

    const {state: roomKey} = useLocation();

    const stomp = useRef<Stomp.Client>();
    
    const inputChat = useRef<HTMLTextAreaElement>(null);
    
    const [receivedMsg, setReceivedMsg] = useState<string[]>([]);

    const [remoteStreams, setRemoteStreams] = useState<Map<string, MediaStream | null>>(new Map<string, MediaStream | null>());

    const [remoteVideos, setRemoteVideos] = useState<JSX.Element[]>([]);
    
    const [msg, setMsg] = useState("");

    const chatLog = useRef<HTMLDivElement>(null);

    const localStream = useRef<MediaStream>();

    const nickname = sessionStorage.getItem("nickname");

    const navigate = useNavigate();

    useEffect(() => {

        const from = sessionStorage.getItem("username");

        const myPeerConnections = new Map<string, RTCPeerConnection>();

        const peerConnectionConfig = {
            'iceServers': [
                {'urls': 'stun:stun.stunprotocol.org:3478'},
                {'urls': 'stun:stun.l.google.com:19302'},
            ]
        };

        const uuid = () => {
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                var r = Math.random() * 16 | 0, v = c === 'x' ? r : ((r & 0x3) | 0x8);
                return v.toString(16);
            });
        }

        const stompConn = () => {
            
            return new Promise<void>((resolve, reject) => {
                const sessionId = uuid();
                const ws = new SockJS("http://localhost:8080/stomp", [], {
                    sessionId: () => {
                        return sessionId;
                    },
                });
                stomp.current = Stomp.over(ws);
                stomp.current.connect({}, () => {
                    enterRoom(sessionId);
                    stomp.current?.subscribe(`/exchange/chat.exchange/room.${roomKey}`, (message) => {
                        const json = JSON.parse(message.body);
                        if(json.type === "message") {
                            setReceivedMsg(receivedMsg => [...receivedMsg, `${json.nickname} : ${json.msg}`]);
                        } else if(json.type === "join") {
                            if(json.from !== from) {
                                setRemoteStreams(remoteStreams => {
                                    const updated = new Map<string, MediaStream | null>(remoteStreams);
                                    updated.set(json.streamId, null);
                                    return updated;
                                });
                                makeOffer(json.from);
                            }
                        } else if(json.type === "offer") {
                            if(from === json.target) {
                                setRemoteStreams(remoteStreams => {
                                    const updated = new Map<string, MediaStream | null>(remoteStreams);
                                    updated.set(json.streamId, null);
                                    return updated;
                                });
                                makeAnswer(json.from, json.sdp);
                            }
                        } else if(json.type === "answer") {
                            if(from === json.target) {
                                myPeerConnections.get(json.from)?.setRemoteDescription(json.sdp);
                            }
                        } else if(json.type === "ice") {
                            if(from === json.target) {
                                myPeerConnections.get(json.from)?.addIceCandidate(json.iceCandidate);
                            }
                        } else if(json.type === "leave") {
                            const myPeerConnection = myPeerConnections.get(json.from);
                            if(myPeerConnection) {
                                disconnect(myPeerConnection);
                            }
                            setRemoteStreams(remoteStreams => {
                                const updated = new Map<string, MediaStream | null>(remoteStreams);
                                updated.delete(json.streamId);
                                return updated;
                            })
                        }
                    });                
                })
                resolve();
            });
        }

        const handleStompConnection = async () => {
            await stompConn();
            videoConn();
        }

        const enterRoom = async (sessionId: string) => {
            const response = (await axios.post(`http://localhost:8080/api/joinRoom`, {
                roomKey,
                sessionId,
            }, {
                withCredentials: true,
            })).status
            if(response !== 200) {
                navigate("/");
            }
        }

        const videoConn = async () => {
            if(!videoEl.current) {
                navigate("/", {replace: true});
            }
            try{                
                if(!videoEl.current) {
                    return;
                }
                localStream.current = await navigator.mediaDevices.getUserMedia({
                    audio: true,
                    video: {
                        facingMode: "user"
                    },
                });
                videoEl.current.srcObject = localStream.current;
                stomp.current?.send(`/chat/room.${roomKey}`, {}, JSON.stringify({type: "join", from, nickname, roomKey, streamId: localStream.current.id}));
            } catch(err: any) {
                console.log(err);
                if(!videoEl.current) {
                    return;
                }
                localStream.current = new MediaStream();
                videoEl.current.srcObject = localStream.current;
                stomp.current?.send(`/chat/room.${roomKey}`, {}, JSON.stringify({type: "join", from, nickname, roomKey, streamId: localStream.current.id}));
            }
        }

        const makeAnswer = async (target: string, receivedOffer: RTCSessionDescriptionInit) => {
            const newPeerConnection = createPeerConnection(target);
            if(!newPeerConnection) {
                return;
            }
            await newPeerConnection.setRemoteDescription(receivedOffer);
            const answer = await newPeerConnection.createAnswer();
            await newPeerConnection.setLocalDescription(answer);
            stomp.current?.send(`/chat/room.${roomKey}`, {}, JSON.stringify({type: "answer", from, target, sdp: newPeerConnection.localDescription}));
        }

        const createPeerConnection = (target: string) => {
            if(!localStream.current) {
                console.log("no media");
                return null;
            }
            const newPeerConnection = new RTCPeerConnection(peerConnectionConfig);
            myPeerConnections.set(target, newPeerConnection);
            newPeerConnection.onicecandidate = (data) => {
                stomp.current?.send(`/chat/room.${roomKey}`, {}, JSON.stringify({type: "ice", from, target, iceCandidate: data.candidate}));
            }
            newPeerConnection.ontrack = handleTrack;
            localStream.current.getTracks().forEach(track => {
                if(!localStream.current) {
                    console.log("no media");
                    return;
                }
                newPeerConnection.addTrack(track, localStream.current);
            });
            return newPeerConnection;
        }

        const makeOffer = async (target: string) => {
            const newPeerConnection = createPeerConnection(target);
            if(!newPeerConnection) {
                return;
            }
            if(localStream.current?.getTracks().length === 0) {
                const offer = await newPeerConnection.createOffer({offerToReceiveAudio: true, offerToReceiveVideo: true});
                await newPeerConnection.setLocalDescription(offer);
                stomp.current?.send(`/chat/room.${roomKey}`, {}, JSON.stringify({type: "offer", from, target, streamId: localStream.current.id, sdp: newPeerConnection.localDescription})); 
            } else {
                newPeerConnection.onnegotiationneeded = async () => {
                    const offer = await newPeerConnection.createOffer();
                    await newPeerConnection.setLocalDescription(offer);
                    stomp.current?.send(`/chat/room.${roomKey}`, {}, JSON.stringify({type: "offer", from, target, streamId: localStream.current?.id, sdp: newPeerConnection.localDescription})); 
                }
            }
        }

        const handleTrack = (data: RTCTrackEvent) => {
            setRemoteStreams(remoteStreams => {
                const updated = new Map<string, MediaStream | null>(remoteStreams);
                updated.set(data.streams[0].id, data.streams[0]);
                return updated;
            });
        }

        const disconnect = (peerConnection: RTCPeerConnection) => {
            peerConnection.onicecandidate = null;
            peerConnection.ontrack = null;
            peerConnection.onnegotiationneeded = null;
            peerConnection.close();
        }

        const leave = () => {
            stomp.current?.disconnect(() => {
                myPeerConnections.forEach(myPeerConnection => disconnect(myPeerConnection));
                localStream.current?.getTracks().forEach(track => {
                    track.stop();
                });
            });
        };

        handleStompConnection();

        return leave;

    }, [roomKey, nickname, navigate]);
    
    useEffect(() => {
        if(chatLog.current) {
            chatLog.current.scrollTop = chatLog.current.scrollHeight;
        }
    }, [receivedMsg]);

    useEffect(() => {
        setRemoteVideos(remoteVideos => Array.from(remoteStreams.values()).map((remoteStream, idx) => 
            <Stream key={idx}>
                <Video ref={video => {
                    if(video) {
                        video.srcObject = remoteStream;
                    }
                }} />
            </Stream>
        ))
    }, [remoteStreams]);
    
    const onEnter = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if(event.key === "Enter") {
            event.preventDefault();
            stomp.current?.send(`/chat/room.${roomKey}`, {}, JSON.stringify({type: "message", nickname, msg}));
            setMsg("");
        }
    }
    
    const onChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setMsg(msg => event.target.value);
    }
    
    const onBtnClick = () => {
        stomp.current?.send(`/chat/room.${roomKey}`, {}, JSON.stringify({type: "message", nickname, msg}));
        setMsg("");
    }
    
    const onInputBoxClick = () => {
        inputChat.current?.focus();
    }

    return (
        <div>
            <VideoGrid>
                <Stream>
                    <Video ref={videoEl} />
                </Stream>
                {remoteVideos}
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
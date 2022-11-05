import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import SockJS from "sockjs-client";
import Stomp from "stompjs";
import { FaRegPaperPlane } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router";
import axios, { AxiosError } from "axios";
import handleAxiosException from "../exception/handleAxiosException";
import myData from "../data/data";
import { useRecoilValue } from 'recoil';
import { nicknameAtom, usernameAtom } from "../Auth/LoginState";

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

const MutedVideo = styled.video.attrs({autoPlay: true, playsInline: true, width: 640, height: 320, muted: true})`
    width: 100%;
    height: 100%;
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

    // const nickname = sessionStorage.getItem("nickname");
    const nickname = useRecoilValue(nicknameAtom);

    const navigate = useNavigate();
    
    const from = useRecoilValue(usernameAtom);

    useEffect(() => {

        // const from = sessionStorage.getItem("username");

        const myPeerConnections = new Map<string, RTCPeerConnection>();

        const peerConnectionConfig = {
            'iceServers': [
                {'urls': 'stun:stun.stunprotocol.org:3478'},
                {'urls': 'stun:stun.l.google.com:19302'},
            ]
        };

        /**
         * UUID로 세션 아이디를 생성하는 함수
         * @returns 
         */
        const uuid = () => {
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                var r = Math.random() * 16 | 0, v = c === 'x' ? r : ((r & 0x3) | 0x8);
                return v.toString(16);
            });
        }
        
        /**
         * STOMP를 연결하고 subscribe 메세지를 보내는 함수
         */
        const handleStompConnection = () => {
            const sessionId = uuid();
            const ws = new SockJS(`${myData.domain}/stomp`, [], {
                sessionId: () => {
                    return sessionId;
                },
            });
            stomp.current = Stomp.over(ws);
            stomp.current.heartbeat.outgoing = 1000;
            stomp.current.heartbeat.incoming = 0;
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
                videoConn();
            })
        };
    
        /**
         * 채팅룸 참여 시 서버로 STOMP 세션 아이디를 보내는 함수
         * @param sessionId 웹소켓 세션 아이디
         */
        const enterRoom = (sessionId: string) => {
            try {
                axios.post(`${myData.domain}/api/joinRoom`, {
                    roomKey,
                    sessionId,
                }, {
                    withCredentials: true,
                });
            } catch(err: unknown | AxiosError) {
                handleAxiosException(err);
                navigate("/");
            }
        }

        
        /**
         * 내 컴퓨터의 미디어 스트림을 얻어오고 서버로 join 메세지를 보내는 함수
         */
        const videoConn = async () => {
            try{
                if(!videoEl.current) {
                    alert("비디오를 불러오는데 실패했습니다.");
                    window.location.replace("/");
                    return;
                }
                localStream.current = await navigator.mediaDevices.getUserMedia({
                    audio: {echoCancellation: true},
                    video: {
                        facingMode: "user"
                    },
                });
                videoEl.current.srcObject = localStream.current;
                stomp.current?.send(`/chat/room.${roomKey}`, {}, JSON.stringify({type: "join", from, nickname, roomKey, streamId: localStream.current.id}));
            } catch(err: any) {
                console.log(err);
                if(!videoEl.current) {
                    alert("비디오를 불러오는데 실패했습니다.");
                    window.location.replace("/");
                    return;
                }
                localStream.current = new MediaStream();
                videoEl.current.srcObject = localStream.current;
                stomp.current?.send(`/chat/room.${roomKey}`, {}, JSON.stringify({type: "join", from, nickname, roomKey, streamId: localStream.current.id}));
            }
        }

        /**
         * offer 메세지를 받은 후 answer 생성 후 서버로 answer 메세지를 보내는 함수
         * @param target offer를 보낸 클라이언트의 username
         * @param receivedOffer 상대방으로부터 받은 offer
         */
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

        /**
         * offer 메세지를 받은 후 offer 메세지를 보낸 클라이언트와의 peer connection을 생성하고 ice 교환을 위한 이벤트 리스너를 붙이고,
         * 미디어 트랙을 peer connection에 더하는 ㅎ마수
         * @param target peer connection에 연결할 상대방의 username
         */
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

        /**
         * 상대방으로 부터 join 메세지를 받았을 때 offer를 생성하고 peer connection을 생성 한 뒤 offer 메세지를 보내는 함수
         * @param target peer connection로 연결할 상대방의 username
         */
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

        /**
         * 상대방으로부터 미디어 스트림을 받았을 때 해당 스트림을 Map에 저장하는 함수
         */
        const handleTrack = (data: RTCTrackEvent) => {
            setRemoteStreams(remoteStreams => {
                const updated = new Map<string, MediaStream | null>(remoteStreams);
                updated.set(data.streams[0].id, data.streams[0]);
                return updated;
            });
        }

        /**
         * peer connection 반대편의 상대방과 연결이 끊겼을 때 peer connection을 초기홯는 함수
         */
        const disconnect = (peerConnection: RTCPeerConnection) => {
            peerConnection.onicecandidate = null;
            peerConnection.ontrack = null;
            peerConnection.onnegotiationneeded = null;
            peerConnection.close();
        }

        /**
         * 채팅룸에서 나갈 때 실행하는 함수
         */
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

    //Map에 저장된 미디어 스트림을 렌더링하기 위해 배열로 변환
    //useEffect에서 변환하지 않으면 채팅을 칠 때마다 리렌더링 되서 영상이 깜빡거린다.
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
                    <MutedVideo ref={videoEl} />
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
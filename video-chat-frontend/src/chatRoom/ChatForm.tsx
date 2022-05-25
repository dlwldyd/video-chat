import { useEffect, useRef, useState } from "react";
import SockJS from "sockjs-client";
import Stomp from "stompjs";
import styled from "styled-components";
import { FaRegPaperPlane } from "react-icons/fa";

const MsgContainer = styled.div`
    padding-bottom: 50px;
`

const InputPanel = styled.div`
    position: fixed;
    height: 60px;
    left: 0%;
    right: 0%;
    bottom: 0%;
    background-color: ${props => props.theme.bgColor};
    padding-left: 20px;
    padding-right: 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
`;

const InputBox = styled.div`
    height: 35px;
    background-color: ${props => props.theme.bgColor};
    display: flex;
    padding: 0px 10px;
    align-items: center;
    flex-grow: 1;
    font-size: 15px;
    &:hover {
        cursor: text;
    }
`;

const InputChat = styled.textarea`
    resize: none;
    width: 100%;
    color: ${props => props.theme.textColor};
    background-color: ${props => props.theme.bgColor};
    border: none;
    overflow: hidden;
    vertical-align: middle;
    font-size: inherit;
    border-bottom: 1px solid ${props => props.theme.borderColor};
    &:focus {
        outline: none;
        border-bottom: 2px solid ${props => props.theme.borderColor};
    }
`;

const SendChatBtn = styled.button`
    height: 40px;
    width: 40px;
    margin-left: 10px;
    background-color: ${props => props.theme.bgColor};
    color: ${props => props.theme.textColor};
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    border: none;
    &:active {
        background-color: ${props => props.theme.clickColor};
    }
    &:not(:active) {
        transition: background-color 0.3s ease-out;
    }
`;

const MessageBox = styled.div`
    margin: 10px 15px;
    display: flex;
    align-items: center;
`

const Message = styled.span`
    font-family: "Noto Sans CJK KR";
    color: ${props => props.theme.textColor};
    font-size: 14px;
`

function ChatForm() {
    const stomp = useRef<Stomp.Client>();
    const inputChat = useRef<HTMLTextAreaElement>(null);
    const [receivedMsg, setReceivedMsg] = useState<string[]>([]);
    const [msg, setMsg] = useState("");
    useEffect(() => {
        const ws = new SockJS("http://localhost:8080/stomp");
        stomp.current = Stomp.over(ws);
        stomp.current.connect({}, () => {
            stomp.current?.subscribe(`/exchange/chat.exchange/room.1`, (message) => {
                setReceivedMsg(receivedMsg => [...receivedMsg, message.body.slice(1, -1)]);
            });
        });
        return () => {
            stomp.current?.disconnect(() => {});
        }
    }, []);
    useEffect(() => {
        window.scrollBy({top: 100});
    }, [receivedMsg])
    const onEnter = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if(event.key === "Enter") {
            event.preventDefault();
            stomp.current?.send(`/chat/room.1`, {}, msg);
            setMsg("");
        }
    }
    const onChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setMsg(event.target.value);
    }
    const onBtnClick = () => {
        stomp.current?.send(`/chat/room.1`, {}, msg);
        setMsg("");
    }
    const onInputBoxClick = () => {
        inputChat.current?.focus();
    }

    return (
        <div>
            <MsgContainer>
                {receivedMsg.map((msg, idx) => 
                <MessageBox key={idx}>
                    <Message>{msg}</Message>
                </MessageBox>)}
            </MsgContainer>
            <InputPanel>
                <InputBox onClick={onInputBoxClick}>
                    <InputChat rows={1} placeholder="메세지를 입력해 주세요" maxLength={100} required onKeyDown={onEnter} onChange={onChange} value={msg} ref={inputChat}/>
                </InputBox>
                <SendChatBtn onClick={onBtnClick}><FaRegPaperPlane/></SendChatBtn>
            </InputPanel>
        </div>
    );
}

export default ChatForm;
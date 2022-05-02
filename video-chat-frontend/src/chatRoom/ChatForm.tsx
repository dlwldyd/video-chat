import { useEffect, useRef, useState } from "react";
import SockJS from "sockjs-client";
import Stomp from "stompjs";
import styled from "styled-components";

const InputPanel = styled.div`
    position: fixed;
    left: 0%;
    right: 0%;
    bottom: 0%;
`;

const MsgContainer = styled.div`
    padding-bottom: 10px;
`

function ChatForm() {
    const stomp = useRef<Stomp.Client>();
    const [receivedMsg, setReceivedMsg] = useState<string[]>([]);
    const [msg, setMsg] = useState("");
    useEffect(() => {
        const ws = new SockJS("http://localhost:8080/stomp");
        stomp.current = Stomp.over(ws);
        stomp.current.connect({}, () => {
            stomp.current?.subscribe("/subs/room", (message) => {
                setReceivedMsg(receivedMsg => [...receivedMsg, message.body]);
            });
        });
        return () => {
            stomp.current?.disconnect(() => {});
        }
    }, []);
    useEffect(() => {
        window.scrollBy({top: 100});
    }, [receivedMsg])
    const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        stomp.current?.send("/chat/room", {}, msg);
        setMsg("");
    }
    const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setMsg(event.target.value);
    }

    return (
        <div>
            <MsgContainer>
                {receivedMsg.map((msg, idx) => 
                <div>
                    <span key={idx}>{msg}</span>
                </div>)}
            </MsgContainer>
            <InputPanel>
                <form onSubmit={onSubmit}>
                    <input type="text" placeholder='메세지 입력' onChange={onChange} value={msg} required/>
                    <button>보내기</button>
                </form>
            </InputPanel>
        </div>
    );
}

export default ChatForm;
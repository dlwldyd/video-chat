import axios from "axios";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { useState } from 'react';
import ModalForm from "../modal/ModalForm";
import { useNavigate } from "react-router";
import { FaUserEdit } from "react-icons/fa";

const LeftButtonSet = styled.div`
    display: flex;
    width: 320px;
    justify-content: space-between;
    align-items: center;
`

const RightButtonSet = styled.div`
    display: flex;
    width: 100px;
    justify-content: space-between;
    align-items: flex-end;
`

const NavContainer = styled.nav`
    position: fixed;
    height: 60px;
    left: 0%;
    right: 0%;
    top: 0%;
    background-color: ${props => props.theme.color.navColor};
    display: flex;
    justify-content: space-around;
    align-items: center;
    box-shadow: 0px 1px 2px 0.5px #d5c4a1;
`

const HomeButton = styled(Link)`
    font-family: ${props => props.theme.font};;
    color: ${props => props.theme.color.navTextColor};
    font-size: 30px;
    font-weight: bolder;
    text-decoration: none;
    margin-right: 35px;
`

const LoginButton = styled(Link)`
    font-family: ${props => props.theme.font};
    color: ${props => props.theme.color.navTextColor};
    font-size: 20px;
    font-weight: normal;
    text-decoration: none;
`

const CreateChatRoom = styled.button`
    all: unset;
    font-family: ${props => props.theme.font};
    font-weight: normal;
    font-size: 17px;
    color: #a89984;
    &:hover {
        color: #fb4934;
        cursor: pointer;
    }
`

const SearchChat = styled(Link)`
    all: unset;
    font-family: ${props => props.theme.font};
    font-weight: normal;
    font-size: 17px;
    color: #a89984;
    &:hover {
        color: #fb4934;
        cursor: pointer;
    }
`

const LogoutButton = styled(Link)`
    text-decoration: none;
    font-family: ${props => props.theme.font};
    color: ${props => props.theme.color.navTextColor};
    font-size: 20px;
    font-weight: normal;
`

const ModalContainer = styled.form`
    width: 100%;
    height: 100%;
    display: flex;
    font-family: ${props => props.theme.font};
    flex-direction: column;
    justify-content: space-around;
    align-items: flex-end;
`

const InputSet = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
`

const Label = styled.label`
    width: 380px;
    &:hover {
        cursor: pointer;
    }
`

const Input = styled.input`
    width: 380px;
    height: 38px;
    border-radius: 5px;
    border: 1px solid ${props => props.theme.color.borderColor};
    margin-top: 10px;
    margin-bottom: 10px;
    font-size: 17px;
    &:focus {
        border: 3px solid #458588;
        margin-top: 8px;
        margin-bottom: 8px;
    }
`

const Btn = styled.button`
    all: unset;
    border-radius: 10px;
    background-color: ${props => props.theme.color.btnColor};
    color: white;
    font-size: 20px;
    margin-right: 45px;
    padding: 5px 20px;
    &:hover {
        cursor: pointer;
    }
`

const NickNameEdit = styled.div`
    &:hover {
        cursor: pointer;
    }
`

function Nav() {

    const [loginState, setLoginState] = useState(sessionStorage.getItem("authenticated") === "true");

    const [createRoomOpen, setCreateRoomOpen] = useState(false);

    const [editNicknameOpen, setEditNicknameOpen] = useState(false);

    const [roomName, setRoomName] = useState("");

    const [password, setPassword] = useState("");

    const [nickname, setNickname] = useState("");

    const navigate = useNavigate();

    const onLogout = () => {
        const logout = async () => {
            const statusCode = (await axios.get("http://localhost:8080/logout", {
                withCredentials: true
            })).status
            console.log(statusCode);
            if(statusCode === 200) {
                sessionStorage.setItem("authenticated", "false");
                sessionStorage.removeItem("nickname");
                sessionStorage.removeItem("email");
                setLoginState(loginState => false);
            }
        }
        try{
            logout();
        } catch(err: any) {
            console.log(err);
        }
    }

    const onClick = () => {
        setCreateRoomOpen(modalOpen => true);
    }

    const onOpen = () => {
        setEditNicknameOpen(editNicknameOpen => true);
    }

    const onSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        if(roomName === "") {
            alert("방 이름을 입력해주세요");
        } else {
            getRoomKey();
        }
    }

    const onRoomNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRoomName(roomName => event.target.value);
    }

    const onNickNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNickname(nickname => event.target.value);
    }

    const onPassChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(password => event.target.value);
    }

    const getRoomKey = async () => {
        const { roomKey } = await (await axios.post("http://localhost:8080/api/createRoom", {
            roomName,
            password,
        }, {
            withCredentials: true,
        })).data;
        navigate(`/video-chat`, {state: roomKey});
    }
    
    const onEnterFCR = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if(event.key === "Enter") {
            if(roomName === "") {
                alert("방 이름을 입력해주세요");
            } else {
                getRoomKey();
            }
        }
    }

    const changeNickname = async () => {
        const response = (await axios.get(`http://localhost:8080/api/changeNickname?nickname=${nickname}`, {
            withCredentials: true,
        })).status;
        console.log(response);
        if(response === 200) {
            sessionStorage.setItem("nickname", nickname);
            alert("닉네임을 변경하였습니다.")
            setEditNicknameOpen(editNicknameOpen => false);
        } else if(response === 401 || response === 403) {
            alert("권한이 없습니다.");
        } else {
            alert("오류");
        }
    }


    const onEnterFEN = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if(event.key === "Enter") {            
            if(nickname === "") {
                alert("닉네임을 입력해주세요");
            } else {                
                changeNickname();
            }
        }
    }

    const onEdit = (event: React.MouseEvent<HTMLButtonElement>) => {
        changeNickname();
    }

    const createModal = (
        <ModalContainer action="http://localhost:8080/api/createRoom" method="POST" onSubmit={onSubmit}>
            <InputSet>
                <Label htmlFor="roomName">방 이름</Label>
                <Input id="roomName" value={roomName} onChange={onRoomNameChange} onKeyDown={onEnterFCR} />
                <Label htmlFor="password">비밀번호(선택)</Label>
                <Input id="password" type="password" value={password} onChange={onPassChange} onKeyDown={onEnterFCR} />
            </InputSet>
            <Btn type="submit">만들기</Btn>
        </ModalContainer>
    );

    const editModal = (
        <ModalContainer>
            <InputSet>
                <Label htmlFor="nickname">현재 닉네임 : ${sessionStorage.getItem("nickname")}</Label>
                <Input placeholder="변경할 닉네임을 입력해주세요" value={nickname} id="nickname" onChange={onNickNameChange} onKeyDown={onEnterFEN} />
            </InputSet>
            <Btn onClick={onEdit}>변경</Btn>
        </ModalContainer>
    )

    return (
        <div>
            <NavContainer>
                <LeftButtonSet>
                    <HomeButton to="/">VChat</HomeButton>
                    <CreateChatRoom onClick={onClick}>채팅방 생성</CreateChatRoom>
                    <SearchChat to="/search">채팅참여</SearchChat>
                </LeftButtonSet>
                <RightButtonSet>
                    {loginState ? <NickNameEdit onClick={onOpen}><FaUserEdit color="white" size="17px"/></NickNameEdit> : null}                    
                    {loginState ? <LogoutButton onClick={onLogout} to="/">Logout</LogoutButton> : <LoginButton to="/login">Login</LoginButton>}
                </RightButtonSet>
            </NavContainer>
            <ModalForm isOpen={createRoomOpen} setIsOpen={setCreateRoomOpen} content={createModal}></ModalForm>
            <ModalForm isOpen={editNicknameOpen} setIsOpen={setEditNicknameOpen} content={editModal}></ModalForm>
        </div>
    );
}

export default Nav
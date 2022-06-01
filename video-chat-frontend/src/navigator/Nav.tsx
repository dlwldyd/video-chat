import axios from "axios";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { useRef, useState } from 'react';
import ModalForm from "../modal/ModalForm";

const ButtonSet = styled.div`
    display: flex;
    width: 1fr;
    justify-content: space-between;
    align-items: center;
`

const NavContainer = styled.nav`
    position: fixed;
    height: 60px;
    left: 0%;
    right: 0%;
    top: 0%;
    background-color: ${props => props.theme.navColor};
    display: flex;
    justify-content: space-around;
    align-items: center;
    box-shadow: 0px 1px 2px 0.5px #d5c4a1;
`

const HomeButton = styled(Link)`
    font-family: "Noto Sans CJK KR";
    color: ${props => props.theme.navTextColor};
    font-size: 30px;
    font-weight: bolder;
    text-decoration: none;
    margin-right: 50px;
`

const LoginButton = styled(Link)`
    font-family: "Noto Sans CJK KR";
    color: ${props => props.theme.navTextColor};
    font-size: 20px;
    font-weight: normal;
    text-decoration: none;
`

const CreateChatRoom = styled.button`
    all: unset;
    font-family: "Noto Sans CJK KR";
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
    font-family: "Noto Sans CJK KR";
    color: ${props => props.theme.navTextColor};
    font-size: 20px;
    font-weight: normal;
`

function Nav() {

    const [loginState, setLoginState] = useState(sessionStorage.getItem("authenticated") === "true");

    const [modalOpen, setModalOpen] = useState(false);

    const onLogout = () => {
        const logout = async () => {
            const statusCode = (await axios.get("http://localhost:8080/logout", {
                withCredentials: true
            })).status
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
        setModalOpen(modalOpen => true);
    }

    const modalContent = (
        <div style={{
            width: "100%",
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
        }}>hello</div>
    );

    return (
        <div>
            <NavContainer>
                <ButtonSet>
                    <HomeButton to="/">VChat</HomeButton>
                    <CreateChatRoom onClick={onClick}>채팅방 생성</CreateChatRoom>
                </ButtonSet>
                {loginState ? <LogoutButton onClick={onLogout} to="/">Logout</LogoutButton> : <LoginButton to="/login">Login</LoginButton>}
            </NavContainer>
            <ModalForm isOpen={modalOpen} setIsOpen={setModalOpen} content={modalContent}></ModalForm>
        </div>
    );
}

export default Nav
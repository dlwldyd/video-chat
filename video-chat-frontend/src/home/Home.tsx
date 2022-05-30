import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

axios.defaults.withCredentials = true;

const publicUrl = process.env.PUBLIC_URL;

const HomeContainer = styled.div`
    background-image: url(${publicUrl}/web/video-chat.png);
    width: 100%;
    height: 98vh;
`

const ButtonSet = styled.div`
    display: flex;
    width: 1fr;
    justify-content: space-between;
    align-items: center;
`

const Nav = styled.nav`
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

const CreateChatRoom = styled(LoginButton)`
    font-size: 17px;
    color: #a89984;
    &:hover {
        color: #fb4934;
    }
`

const LogoutButton = styled.button`
    all: unset;
    font-family: "Noto Sans CJK KR";
    color: ${props => props.theme.navTextColor};
    font-size: 20px;
    font-weight: normal;
    &:hover {
        cursor: pointer;
    }
`

function Home() {

    const [loginState, setLoginState] = useState(false);

    const onClick = () => {
        const logout = async () => {
            const statusCode = (await axios.get("http://localhost:8080/logout")).status
            if(statusCode === 200) {
                setLoginState(loginState => false);
                sessionStorage.setItem("authenticated", "false");
                sessionStorage.removeItem("nickname");
                sessionStorage.removeItem("email");
            }
        }
        try{
            logout();
        } catch(err: any) {
            console.log(err);
        }
    }
    
    useEffect(() => {
        const getMemberInfo = async () => {
            const json = await (await axios.get("http://localhost:8080/api/memberInfo")).data;
            sessionStorage.setItem("authenticated", json.authenticated);
            setLoginState(loginState => json.authenticated);
            if(json.authenticated === "true") {
                sessionStorage.setItem("nickname", json.nickname);
                sessionStorage.setItem("email", json.email);
            }
        }
        try {
            getMemberInfo();
        } catch(err: any) {
            console.log(err);
        }
    }, []);

    return (
        <HomeContainer>
            <Nav>
                <ButtonSet>
                    <HomeButton to="/">VChat</HomeButton>
                    <CreateChatRoom to="/">채팅방 생성</CreateChatRoom>
                </ButtonSet>
                {loginState ? <LogoutButton onClick={onClick}>Logout</LogoutButton> : <LoginButton to="/login">Login</LoginButton>}
            </Nav>
        </HomeContainer>
    );
}

export default Home;
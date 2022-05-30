import styled from "styled-components";
import { useEffect } from 'react';

const LoginContainer = styled.div`
    width: 100%;
    height: 98vh;
    display: flex;
    justify-content: center;
    align-items: center;
`

const LoginBox = styled.div`
    width: 600px;
    height: 300px;
    box-shadow: 1px 1px 4px 0px #ebdbb2; 
    background-color: #f9f5d7;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`

const LoginImg = styled.img`
    width: 400px;
    height: 100px;
`

function Login() {

    const publicUrl = process.env.PUBLIC_URL;

    useEffect(() => {
        
    }, []);

    return (
        <LoginContainer>
            <LoginBox>
                <a href="http://localhost:8080/oauth2/authorization/google?redirect_uri=http://localhost:3000">
                    <LoginImg src={`${publicUrl}/web/2x/btn_google_signin_light_normal_web@2x.png`} alt=""></LoginImg>
                </a>
                <a href="http://localhost:8080/oauth2/authorization/naver?redirect_uri=http://localhost:3000">
                    <LoginImg src={`${publicUrl}/2021_Login_with_naver_guidelines_En/btnG_official.png`} alt=""></LoginImg>
                </a>
            </LoginBox>
        </LoginContainer>
    );
}

export default Login;
import styled from "styled-components";
import { useEffect } from 'react';

const LoginContainer = styled.div`
    width: 100%;
    height: 980px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-family: ${props => props.theme.font};
`

const LoginBox = styled.div`
    width: 600px;
    height: 500px;
    background-color: ${props => props.theme.color.bgColor};
    border: 5px solid #e6d5d5;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`

const GoogleLogin = styled.img`
    width: 400px;
    height: 100px;
`

const NaverLogin = styled.img`
    width: 390px;
    height: 90px;
`

const Head = styled.div`
    font-size: 80px;
    margin-bottom: 50px;
`

function Login() {

    const publicUrl = process.env.PUBLIC_URL;

    useEffect(() => {
        
    }, []);

    return (
        <LoginContainer>
            <LoginBox>
                <Head>로그인</Head>
                <a href="http://localhost:8080/oauth2/authorization/google?redirect_uri=http://localhost:3000">
                    <GoogleLogin src={`${publicUrl}/web/2x/btn_google_signin_light_normal_web@2x.png`} alt=""></GoogleLogin>
                </a>
                <a href="http://localhost:8080/oauth2/authorization/naver?redirect_uri=http://localhost:3000">
                    <NaverLogin src={`${publicUrl}/2021_Login_with_naver_guidelines_En/btnG_official.png`} alt=""></NaverLogin>
                </a>
            </LoginBox>
        </LoginContainer>
    );
}

export default Login;
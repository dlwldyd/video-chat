import axios, { AxiosError } from "axios";
import { useNavigate } from "react-router";
import styled from "styled-components";
import myData from "../data/data";
import handleAxiosException from "../exception/handleAxiosException";

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

const NoLogin = styled.button`
    all: unset;
    font-family: ${props => props.theme.font};
    font-size: 30px;
    width: 390px;
    height: 90px;
    border-radius: 6px;
    color: white;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: black;
    &:hover {
        cursor: pointer;
    }
`

const Head = styled.div`
    font-size: 80px;
    margin-bottom: 30px;    
`

function Login() {

    const navigate = useNavigate();

    const publicUrl = process.env.PUBLIC_URL;

    //로그인 없이 체험하기
    const onClick = async () => {
        try{
            const { username, password } = await (await axios.get(`${myData.domain}/tmp/member`)).data;
            const form = new FormData();
            form.append("username", username);
            form.append("password", password);
            const status = (await axios.post(`${myData.domain}/login`, form)).status;
            if(status === 200) {
                navigate("/fetch");
            }
        } catch(err: unknown | AxiosError) {
            handleAxiosException(err);
            navigate("/");
        }
    }

    return (
        <LoginContainer>
            <LoginBox>
                <Head>로그인</Head>
                <a href={`${myData.domain}/oauth2/authorization/google`}>
                    <GoogleLogin src={`${publicUrl}/web/2x/btn_google_signin_light_normal_web@2x.png`} alt=""></GoogleLogin>
                </a>
                <a href={`${myData.domain}/oauth2/authorization/naver`}>
                    <NaverLogin src={`${publicUrl}/2021_Login_with_naver_guidelines_En/btnG_official.png`} alt=""></NaverLogin>
                </a>
                <NoLogin onClick={onClick}>로그인 없이 체험하기</NoLogin>
            </LoginBox>
        </LoginContainer>
    );
}

export default Login;
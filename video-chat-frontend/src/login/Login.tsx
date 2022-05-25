import styled from "styled-components";

const LoginContainer = styled.div`
    width: 100%;
    height: 98vh;
    display: flex;
    justify-content: center;
    align-items: center;
`;

const LoginBox = styled.div`
    width: 30vw;
    height: 30vh;
    box-shadow: 1px 1px 4px 0px #ebdbb2; 
    background-color: #f9f5d7;
    display: flex;
    justify-content: center;
    align-items: center;
`;

function Login() {

    const publicUrl = process.env.PUBLIC_URL;

    return (
        <LoginContainer>
            <LoginBox>
                <a href="http://localhost:8080/oauth2/authorization/google">
                    <img src={`${publicUrl}/web/2x/btn_google_signin_light_normal_web@2x.png`} alt=""></img>
                </a>
            </LoginBox>
        </LoginContainer>
    );
}

export default Login;
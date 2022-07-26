import axios, { AxiosError } from "axios";
import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useSetRecoilState } from "recoil";
import styled from "styled-components";
import myData from "../data/data";
import handleAxiosException from "../exception/handleAxiosException";
import { loginStateAtom, nicknameAtom, usernameAtom } from "./LoginState";

const Box = styled.div`
    width: 100%;
    height: 98vh;
    display: flex;
    justify-content: center;
    align-items: center;
`

const Loading = styled.div`
    font-size: 100px;
    font-family: ${props => props.theme.font};;
`

function FetchMemberInfo() {

    const navigate = useNavigate();

    const setLoginState = useSetRecoilState(loginStateAtom);
    
    const setUsername = useSetRecoilState(usernameAtom);

    const setNickname = useSetRecoilState(nicknameAtom);

    // 서버로부터 사용자 로그인 정보를 가져와서 세션 스토리지에 저장한다.
    useEffect(() => {
        const getMemberInfo = async () => {
            const json = await (await axios.get(`${myData.domain}/api/memberInfo`, {
                withCredentials: true
            })).data;
            // sessionStorage.setItem("authenticated", json.authenticated);
            setLoginState(loginState => true);
            if(json.authenticated) {
                // sessionStorage.setItem("username", json.username);
                // sessionStorage.setItem("nickname", json.nickname);
                setUsername(username => json.username);
                setNickname(nickname => json.nickname);
            }
            navigate("/", {replace: true});
        }
        try {
            getMemberInfo();
        } catch(err: unknown | AxiosError) {
            handleAxiosException(err);
        }
    }, [navigate]);

    return (
        <Box>
            <Loading>로그인 중..</Loading>
        </Box>
    )
}
export default FetchMemberInfo;
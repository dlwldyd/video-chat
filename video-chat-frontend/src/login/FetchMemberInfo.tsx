import axios, { AxiosError } from "axios";
import { useEffect } from "react";
import { useNavigate } from "react-router";
import styled from "styled-components";
import handleAxiosException from "../handleException/handleAxiosException";

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

    useEffect(() => {
        const getMemberInfo = async () => {
            const json = await (await axios.get("http://localhost:8080/api/memberInfo", {
                withCredentials: true
            })).data;
            sessionStorage.setItem("authenticated", json.authenticated);
            if(json.authenticated) {
                sessionStorage.setItem("username", json.username);
                sessionStorage.setItem("nickname", json.nickname);
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
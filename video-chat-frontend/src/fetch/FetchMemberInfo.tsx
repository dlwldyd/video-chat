import axios from "axios";
import { useEffect } from "react";
import styled from "styled-components";

const Box = styled.div`
    width: 100%;
    height: 98vh;
    display: flex;
    justify-content: center;
    align-items: center;
`

const Loading = styled.div`
    font-size: 100px;
    font-family: "Noto Sans CJK KR";
`

function FetchMemberInfo() {
    useEffect(() => {
        const getMemberInfo = async () => {
            const json = await (await axios.get("http://localhost:8080/api/memberInfo", {
                withCredentials: true
            })).data;
            sessionStorage.setItem("authenticated", json.authenticated);
            if(json.authenticated === "true") {
                sessionStorage.setItem("nickname", json.nickname);
                sessionStorage.setItem("email", json.email);
            }
            window.location.replace("/");
        }
        try {
            getMemberInfo();
        } catch(err: any) {
            console.log(err);
            alert("로그인 실패");
            window.location.replace("/");
        }
    }, []);
    return (
        <Box>
            <Loading>로그인 중..</Loading>
        </Box>
    )
}
export default FetchMemberInfo;
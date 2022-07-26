import { Navigate } from "react-router-dom";
import { useRecoilValue } from 'recoil';
import { loginStateAtom } from "./LoginState";

interface ValidateAuthProps {
    element: JSX.Element;
}

/**
 * 로그인이 필요한 서비스에 접근할 시 로그인이 되어있는지 검사한다.
 * @param param0 로그인이 필요한 JSX 컴포넌트
 */
function ValidateAuth({element: Element}: ValidateAuthProps): JSX.Element {

    const loginState = useRecoilValue(loginStateAtom);
    
    // if(sessionStorage.getItem("authenticated") === "true") {
    if(loginState) {
        return Element;
    }
    return <Navigate replace to="/login" />;
}

export default ValidateAuth;
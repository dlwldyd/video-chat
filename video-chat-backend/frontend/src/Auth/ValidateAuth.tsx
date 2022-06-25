import { Navigate } from "react-router-dom";

interface ValidateAuthProps {
    element: JSX.Element;
}

function ValidateAuth({element: Element}: ValidateAuthProps): JSX.Element {
    
    if(sessionStorage.getItem("authenticated") === "true") {
        return Element;
    }
    return <Navigate replace to="/login" />;
}

export default ValidateAuth;
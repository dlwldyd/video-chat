import axios, { AxiosError } from "axios";

/**
 * axios 에러 발생 시 서버로 부터 받은 에러 메세지를 출력하는 함수
 * @param err axios 에러
 */
function handleAxiosException(err: unknown | AxiosError) {

    interface ErrorResult {
        message?: string;
    }
    
    if(axios.isAxiosError(err)) {
        if(err.response?.status === 400 && typeof err.response.data === "object") {
            const json: ErrorResult | null = err.response.data;
            if(json) {
                alert(json.message);
            }
        }
    }
}

export default handleAxiosException;
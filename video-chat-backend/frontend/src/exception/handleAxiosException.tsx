import axios, { AxiosError } from "axios";

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
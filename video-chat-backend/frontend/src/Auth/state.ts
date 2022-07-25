import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";

const { persistAtom } = recoilPersist({
    key: "recoil-persist-atom",
    storage: sessionStorage
})

export const loginStateAtom = atom<boolean>({
    key: "loginState", 
    default: false, 
    effects_UNSTABLE: [persistAtom]
});

export const usernameAtom = atom<string>({
    key: "username", 
    default: "", 
    effects_UNSTABLE: [persistAtom]
});

export const nicknameAtom = atom<String>({
    key: "nickname", 
    default: "", 
    effects_UNSTABLE: [persistAtom]
});
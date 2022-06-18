import axios, { AxiosError } from "axios";
import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import Nav from "../navigator/Nav";
import { FaLock, FaAngleLeft, FaAngleRight, FaSearch } from "react-icons/fa";
import { useNavigate } from 'react-router';
import queryString from 'query-string';
import { Link } from "react-router-dom";
import ModalForm from "../modal/ModalForm";
import handleAxiosException from "../handleException/handleAxiosException";

const Container = styled.div`
    font-family: ${props => props.theme.font};
    display: flex;
    justify-content: center;
    align-items: center;
    height: 1000px;
    flex-direction: column;
`

const Table = styled.table`
    width: 1200px;
    border-spacing: 0;
`

const Thead = styled.thead`
    font-size: larger;
    height: 40px;
    background-color: ${props => props.theme.color.tableBgColor};
`

const ThRoomName = styled.th`
    border-bottom: 1px solid ${props => props.theme.color.tableBorderColor};
    border-top: 1px solid  ${props => props.theme.color.tableBorderColor};
`

const ThNumber = styled.th`
    border-bottom: 1px solid ${props => props.theme.color.tableBorderColor};
    border-top: 1px solid  ${props => props.theme.color.tableBorderColor};
`

const Tr = styled.tr`
    font-size: large;
    height: 40px;
    &:hover {
        background-color: ${props => props.theme.color.tableBgColor};
    }
`

const TdRoomName = styled.td`
    border-bottom: 1px solid ${props => props.theme.color.tableBorderColor};
`

const TdNumber = styled.td`
    width: 120px;
    text-align: center;
    border-bottom: 1px solid ${props => props.theme.color.tableBorderColor};
`

const Room = styled.span`
    &:hover {
        cursor: pointer;
    }
`

const Pagination = styled.div`
    display: flex;
    justify-content: space-between;
    margin-top: 60px;
`

const Page = styled.div`
    border: 1px solid ${props => props.theme.color.tableBorderColor};
    border-radius: 50px;
    background-color: white;
    display: flex;
    justify-content: space-around;
    margin-left: 30px;
    margin-right: 30px;
`

const PageNum = styled(Link)`
    all: unset;
    border-radius: 50px;
    background-color: white;
    padding-left: 15px;
    padding-right: 15px;
    height: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 15px;
    color: #969595;
    &:hover {
        cursor: pointer;
        background-color: ${props => props.theme.color.tableBorderColor};
    }
`

const Angle = styled(Link)`
    all: unset;
    border-radius: 50%;
    background-color: white;
    width: 40px;
    height: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
    border: 1px solid ${props => props.theme.color.tableBorderColor};
    &:hover {
        cursor: pointer;
        background-color: ${props => props.theme.color.tableBorderColor};
    }
`

const ModalContainer = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    font-family: ${props => props.theme.font};    
    flex-direction: column;
    justify-content: space-around;
    align-items: flex-end;
`

const Label = styled.label`
    width: 380px;
    font-size: larger;
    &:hover {
        cursor: pointer;
    }
`

const InputText = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
`

const Input = styled.input`
    width: 380px;
    height: 38px;
    border-radius: 5px;
    border: 1px solid ${props => props.theme.color.borderColor};
    margin-top: 10px;
    margin-bottom: 10px;
    font-size: 17px;
    &:focus {
        border: 3px solid #458588;
        margin-top: 8px;
        margin-bottom: 8px;
    }
`

const SearchBtn = styled.button`
    all: unset;
    border-radius: 10px;
    background-color: ${props => props.theme.color.btnColor};
    color: white;
    font-size: 20px;
    margin-right: 45px;
    padding: 5px 20px;
    &:hover {
        cursor: pointer;
    }
`

const SearchModalBtn = styled.div`
    width: 80px;
    height: 80px;
    display: flex;
    justify-content: center;
    align-items: center;
    &:hover {
        cursor: pointer;
    }
`

interface ClickEvent extends React.MouseEvent<HTMLSpanElement> {
    target: HTMLSpanElement;
}

function SearchRoom() {

    const [rooms, setRooms] = useState<{roomId: number, roomName: string, locked: boolean, count: number}[]>([]);

    const [totalPages, setTotalPages] = useState<number>(0);

    const [currentPage, setCurrentPage] = useState<number>(0);

    const [pageList, setPageList] = useState<number[]>([]);

    const navigate = useNavigate();

    const {page, roomName} = queryString.parse(window.location.search);

    const [searchOpen, setSearchOpen] = useState(false);

    const [pwOpen, setPwOpen] = useState(false);

    const [searchRoomName, setSearchRoomName] = useState("");

    const [roomPassword, setRoomPassword] = useState("");    

    const roomId = useRef<string | null>("");

    const getRoomKey = async (roomId: string | null) => {
        try {
            const {roomKey} = await (await axios.post("http://localhost:8080/api/getRoomKey", {
                roomId,
                password: roomPassword
            }, {
                withCredentials: true
            })).data;
            navigate(`/video-chat`, {state: roomKey});
        } catch(err: unknown | AxiosError) {
            handleAxiosException(err);
        }
        
    }

    const onClick = (event: ClickEvent) => {
        
        getRoomKey(event.target.getAttribute("data-roomid"));
    }

    const onClickLocked = (event: ClickEvent) => {
        roomId.current = event.target.getAttribute("data-roomid");
        setPwOpen(pwOpen => true);
    }

    const onSearchOpen = () => {
        setSearchOpen(searchOpen => true);
    }

    const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchRoomName(searchRoom => event.target.value);
    }

    const onChangePw = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRoomPassword(roomPassword => event.target.value);
    }

    const onSearch = () => {
        navigate(`/search?roomName=${searchRoomName}`);
        setSearchOpen(searchOpen => false);
    }

    const onEnterFS = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if(event.key === "Enter") {
            navigate(`/search?roomName=${searchRoomName}`);
            setSearchOpen(searchOpen => false);
        }
    }

    const onEnterFP = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if(event.key === "Enter") {
            getRoomKey(roomId.current);
        }
    }
    

    const onPwInput = () => {
        getRoomKey(roomId.current);
    }

    const searchModal = (
        <ModalContainer>
            <InputText>
                <Label htmlFor="search">방 이름</Label>
                <Input value={searchRoomName} id="search" onChange={onChange} onKeyDown={onEnterFS} />
            </InputText>
            <SearchBtn onClick={onSearch}>검색</SearchBtn>
        </ModalContainer>
    );

    const passwordModal = (
        <ModalContainer>
            <InputText>
                <Label htmlFor="room-pw">패스워드</Label>
                <Input type="password" value={roomPassword} id="room-pw" onChange={onChangePw} onKeyDown={onEnterFP} />
            </InputText>
            <SearchBtn onClick={onPwInput}>입력</SearchBtn>
        </ModalContainer>
    );

    useEffect(() => {

        let beginPage = 1;

        const getRoomInfo = async () => {
            const json = await (
                roomName ? 
                    await axios.get(`http://localhost:8080/api/roomInfo?page=${page}&roomName=${roomName}`, {
                        withCredentials: true
                    }) : 
                    await axios.get(`http://localhost:8080/api/roomInfo?page=${page}`, {
                        withCredentials: true
                    })
            ).data;
            setRooms(rooms => [...json.content]);
            setCurrentPage(currentPage => json.pageable.pageNumber+1);
            setTotalPages(totalPages => json.totalPages);
            const begin = Math.floor(json.pageable.pageNumber/10)*10+1;
            if(begin !== beginPage) {
                beginPage = begin;
                const arr: number[] = [];
                for (let i = 0; i < Math.min(10, json.totalPages-begin+1); i++) {
                    arr.push(begin+i);
                }
                setPageList(pageList => [...arr]);
            }
        }

        getRoomInfo();

    }, [page, roomName]);

    return (
        <Container>
            <Nav />
            <ModalForm isOpen={searchOpen} setIsOpen={setSearchOpen} content={searchModal}></ModalForm>
            <ModalForm isOpen={pwOpen} setIsOpen={setPwOpen} content={passwordModal}></ModalForm>
            <div>
                <SearchModalBtn onClick={onSearchOpen}><FaSearch /></SearchModalBtn>
                <Table>
                    <Thead>
                        <Tr>
                            <ThRoomName>방 이름</ThRoomName>
                            <ThNumber>인원</ThNumber>
                        </Tr>
                    </Thead>
                    <tbody>
                        {rooms.map((room, idx) => 
                        <Tr key={idx}>
                                <TdRoomName><Room data-roomid={room.roomId} data-roomname={room.roomName} onClick={room.locked ? onClickLocked : onClick}>{room.roomName} {room.locked ? <FaLock /> : null}</Room></TdRoomName>
                            <TdNumber>{room.count}/9</TdNumber>
                        </Tr>)}
                    </tbody>
                </Table>            
            </div>
            <Pagination>
                {currentPage > 10 ? 
                    <Angle to={roomName ? 
                        `/search?page=${Math.floor((currentPage-1)/10)*10-1}&roomName=${roomName}` : 
                        `/search?page=${Math.floor((currentPage-1)/10)*10-1}`}>
                    <FaAngleLeft />
                    </Angle> : 
                    null}
                <Page>
                    {pageList.map((page, idx) => 
                    currentPage === page ? 
                        <PageNum 
                            key={idx} 
                            to={roomName ? 
                                `/search?page=${page-1}&roomName=${roomName}` :
                                `/search?page=${page-1}`}
                            style={{
                                "backgroundColor" : "#261a31", 
                                "color": "white"}}>
                        {page}
                        </PageNum> : 
                        <PageNum 
                            key={idx} 
                            to={roomName ? 
                                `/search?page=${page-1}&roomName=${roomName}` :
                                `/search?page=${page-1}`}>
                        {page}
                        </PageNum>
                        )}
                </Page>
                {currentPage <= Math.floor((totalPages-1)/10)*10 ? 
                    <Angle 
                        to={roomName ? 
                            `/search?page=${Math.ceil(currentPage/10)*10}&roomName=${roomName}` : 
                            `/search?page=${Math.ceil(currentPage/10)*10}`}>
                    <FaAngleRight />
                    </Angle> : 
                    null}
            </Pagination>
        </Container>
    );
}

export default SearchRoom;
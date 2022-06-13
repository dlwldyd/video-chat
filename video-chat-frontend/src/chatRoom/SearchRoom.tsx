import axios from "axios";
import { useEffect, useState } from "react";
import styled from "styled-components";
import Nav from "../navigator/Nav";
import { FaLock, FaAngleLeft, FaAngleRight } from "react-icons/fa";
import { useNavigate } from 'react-router';
import queryString from 'query-string';
import { Link } from "react-router-dom";

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

interface ClickEvent extends React.MouseEvent<HTMLSpanElement> {
    target: HTMLSpanElement;
}

function SearchRoom() {

    const [rooms, setRooms] = useState<{roomId: number, roomName: string, locked: boolean, count: number}[]>([]);

    const [totalPages, setTotalPages] = useState<number>(0);

    const [currentPage, setCurrentPage] = useState<number>(0);

    const [pageList, setPageList] = useState<number[]>([]);

    const navigate = useNavigate();

    const {page} = queryString.parse(window.location.search);

    const onClick = (event: ClickEvent) => {
        
        const roomId = event.target.getAttribute("data-roomid");
        const roomName = event.target.getAttribute("data-roomname");
        const password = event.target.getAttribute("password");

        const getRoomKey = async () => {
            const {roomKey} = await (await axios.post("http://localhost:8080/api/joinRoom", {
                roomId,
                roomName,
                password
            }, {
                withCredentials: true
            })).data;
            navigate(`/video-chat`, {state: roomKey});
        }
        getRoomKey();
    }

    useEffect(() => {

        const getRoomInfo = async () => {
            const json = await (await axios.get(`http://localhost:8080/api/roomInfo?page=${page}`, {
                withCredentials: true
            })).data;
            setRooms(rooms => [...json.content]);
            setCurrentPage(currentPage => json.pageable.pageNumber+1);
            setTotalPages(totalPages => json.totalPages);
            const begin = Math.floor((currentPage-1)/10)*10+1;
            if(begin !== pageList[0]) {
                const arr: number[] = [];
                for (let i = 0; i < Math.min(10, totalPages-begin+1); i++) {
                    arr.push(begin+i);
                }
                setPageList(pageList => [...arr]);
            }
        }

        getRoomInfo();

    }, [page, currentPage, pageList, totalPages]);

    return (
        <Container>
            <Nav />
            <div>
                <Table>
                    <Thead>
                        <ThRoomName>방 이름</ThRoomName>
                        <ThNumber>인원</ThNumber>
                    </Thead>
                    <tbody>
                        {rooms.map((room, idx) => 
                        <Tr>
                            {room.locked ? 
                                <TdRoomName key={idx}><Room data-roomid={room.roomId} data-roomname={room.roomName} onClick={onClick}>{room.roomName} <FaLock /></Room></TdRoomName> : 
                                <TdRoomName key={idx}><Room data-roomid={room.roomId} data-roomname={room.roomName} onClick={onClick}>{room.roomName} </Room></TdRoomName>}
                            <TdNumber>{room.count}/9</TdNumber>
                        </Tr>)}
                        {/* <Tr>
                            <TdRoomName><Room data-roomId="test">hello <FaLock /></Room></TdRoomName>
                            <TdNumber>2/9</TdNumber>
                        </Tr>
                        <Tr>
                            <TdRoomName><Room data-roomId="test">hello <FaLock /></Room></TdRoomName>
                            <TdNumber>2/9</TdNumber>
                        </Tr>
                        <Tr>
                            <TdRoomName><Room data-roomId="test">hello <FaLock /></Room></TdRoomName>
                            <TdNumber>2/9</TdNumber>
                        </Tr>
                        <Tr>
                            <TdRoomName><Room data-roomId="test">hello <FaLock /></Room></TdRoomName>
                            <TdNumber>2/9</TdNumber>
                        </Tr>
                        <Tr>
                            <TdRoomName><Room data-roomId="test">hello <FaLock /></Room></TdRoomName>
                            <TdNumber>2/9</TdNumber>
                        </Tr>
                        <Tr>
                            <TdRoomName><Room data-roomId="test">hello <FaLock /></Room></TdRoomName>
                            <TdNumber>2/9</TdNumber>
                        </Tr>
                        <Tr>
                            <TdRoomName><Room data-roomId="test">hello <FaLock /></Room></TdRoomName>
                            <TdNumber>2/9</TdNumber>
                        </Tr>
                        <Tr>
                            <TdRoomName><Room data-roomId="test">hello <FaLock /></Room></TdRoomName>
                            <TdNumber>2/9</TdNumber>
                        </Tr>
                        <Tr>
                            <TdRoomName><Room data-roomId="test">hello <FaLock /></Room></TdRoomName>
                            <TdNumber>2/9</TdNumber>
                        </Tr>
                        <Tr>
                            <TdRoomName><Room data-roomId="test">hello <FaLock /></Room></TdRoomName>
                            <TdNumber>2/9</TdNumber>
                        </Tr>
                        <Tr>
                            <TdRoomName><Room data-roomId="test">hello <FaLock /></Room></TdRoomName>
                            <TdNumber>2/9</TdNumber>
                        </Tr>
                        <Tr>
                            <TdRoomName><Room data-roomId="test">hello <FaLock /></Room></TdRoomName>
                            <TdNumber>2/9</TdNumber>
                        </Tr>
                        <Tr>
                            <TdRoomName><Room data-roomId="test">hello <FaLock /></Room></TdRoomName>
                            <TdNumber>2/9</TdNumber>
                        </Tr>
                        <Tr>
                            <TdRoomName><Room data-roomId="test">hello <FaLock /></Room></TdRoomName>
                            <TdNumber>2/9</TdNumber>
                        </Tr>
                        <Tr>
                            <TdRoomName><Room data-roomId="test">hello </Room></TdRoomName>
                            <TdNumber>2/9</TdNumber>
                        </Tr> */}
                    </tbody>
                </Table>            
            </div>
            <Pagination>
                {currentPage > 10 ? <Angle to={`/search?page=${Math.floor((currentPage-1)/10)*10-1}`}><FaAngleLeft /></Angle> : null}
                <Page>
                    {pageList.map((page, idx) => 
                    currentPage === page ? <PageNum key={idx} to={`/search?page=${page-1}`} style={{"backgroundColor" : "#261a31", "color": "white"}}>{page}</PageNum> : <PageNum key={idx} to={`/search?page=${page-1}`}>{page}</PageNum>
                    )}
                </Page>
                {currentPage <= Math.floor(totalPages/10)*10 ? <Angle to={`/search?page=${Math.ceil(currentPage/10)*10}`}><FaAngleRight /></Angle> : null}
            </Pagination>
        </Container>
    );
}

export default SearchRoom;
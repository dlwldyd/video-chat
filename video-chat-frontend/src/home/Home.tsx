import styled from "styled-components";
import Nav from "../navigator/Nav";

const publicUrl = process.env.PUBLIC_URL;

const HomeContainer = styled.div`
    background-image: url(${publicUrl}/web/video-chat.png);
    width: 100%;
    height: 100vh;
`

function Home() {    

    return (
        <HomeContainer>
            <Nav />
        </HomeContainer>
    );
}

export default Home;
# [개인프로젝트] 화상 채팅 웹사이트

# 사용 방법
## 1.로그인
>구글, 네이버로 로그인 할 수 있습니다.

<img src="./img/login.png">

## 2.닉네임 변경
>닉네임을 변경할 수 있습니다.

<img src="./img/change-nickname.png">

## 3.채팅방 생성
>채팅방을 생성할 수 있습니다.

<img src="./img/create-chat-room.png">

## 4.화상 채팅
>화상채팅을 할 수 있습니다.<br>
>카메라와 오디오가 없는 경우에는 일반 채팅을 통해서 대화할 수 있습니다.

<img src="./img/video-chat.png">

## 5.채팅 참여
>현재 생성되어 있는 채팅방 목록을 확인할 수 있습니다.<br>
>채팅방에 비밀번호가 걸려있는 경우에는 비밀번호를 입력해야지만 입장이 가능합니다.<br>
>채팅방 이름을 통해 검색이 가능합니다.

<img src="./img/search-room.png">
<img src="./img/search.png">

# 프로젝트 구조
## 사용한 기술스택
1. Spring Boot
2. Spring Security
3. Spring Websocket(STOMP)
4. MySQL
5. JPA & QueryDSL
6. RabbitMQ
7. OAuth2.0
8. React
9. Styled Component
10. webRTC
## Spring Boot
>React에서 요청한 데이터를 JSON으로 응답한다.

__구조는 다음과 같습니다.__

* config : 웹 관련 configuration을 관리합니다.
* controller : 컨트롤러를 관리합니다.
* domain : 엔티티, dto 등의 도메인을 관리합니다.
* message : STOMP와 RabbitMQ에 관련된 기능을 관리합니다.
* repository : 데이터베이스에 접근하기 위한 JPA/QueryDSL을 관리합니다.
* security : security, OAuth 관련 기능을 관리합니다.
* service : 비즈니스 로직을 관리합니다.
## Spring Security / OAuth2.0
>인가된 사용자만이 특정 리소스에 접근할 수 있도록 제한한다.

__구조는 다음과 같습니다.__

* security
  - config : Spring Security 관련 설정을 관리합니다.
    + CORS 설정을 통해 허용된 도메인에서만 API를 호출할 수 있도록 했습니다.
    + 인가된 사용자만이 API를 호출할 수 있도록 했습니다.
  - member : 로그인 성공 시 반환되는 UserDetails의 구현체를 관리합니다.
  - provider : OAuth 로그인 시 사용자의 프로파일 정보를 가져올 수 있는 인터페이스와 각 소셜 로그인별 구현체를 관리합니다.
## JPA / QueryDSL
>JPA와 QueryDSL을 사용하여 데이터베이스에 대한 CRUD 작업을 수행한다.<br>
>__JPA : DB에서 데이터를 조회한다.__<br>
>__QueryDSL : JPA 만으로 처리하기 힘든 동적 쿼리는 QueryDSL로 작성한다.__

__구조는 다음과 같습니다.__

* domain > entity : 엔티티를 관리한다.
  - ChatRoom : 채팅룸 엔티티
  - JoinUser : 채팅룸에 참여한 유저 엔티티
  - Member : 서비스에 가입한 회원 엔티티
* repository
  - chatRoom
    + chatRoomRepository(JPA 인터페이스)
    + chatRoomRepositoryCustom(QueryDSL 인터페이스)
    + chatRoomRepositoryCustomImpl(QueryDSL 구현체)
  - JoinUserRepository
  - MemberRepository
## Spring WebSocket(STOMP) / RabbitMQ
>webRTC의 P2P연결을 위한 signaling server를 구축한다.<br>
>사용자 간에 메세지를 전달한다.

__구조는 다음과 같습니다.__

* message
  - rabbitmq
    + RabbitConfig : RabbitMQ에 대한 설정을 관리합니다.
  - websocket
    + StompHandler : 채널 인터셉터, STOMP 메세지에 대한 부가적인 로직을 수행합니다.
    + WebSocketConfig : 웹소켓에 대한 설정을 관리합니다.
## React
>사용자가 서버와 상호작용할 수 있도록 한다.

__구조는 다음과 같습니다.__

* Auth : 사용자 인증과 관련되 로직 및 뷰를 관리합니다.
* chatRoom : 채팅방과 관련된 로직 및 뷰를 관리합니다.
* data : 전역적으로 사용되는 데이터를 관리합니다.
* exception : 에러 발생시 수행되는 로직으로 관리합니다.
* home : 홈페이지를 관리합니다.
* modal : 모달을 재사용할 수 있도록 모듈화하여 관리합니다.
* navigator : 네비게이션바를 관리합니다.
* styles : 폰트 등 스타일과 관련된 파일을 관리합니다.
## webRTC
>webRTC를 통해 P2P로 사용자 간에 화상통신이 가능하도록 한다.

__구조는 다음과 같습니다.__

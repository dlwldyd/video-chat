package com.example.videochatbackend.service;

import com.example.videochatbackend.domain.dto.*;
import com.example.videochatbackend.domain.entity.ChatRoom;
import com.example.videochatbackend.domain.entity.JoinUser;
import com.example.videochatbackend.domain.exception.*;
import com.example.videochatbackend.repository.chatRoom.ChatRoomRepository;
import com.example.videochatbackend.repository.JoinUserRepository;
import com.example.videochatbackend.security.member.MemberDetails;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class ChatRoomService {

    private final ChatRoomRepository chatRoomRepository;

    private final JoinUserRepository joinUserRepository;

    private final PasswordEncoder passwordEncoder;

    /**
     * 채팅룸을 생성해 데이터베이스에 저장하고 해당 방에 해당하는 라우팅 키와 아이디를 리턴한다.
     */
    public ChatRoomKeyDto createRoom(ChatRoomDto chatRoomDto) {
        ChatRoom chatRoom = ChatRoom.create(chatRoomDto, passwordEncoder);
        chatRoomRepository.save(chatRoom);
        return new ChatRoomKeyDto(chatRoom.getRoomKey(), chatRoom.getId());
    }

    /**
     * 채팅방에 입장한 사용자가 미디어 스트림을 얻어온 경우 스트림 아이디를 데이터베이스에 저장한다.
     * 미디어 스트림은 항상 얻어오고 카메라 권한을 얻어오지 못한 경우에는 해당 미디어 스트림의 미디어 트랙이 비어있다.
     * @param sessionId 웹소켓 세션 아이디
     */
    public void joinVideoConn(ChatDto chatDto, String sessionId) {
        JoinUser joinUser = joinUserRepository.findBySessionId(sessionId).orElseThrow(() -> new NoSuchUserException("no user"));
        joinUser.setStreamId(chatDto.getStreamId());
    }

    /**
     * STOMP 연결이 끊긴 경우 데이터베이스에서 해당 세션의 아이디로 누가 방에서 나갔는지를 조회해 해당 유저를 join_user 테이블에서 삭제하고
     * 그 유저가 있던 방의 인원을 1 감소시킨다. 만약 방에 남아있는 인원이 0명이면 채팅룸을 삭제한다.
     * @param sessionId 웹소켓 세션 아이디
     * @return
     */
    public ChatDto leave(String sessionId) {
        try {
            JoinUser joinUser = joinUserRepository.findBySessionIdForCntDown(sessionId).orElseThrow(AlreadyDisconnectedException::new);
            ChatRoom chatRoom = joinUser.getChatRoom();
            chatRoom.setCount(chatRoom.getCount() - 1);
            joinUserRepository.delete(joinUser);
            if (chatRoom.getCount() == 0) {
                chatRoomRepository.delete(chatRoom);
            }
            return ChatDto.leave(chatRoom.getRoomKey(), joinUser.getStreamId(), joinUser.getUsername());
        } catch (AlreadyDisconnectedException e) {
        }
        return null;
    }

    /**
     * 현재 생성되어있는 채팅룸을 조회한다.
     * 15개씩 조회한다.
     * @return
     */
    public Page<RoomInfoDto> searchRoom(Pageable pageable, String roomName) {
        Page<ChatRoom> chatRooms = chatRoomRepository.findRooms(pageable, roomName);
        return chatRooms.map(RoomInfoDto::new);
    }

    /**
     * 클라이언트로부터 받은 채팅룸의 id로 데이터베이스에 해당 방이 존재하는지 조회하고 만약 해당 방이 있다면 방에 비밀번호가 존재하지 않거나
     * 혹은 클라이언트로부터 받은 비밀번호와 데이터베이스에 저장된 비밀번호가 일치한다면 라우팅 키를 반환한다.
     */
    public ChatRoomKeyDto getRoomKey(ChatRoomKeyDto chatRoomKeyDto) {
        ChatRoom chatRoom = chatRoomRepository.findById(chatRoomKeyDto.getRoomId()).orElseThrow(() -> new RoomNotFoundException("방을 찾을 수 없습니다."));
        if (chatRoom.getPassword() == null || chatRoom.validate(chatRoomKeyDto.getPassword(), passwordEncoder)) {
            return new ChatRoomKeyDto(chatRoom.getRoomKey(), chatRoom.getId());
        }
        if (chatRoom.getCount() >= 9) {
            throw new FullRoomException("인원이 가득 찼습니다.");
        }
        throw new PasswordMismatchException("패스워드가 일치하지 않습니다.");
    }

    /**
     * 유저가 방에 참여시 join_user 테이블에 해당 유저를 저장하고 해당 방의 인원을 1 증가시킨다.
     * @param sessionIdDto 웹소켓 세션 아이디가 담긴 dto
     */
    public void joinRoom(SessionIdDto sessionIdDto, MemberDetails memberDetails) {
        if (joinUserRepository.findBySessionId(sessionIdDto.getSessionId()).isPresent()) {
            throw new AlreadyJoinException("이미 참여중인 방이 있습니다.");
        }
        ChatRoom chatRoom = chatRoomRepository.findByRoomKeyForCntUp(sessionIdDto.getRoomKey()).orElseThrow(() -> new RoomNotFoundException("방을 찾을 수 없습니다."));
        JoinUser joinUser = new JoinUser(sessionIdDto.getSessionId(), memberDetails, chatRoom);
        joinUserRepository.save(joinUser);
        chatRoom.setCount(chatRoom.getCount() + 1);
    }
}

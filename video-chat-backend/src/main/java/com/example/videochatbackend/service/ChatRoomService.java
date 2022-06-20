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

    public ChatRoomKeyDto createRoom(ChatRoomDto chatRoomDto) {
        ChatRoom chatRoom = ChatRoom.create(chatRoomDto, passwordEncoder);
        chatRoomRepository.save(chatRoom);
        return new ChatRoomKeyDto(chatRoom.getRoomKey(), chatRoom.getId());
    }

    public void joinVideoConn(ChatDto chatDto, String sessionId) {
        JoinUser joinUser = joinUserRepository.findBySessionId(sessionId).orElseThrow(() -> new NoSuchUserException("no user"));
        joinUser.setStreamId(chatDto.getStreamId());
    }

    public ChatDto leave(String sessionId) {
        try {
            JoinUser joinUser = joinUserRepository.findBySessionIdForCntDown(sessionId).orElseThrow(() -> new RuntimeException("already disconnected"));
            ChatRoom chatRoom = joinUser.getChatRoom();
            chatRoom.setCount(chatRoom.getCount() - 1);
            joinUserRepository.delete(joinUser);
            if (chatRoom.getCount() == 0) {
                chatRoomRepository.delete(chatRoom);
            }
            return ChatDto.leave(chatRoom.getRoomKey(), joinUser.getStreamId(), joinUser.getUsername());
        } catch (RuntimeException e) {
            log.info(e.getMessage());
        }
        return null;
    }

    public Page<RoomInfoDto> searchRoom(Pageable pageable, String roomName) {
        Page<ChatRoom> chatRooms = chatRoomRepository.findRooms(pageable, roomName);
        return chatRooms.map(RoomInfoDto::new);
    }

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

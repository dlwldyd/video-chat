package com.example.videochatbackend.service;

import com.example.videochatbackend.domain.dto.ChatDto;
import com.example.videochatbackend.domain.dto.ChatRoomDto;
import com.example.videochatbackend.domain.dto.ChatRoomKeyDto;
import com.example.videochatbackend.domain.entity.ChatRoom;
import com.example.videochatbackend.domain.entity.JoinUser;
import com.example.videochatbackend.repository.ChatRoomRepository;
import com.example.videochatbackend.repository.JoinUserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.Optional;

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
        return new ChatRoomKeyDto(chatRoom.getRoomKey());
    }

    public void join(ChatDto chatDto, String simpSessionId) {
        try {
            Optional<JoinUser> bySimpSessionId = joinUserRepository.findBySimpSessionId(simpSessionId);
            if (bySimpSessionId.isPresent()) {
                throw new RuntimeException("이미 방에 참여중");
            }
            ChatRoom chatRoom = chatRoomRepository.findByRoomKey(chatDto.getRoomKey()).orElseThrow(() -> new RuntimeException("채팅룸 없음"));
            chatRoom.setCount(chatRoom.getCount() + 1);
            JoinUser joinUser = new JoinUser(simpSessionId, chatDto, chatRoom);
            joinUserRepository.save(joinUser);
        } catch (RuntimeException e) {
            log.info(e.getMessage());
        }
    }

    public ChatDto leave(String simpSessionId) {
        try {
            JoinUser joinUser = joinUserRepository.findBySimpSessionId(simpSessionId).orElseThrow(() -> new RuntimeException("이미 disconnect 됨"));
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
}

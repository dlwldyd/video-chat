package com.example.videochatbackend.service;

import com.example.videochatbackend.domain.dto.ChatDto;
import com.example.videochatbackend.domain.dto.ChatRoomDto;
import com.example.videochatbackend.domain.dto.ChatRoomKeyDto;
import com.example.videochatbackend.domain.entity.ChatRoom;
import com.example.videochatbackend.domain.entity.JoinUser;
import com.example.videochatbackend.repository.ChatRoomRepository;
import com.example.videochatbackend.repository.JoinUserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.Optional;

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
        Optional<JoinUser> bySimpSessionId = joinUserRepository.findBySimpSessionId(simpSessionId);
        if (bySimpSessionId.isPresent()) {
            throw new RuntimeException("이미 방에 참여중");
        }
        JoinUser joinUser = new JoinUser(simpSessionId, chatDto);
        joinUserRepository.save(joinUser);
        ChatRoom chatRoom = chatRoomRepository.findByRoomKey(chatDto.getRoomKey()).orElseThrow(() -> new RuntimeException("채팅룸 없음"));
        chatRoom.setCount(chatRoom.getCount() + 1);
    }

    public ChatDto leave(String simpSessionId) {
        JoinUser joinUser = joinUserRepository.findBySimpSessionId(simpSessionId).orElseThrow(() -> new RuntimeException("방에 참여X"));
        ChatRoom chatRoom = chatRoomRepository.findByRoomKey(joinUser.getRoomKey()).orElseThrow(() -> new RuntimeException("채팅룸 없음"));
        chatRoom.setCount(chatRoom.getCount() - 1);
        joinUserRepository.delete(joinUser);
        return ChatDto.leave(chatRoom.getRoomKey(), joinUser.getStreamId(), joinUser.getUsername());
    }
}

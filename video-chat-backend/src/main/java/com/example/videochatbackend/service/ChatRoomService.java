package com.example.videochatbackend.service;

import com.example.videochatbackend.domain.dto.ChatDto;
import com.example.videochatbackend.domain.dto.ChatRoomDto;
import com.example.videochatbackend.domain.dto.ChatRoomKeyDto;
import com.example.videochatbackend.domain.dto.RoomInfoDto;
import com.example.videochatbackend.domain.entity.ChatRoom;
import com.example.videochatbackend.domain.entity.JoinUser;
import com.example.videochatbackend.repository.ChatRoomRepository;
import com.example.videochatbackend.repository.JoinUserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import javax.transaction.Transactional;
import java.util.Optional;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class ChatRoomService {

    private final ChatRoomRepository chatRoomRepository;

    private final JoinUserRepository joinUserRepository;

    private final PasswordEncoder passwordEncoder;

//    @PostConstruct
//    public void init() {
//        for (int i = 0; i < 1000; i++) {
//            ChatRoom chatRoom = new ChatRoom("tmp", "tmp", 1);
//            chatRoomRepository.save(chatRoom);
//        }
//    }

    public ChatRoomKeyDto createRoom(ChatRoomDto chatRoomDto) {
        ChatRoom chatRoom = ChatRoom.create(chatRoomDto, passwordEncoder);
        chatRoomRepository.save(chatRoom);
        return new ChatRoomKeyDto(chatRoom.getRoomKey());
    }

    public void join(ChatDto chatDto, String simpSessionId) {
        try {
            Optional<JoinUser> bySimpSessionId = joinUserRepository.findBySimpSessionId(simpSessionId);
            if (bySimpSessionId.isPresent()) {
                throw new RuntimeException("already joined");
            }
            ChatRoom chatRoom = chatRoomRepository.findByRoomKey(chatDto.getRoomKey()).orElseThrow(() -> new RuntimeException("no chat room"));
            chatRoom.setCount(chatRoom.getCount() + 1);
            JoinUser joinUser = new JoinUser(simpSessionId, chatDto, chatRoom);
            joinUserRepository.save(joinUser);
        } catch (RuntimeException e) {
            log.info(e.getMessage());
        }
    }

    public ChatDto leave(String simpSessionId) {
        try {
            JoinUser joinUser = joinUserRepository.findBySimpSessionId(simpSessionId).orElseThrow(() -> new RuntimeException("already disconnected"));
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

    public Page<RoomInfoDto> searchRoom(Pageable pageable) {
        Page<ChatRoom> chatRooms = chatRoomRepository.findAll(pageable);
        return chatRooms.map(RoomInfoDto::new);
    }

    public ChatRoomKeyDto joinRoom(ChatRoomDto chatRoomDto) {
        ChatRoom chatRoom = chatRoomRepository.findById(chatRoomDto.getRoomId()).orElseThrow(() -> new RuntimeException("no chat room"));
        if (chatRoom.getPassword() == null || chatRoom.validate(chatRoomDto.getPassword(), passwordEncoder)) {
            return new ChatRoomKeyDto(chatRoom.getRoomKey());
        }
        if (chatRoom.getCount() >= 9) {
            throw new RuntimeException("인원이 가득찼습니다.");
        }
        throw new RuntimeException("패스워드가 일치하지 않습니다.");
    }
}

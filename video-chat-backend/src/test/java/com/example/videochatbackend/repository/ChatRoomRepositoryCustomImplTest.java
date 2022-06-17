package com.example.videochatbackend.repository;

import com.example.videochatbackend.domain.entity.ChatRoom;
import com.example.videochatbackend.repository.chatRoom.ChatRoomRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;

import static org.assertj.core.api.Assertions.*;

@SpringBootTest
class ChatRoomRepositoryCustomImplTest {

    @Autowired
    private ChatRoomRepository chatRoomRepository;

    @Test
    void findRoomTest() {
        PageRequest pageRequest = PageRequest.of(0, 15);
        Page<ChatRoom> page1 = chatRoomRepository.findRooms(pageRequest, null);
        Page<ChatRoom> page2 = chatRoomRepository.findRooms(pageRequest, "abc");

        assertThat(page1.getContent().size()).isEqualTo(15);
        assertThat(page2.getContent().size()).isEqualTo(15);
        page2.getContent().forEach(chatRoom -> assertThat(chatRoom.getRoomName()).isEqualTo("abc"));
        assertThat(page2.getTotalPages()).isEqualTo(14);
        assertThat(page1.getTotalElements()).isEqualTo(1200L);
        assertThat(page2.getTotalElements()).isEqualTo(200L);
    }
}
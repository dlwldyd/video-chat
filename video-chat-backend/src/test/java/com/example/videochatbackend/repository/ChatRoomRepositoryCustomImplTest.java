package com.example.videochatbackend.repository;

import com.example.videochatbackend.domain.entity.ChatRoom;
import com.example.videochatbackend.repository.chatRoom.ChatRoomRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;

import static org.assertj.core.api.Assertions.*;

@DataJpaTest
class ChatRoomRepositoryCustomImplTest {

    @Autowired
    private ChatRoomRepository chatRoomRepository;

    @BeforeEach
    void beforeEach() {
        for (int i = 0; i < 200; i++) {
            ChatRoom chatRoom = new ChatRoom("tmp", "tmp1", 1);
            chatRoomRepository.save(chatRoom);
        }
        for (int i = 0; i < 200; i++) {
            ChatRoom chatRoom = new ChatRoom("abc", "tmp2", 1);
            chatRoomRepository.save(chatRoom);
        }
        for (int i = 0; i < 200; i++) {
            ChatRoom chatRoom = new ChatRoom("def", "tmp3", 1);
            chatRoomRepository.save(chatRoom);
        }
        for (int i = 0; i < 200; i++) {
            ChatRoom chatRoom = new ChatRoom("ghi", "tmp4", 1);
            chatRoomRepository.save(chatRoom);
        }
        for (int i = 0; i < 200; i++) {
            ChatRoom chatRoom = new ChatRoom("jkl", "tmp5", 1);
            chatRoomRepository.save(chatRoom);
        }
        for (int i = 0; i < 200; i++) {
            ChatRoom chatRoom = new ChatRoom("mno", "tmp6", 1);
            chatRoomRepository.save(chatRoom);
        }
    }

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
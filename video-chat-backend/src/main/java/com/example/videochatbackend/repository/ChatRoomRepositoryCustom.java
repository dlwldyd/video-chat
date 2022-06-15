package com.example.videochatbackend.repository;

import com.example.videochatbackend.domain.entity.ChatRoom;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface ChatRoomRepositoryCustom {

    Page<ChatRoom> findRooms(Pageable pageable, String roomName);
}

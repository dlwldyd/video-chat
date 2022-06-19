package com.example.videochatbackend.repository.chatRoom;

import com.example.videochatbackend.domain.entity.ChatRoom;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import javax.persistence.LockModeType;
import java.util.Optional;

public interface ChatRoomRepository extends JpaRepository<ChatRoom, Long>, ChatRoomRepositoryCustom {

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select cr from ChatRoom cr where cr.roomKey = :roomKey")
    Optional<ChatRoom> findByRoomKeyForCntUp(@Param("roomKey") String roomKey);
}

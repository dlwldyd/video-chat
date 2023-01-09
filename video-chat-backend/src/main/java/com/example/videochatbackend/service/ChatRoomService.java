package com.example.videochatbackend.service;

import com.example.videochatbackend.domain.dto.*;
import com.example.videochatbackend.security.member.MemberDetails;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface ChatRoomService {

    ChatRoomKeyDto createRoom(ChatRoomDto chatRoomDto);

    void joinVideoConn(ChatDto chatDto, String sessionId);

    ChatDto leave(String sessionId);

    Page<RoomInfoDto> searchRoom(Pageable pageable, String roomName);

    ChatRoomKeyDto getRoomKey(ChatRoomKeyDto chatRoomKeyDto);

    void joinRoom(SessionIdDto sessionIdDto, MemberDetails memberDetails);
}

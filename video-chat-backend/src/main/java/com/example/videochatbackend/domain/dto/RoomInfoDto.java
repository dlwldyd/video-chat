package com.example.videochatbackend.domain.dto;

import com.example.videochatbackend.domain.entity.ChatRoom;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RoomInfoDto {

    private long roomId;

    private String roomName;

    private boolean locked;

    private int count;

    public RoomInfoDto (ChatRoom chatRoom) {
        this.roomId = chatRoom.getId();
        this.roomName = chatRoom.getRoomName();
        this.count = chatRoom.getCount();
        this.locked = (chatRoom.getPassword() != null);
    }
}

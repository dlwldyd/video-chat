package com.example.videochatbackend.domain.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ChatRoomKeyDto {

    private String roomId;

    private String roomName;

    private String roomKey;

    public ChatRoomKeyDto(String roomKey) {
        this.roomKey = roomKey;
    }

    public ChatRoomKeyDto(String roomId, String roomName, String roomKey) {
        this.roomId = roomId;
        this.roomName = roomName;
        this.roomKey = roomKey;
    }
}

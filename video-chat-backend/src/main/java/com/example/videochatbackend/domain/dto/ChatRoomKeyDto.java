package com.example.videochatbackend.domain.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.validation.constraints.NotNull;

@Getter
@Setter
@NoArgsConstructor
public class ChatRoomKeyDto {

    @NotNull
    private Long roomId;

    private String roomKey;

    private String password;

    public ChatRoomKeyDto(String roomKey, Long roomId) {
        this.roomId = roomId;
        this.roomKey = roomKey;
    }
}

package com.example.videochatbackend.domain.dto;

import lombok.*;

import javax.validation.constraints.NotEmpty;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode
@ToString
public class ChatDto {

    @NotEmpty
    private String type;

    private String from;

    private String roomKey;

    private String target;

    private String streamId;

    private String nickname;

    private String msg;

    private Object iceCandidate;

    private Object sdp;

    public static ChatDto leave(String roomKey, String streamId, String username) {
        ChatDto chatDto = new ChatDto();
        chatDto.setType("leave");
        chatDto.setRoomKey(roomKey);
        chatDto.setStreamId(streamId);
        chatDto.setFrom(username);
        return chatDto;
    }
}

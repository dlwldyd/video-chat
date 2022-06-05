package com.example.videochatbackend.domain.dto;

import lombok.*;

import javax.validation.constraints.NotEmpty;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode
public class ChatDto {

    @NotEmpty
    private String type;

    private String from;

    private String target;

    private String streamId;

    private String nickname;

    private String msg;

    private Object iceCandidate;

    private Object sdp;
}

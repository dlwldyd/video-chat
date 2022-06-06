package com.example.videochatbackend.domain.entity;

import com.example.videochatbackend.domain.dto.ChatDto;
import lombok.Getter;
import lombok.NoArgsConstructor;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;

@Entity
@Getter
@NoArgsConstructor
public class JoinUser {

    @Id
    @GeneratedValue
    @Column(name = "join_user_id")
    private Long id;

    @Column(nullable = false)
    private String simpSessionId;

    private String streamId;

    private String username;

    private String roomKey;

    public JoinUser(String simpSessionId, ChatDto chatDto) {
        this.simpSessionId = simpSessionId;
        this.username = chatDto.getFrom();
        this.roomKey = chatDto.getRoomKey();
        this.streamId = chatDto.getStreamId();
    }
}

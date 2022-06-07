package com.example.videochatbackend.domain.entity;

import com.example.videochatbackend.domain.dto.ChatDto;
import lombok.Getter;
import lombok.NoArgsConstructor;

import javax.persistence.*;

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

    @ManyToOne
    @JoinColumn(name = "chat_room_id")
    private ChatRoom chatRoom;

    public JoinUser(String simpSessionId, ChatDto chatDto, ChatRoom chatRoom) {
        this.simpSessionId = simpSessionId;
        this.username = chatDto.getFrom();
        this.chatRoom = chatRoom;
        this.streamId = chatDto.getStreamId();
    }
}

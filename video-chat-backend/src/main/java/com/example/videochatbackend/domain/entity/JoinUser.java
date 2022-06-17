package com.example.videochatbackend.domain.entity;

import com.example.videochatbackend.security.member.MemberDetails;
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
    private String sessionId;

    private String streamId;

    private String username;

    @ManyToOne
    @JoinColumn(name = "chat_room_id")
    private ChatRoom chatRoom;

    public void setStreamId(String streamId) {
        this.streamId = streamId;
    }

    public JoinUser(String sessionId, MemberDetails memberDetails, ChatRoom chatRoom) {
        this.sessionId = sessionId;
        this.username = memberDetails.getUsername();
        this.chatRoom = chatRoom;
    }
}

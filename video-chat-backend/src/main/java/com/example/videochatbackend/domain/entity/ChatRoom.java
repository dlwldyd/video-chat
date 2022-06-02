package com.example.videochatbackend.domain.entity;

import com.example.videochatbackend.domain.dto.ChatRoomDto;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.validation.constraints.NotEmpty;
import java.util.UUID;

@Entity
@Getter
@NoArgsConstructor
public class ChatRoom {

    @Id
    @GeneratedValue
    @Column(name = "chat_room_id")
    private Long id;

    @NotEmpty
    private String roomName;

    private String password;

    @NotEmpty
    private String routingKey;

    public ChatRoom(String roomName, String routingKey) {
        this.roomName = roomName;
        this.routingKey = routingKey;
    }

    public ChatRoom(String roomName, String password, String routingKey) {
        this.roomName = roomName;
        this.password = password;
        this.routingKey = routingKey;
    }

    public static ChatRoom create(ChatRoomDto chatRoomDto, PasswordEncoder passwordEncoder) {
        if (chatRoomDto.getPassword().isEmpty()) {
            return new ChatRoom(chatRoomDto.getRoomName(), UUID.randomUUID().toString());
        }
        return new ChatRoom(chatRoomDto.getRoomName(), passwordEncoder.encode(chatRoomDto.getPassword()), UUID.randomUUID().toString());
    }
}

package com.example.videochatbackend.controller;

import com.example.videochatbackend.domain.dto.ChatRoomDto;
import com.example.videochatbackend.domain.dto.ChatRoomKeyDto;
import com.example.videochatbackend.service.ChatRoomService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@Slf4j
public class ChatRoomController {

    private final ChatRoomService chatRoomService;

    @GetMapping("/api/test")
    public ChatRoomKeyDto test() {
        return new ChatRoomKeyDto("hello");
    }

    @PostMapping("/api/createRoom")
    public ChatRoomKeyDto createRoom(@RequestBody ChatRoomDto chatRoomDto) {
        return chatRoomService.createRoom(chatRoomDto);
    }
}

package com.example.videochatbackend.controller;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Controller
public class ChatController {

    @MessageMapping("/room")
    @SendTo("/subs/room")
    public String message(String msg) {
        return msg;
    }
}

package com.example.videochatbackend.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.stereotype.Controller;

@Controller
@RequiredArgsConstructor
@Slf4j
public class ChatController {

    private static final String chatExchangeName = "chat.exchange";

    private final RabbitTemplate rabbitTemplate;

    @MessageMapping("room.{roomId}")
    public void message(String msg, @DestinationVariable String roomId) {
        rabbitTemplate.convertAndSend(chatExchangeName, "room." + roomId, msg);
    }
}

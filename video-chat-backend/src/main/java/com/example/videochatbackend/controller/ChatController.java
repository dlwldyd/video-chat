package com.example.videochatbackend.controller;

import com.example.videochatbackend.domain.dto.ChatDto;
import com.example.videochatbackend.security.member.MemberDetails;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;

@Controller
@RequiredArgsConstructor
@Slf4j
public class ChatController {

    private static final String chatExchangeName = "chat.exchange";

    private final RabbitTemplate rabbitTemplate;

    @MessageMapping("room.{roomKey}")
    public void message(ChatDto msg, @DestinationVariable String roomKey) {
        rabbitTemplate.convertAndSend(chatExchangeName, "room." + roomKey, msg);
    }
}

package com.example.videochatbackend.config.websocket;

import com.example.videochatbackend.domain.dto.ChatDto;
import com.example.videochatbackend.service.ChatRoomService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.converter.MessageConverter;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class StompHandler implements ChannelInterceptor {

    private static final String chatExchangeName = "chat.exchange";

    private final MessageConverter messageConverter;

    private final RabbitTemplate rabbitTemplate;

    private final ChatRoomService chatRoomService;

    @Override
    public Message<?> preSend(Message<?> message, MessageChannel channel) {

        StompHeaderAccessor accessor = StompHeaderAccessor.wrap(message);

        if (accessor.getCommand() == StompCommand.SEND) {
            ChatDto chatDto = (ChatDto) messageConverter.fromMessage(message, ChatDto.class);
            String type = chatDto != null ? chatDto.getType() : null;
            if (type != null && type.equals("join")) {
                chatRoomService.join(chatDto, (String) message.getHeaders().get("simpSessionId"));
            }
        } else if (accessor.getCommand() == StompCommand.DISCONNECT) {
            ChatDto chatDto = chatRoomService.leave((String) message.getHeaders().get("simpSessionId"));
            if (chatDto != null) {
                rabbitTemplate.convertAndSend(chatExchangeName, "room." + chatDto.getRoomKey(), chatDto);
            }
        }
        return ChannelInterceptor.super.preSend(message, channel);
    }
}

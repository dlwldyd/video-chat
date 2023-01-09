package com.example.videochatbackend.message.websocket;

import com.example.videochatbackend.domain.dto.ChatDto;
import com.example.videochatbackend.domain.exception.NoSuchUserException;
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

//        log.info("{}", accessor.getUser());

        //type이 join인 메세지를 받으면 join_user 테이블에 미디어 스트림을 데이터베이스에 저장한다.
        if (accessor.getCommand() == StompCommand.SEND) {
            ChatDto chatDto = (ChatDto) messageConverter.fromMessage(message, ChatDto.class);
            String type = chatDto != null ? chatDto.getType() : null;
            if (type != null && type.equals("join")) {
                try {
                    chatRoomService.joinVideoConn(chatDto, (String) message.getHeaders().get("simpSessionId"));
                } catch (NoSuchUserException e) {
                    log.info("NoSuchUserException : {}", e.getMessage());
                }
            }
        // 유저의 STOMP 연결이 끊긴다면 해당 세션 아이디에 해당하는 유저를 join_user 테이블에서 삭제하고 그 유저가 있던 방의 인원을 1감소시킨다.
        // 또한 해당 방에 있는 클라이언트들에게 그 유저가 방에서 나갔음을 알린다.
        } else if (accessor.getCommand() == StompCommand.DISCONNECT) {
            ChatDto chatDto = chatRoomService.leave((String) message.getHeaders().get("simpSessionId"));
            if (chatDto != null) {
                rabbitTemplate.convertAndSend(chatExchangeName, "room." + chatDto.getRoomKey(), chatDto);
            }
        }
        return ChannelInterceptor.super.preSend(message, channel);
    }
}

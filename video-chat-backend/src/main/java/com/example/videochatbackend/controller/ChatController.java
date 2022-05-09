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

    private static final String chatQueueName = "chat.queue";

    private static final String chatExchangeName = "chat.exchange";

    private static final String routingKey = "room.*";


    private final RabbitTemplate rabbitTemplate;

    @MessageMapping("room.{roomId}")
    public void message(String msg, @DestinationVariable String roomId) {
        rabbitTemplate.convertAndSend(chatExchangeName, "room." + roomId, msg);
    }

//     각각 다른 큐의 메세지를 listen 하는 메세지 리스너를 등록할 때는 아래와 같은 방법으로 등록함
//    @RabbitListener(bindings = @QueueBinding(
//            exchange = @Exchange(name = chatExchangeName, type = ExchangeTypes.TOPIC),
//            value = @Queue(name = chatQueueName),
//            key = routingKey
//    ))
//    public void messageLog(String message){
//        log.info("received message : {}", message);
//    }
}

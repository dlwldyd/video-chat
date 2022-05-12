package com.example.videochatbackend.config.rabbitmq;

import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.core.Message;
import org.springframework.amqp.core.MessageListener;
import org.springframework.stereotype.Component;

@Component
@Slf4j
public class MessageListenerLog implements MessageListener {

    @Override
    public void onMessage(Message message) {
        log.info("received message : {}", message);
    }
}

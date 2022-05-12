package com.example.videochatbackend.config.rabbitmq;

import lombok.RequiredArgsConstructor;
import org.springframework.amqp.core.*;
import org.springframework.amqp.rabbit.connection.CachingConnectionFactory;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.rabbit.listener.SimpleMessageListenerContainer;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@RequiredArgsConstructor
public class RabbitConfig {

    private static final String chatQueueName = "chat.queue";

    private static final String chatExchangeName = "chat.exchange";

    private static final String routingKey = "room.*";

    private final MessageListener messageListener;

    //Queue 등록
    @Bean
    public Queue queue(){
        return new Queue(chatQueueName, true);
    }

    //Exchange 등록
    @Bean
    public TopicExchange exchange(){
        return new TopicExchange(chatExchangeName);
    }

    //Exchange 와 Queue 바인딩
    @Bean
    public Binding binding(Queue queue, TopicExchange exchange) {
        return BindingBuilder.bind(queue).to(exchange).with(routingKey);
    }

    @Bean
    public RabbitTemplate rabbitTemplate(){
        RabbitTemplate rabbitTemplate = new RabbitTemplate(connectionFactory());
        rabbitTemplate.setMessageConverter(jsonMessageConverter()); // 객체 전달 시 필요
        return rabbitTemplate;
    }

    // 여러 큐의 메세지를 받아와야하는 (AOP 같은)메세지 리스너는 MessageListenerContainer 를 통해 등록하는 것이 좋다.
    @Bean
    public SimpleMessageListenerContainer container(){
        SimpleMessageListenerContainer container = new SimpleMessageListenerContainer();
        container.setConnectionFactory(connectionFactory()); // connectionFactory 의 설정대로 rabbitmq 와 연결됨
        container.setQueueNames(chatQueueName); // 메세지 리스너가 해당하는 큐를 listen 함, 여러 큐 지정 가능
        container.setMessageListener(messageListener); // 메세지 리스너 등록
        return container;
    }

    @Bean
    public ConnectionFactory connectionFactory(){
        CachingConnectionFactory factory = new CachingConnectionFactory();
        factory.setHost("localhost");
        factory.setUsername("guest");
        factory.setPassword("guest");
        return factory;
    }

    @Bean
    public Jackson2JsonMessageConverter jsonMessageConverter(){
        return new Jackson2JsonMessageConverter();
    }
}
package com.example.videochatbackend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.messaging.converter.*;
import org.springframework.security.crypto.factory.PasswordEncoderFactories;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@SpringBootApplication
public class VideoChatBackendApplication {

	@Bean
	public PasswordEncoder passwordEncoder() {
		return PasswordEncoderFactories.createDelegatingPasswordEncoder();
	}

	@Bean
	public MessageConverter messageConverter() {
		List<MessageConverter> messageConverters =new ArrayList<>();
		return new CompositeMessageConverter(Arrays.asList(new MappingJackson2MessageConverter()));
	}
	public static void main(String[] args) {
		SpringApplication.run(VideoChatBackendApplication.class, args);
	}

}

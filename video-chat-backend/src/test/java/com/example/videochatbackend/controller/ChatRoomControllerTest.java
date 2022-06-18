package com.example.videochatbackend.controller;

import com.example.videochatbackend.domain.dto.ChatRoomDto;
import com.example.videochatbackend.domain.dto.ChatRoomKeyDto;
import com.example.videochatbackend.domain.exception.BeanValidationException;
import com.example.videochatbackend.service.ChatRoomService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.validation.BindingResult;

import static org.assertj.core.api.Assertions.*;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ChatRoomControllerTest {

    @InjectMocks
    private ChatRoomController chatRoomController;

    @Mock
    private ChatRoomService chatRoomService;

    @Mock
    private BindingResult bindingResult;

    @BeforeEach
    void before() {
        when(bindingResult.hasErrors()).thenReturn(true);
    }

    @Test
    void exceptionTest() {
        assertThatThrownBy(() -> chatRoomController.joinRoom(new ChatRoomKeyDto(), bindingResult)).isInstanceOf(BeanValidationException.class);
        assertThatThrownBy(() -> chatRoomController.createRoom(new ChatRoomDto(), bindingResult)).isInstanceOf(BeanValidationException.class);
    }
}
package com.example.videochatbackend.service;

import com.example.videochatbackend.domain.dto.ChatRoomDto;
import com.example.videochatbackend.domain.dto.ChatRoomKeyDto;
import com.example.videochatbackend.domain.dto.SessionIdDto;
import com.example.videochatbackend.domain.entity.ChatRoom;
import com.example.videochatbackend.domain.entity.JoinUser;
import com.example.videochatbackend.domain.exception.AlreadyJoinException;
import com.example.videochatbackend.domain.exception.FullRoomException;
import com.example.videochatbackend.domain.exception.PasswordMismatchException;
import com.example.videochatbackend.domain.exception.RoomNotFoundException;
import com.example.videochatbackend.repository.JoinUserRepository;
import com.example.videochatbackend.repository.chatRoom.ChatRoomRepository;
import com.example.videochatbackend.security.member.MemberDetails;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Spy;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.factory.PasswordEncoderFactories;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ChatRoomServiceImplTest {

    @InjectMocks
    private ChatRoomServiceImpl chatRoomService;

    @Mock
    private ChatRoomRepository chatRoomRepository;

    @Mock
    private JoinUserRepository joinUserRepository;

    @Mock
    private MemberDetails memberDetails;

    @Spy
    private PasswordEncoder passwordEncoder = PasswordEncoderFactories.createDelegatingPasswordEncoder();

    private ChatRoomDto chatRoomDto = new ChatRoomDto();

    private ChatRoomKeyDto chatRoomKeyDto = new ChatRoomKeyDto();

    @BeforeEach
    void beforeEach() {
        chatRoomDto.setRoomName("tmp");
        chatRoomDto.setPassword("tmp");

        chatRoomKeyDto.setPassword("osdjif");
        chatRoomKeyDto.setRoomId(1L);
    }

    @Test
    void getRoomKeyTest() {

        ChatRoom chatRoom = ChatRoom.create(chatRoomDto, passwordEncoder);
        chatRoom.setCount(9);

        when(chatRoomRepository.findById(anyLong())).thenReturn(Optional.empty());
        assertThatThrownBy(() -> chatRoomService.getRoomKey(chatRoomKeyDto)).isInstanceOf(RoomNotFoundException.class);

        when(chatRoomRepository.findById(anyLong())).thenReturn(Optional.of(chatRoom));
        assertThatThrownBy(() -> chatRoomService.getRoomKey(chatRoomKeyDto)).isInstanceOf(FullRoomException.class);

        chatRoom.setCount(0);
        when(chatRoomRepository.findById(anyLong())).thenReturn(Optional.of(chatRoom));
        assertThatThrownBy(() -> chatRoomService.getRoomKey(chatRoomKeyDto)).isInstanceOf(PasswordMismatchException.class);
    }

    @Test
    void joinRoomTest() {
        when(joinUserRepository.findBySessionId(anyString())).thenReturn(Optional.of(new JoinUser()));
        assertThatThrownBy(() -> chatRoomService.joinRoom(new SessionIdDto("tmp", "tmp"), memberDetails)).isInstanceOf(AlreadyJoinException.class);

        when(joinUserRepository.findBySessionId(anyString())).thenReturn(Optional.empty());
        when(chatRoomRepository.findByRoomKeyForCntUp(anyString())).thenReturn(Optional.empty());
        assertThatThrownBy(() -> chatRoomService.joinRoom(new SessionIdDto("tmp", "tmp"), memberDetails)).isInstanceOf(RoomNotFoundException.class);
    }
}
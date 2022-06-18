package com.example.videochatbackend.service;

import com.example.videochatbackend.domain.exception.NoSuchUserException;
import com.example.videochatbackend.repository.MemberRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class MemberServiceTest {

    @InjectMocks
    private MemberService memberService;

    @Mock
    private MemberRepository memberRepository;

    @Test
    void changeNicknameTest() {
        when(memberRepository.findByUsername(anyString())).thenReturn(Optional.empty());
        assertThatThrownBy(() -> memberService.changeNickname("sdlfkj", "sdofij")).isInstanceOf(NoSuchUserException.class);
    }

    @Test
    void getMemberInfoTest() {
        when(memberRepository.findByUsername(anyString())).thenReturn(Optional.empty());
        assertThatThrownBy(() -> memberService.getMemberInfo("sdiofj")).isInstanceOf(NoSuchUserException.class);
    }
}
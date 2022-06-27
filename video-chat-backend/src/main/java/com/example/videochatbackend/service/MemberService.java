package com.example.videochatbackend.service;

import com.example.videochatbackend.domain.dto.MemberInfoDto;
import com.example.videochatbackend.domain.dto.TmpMemberDto;
import com.example.videochatbackend.domain.entity.Member;
import com.example.videochatbackend.domain.enumtype.Role;
import com.example.videochatbackend.domain.exception.EmptyNicknameException;
import com.example.videochatbackend.domain.exception.NoSuchUserException;
import com.example.videochatbackend.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class MemberService {

    private final MemberRepository memberRepository;

    private final PasswordEncoder passwordEncoder;

    public MemberInfoDto getMemberInfo(String username) {

        Member member = memberRepository.findByUsername(username).orElseThrow(() -> new NoSuchUserException("로그인 실패"));
        return new MemberInfoDto(member);
    }

    public void changeNickname(String username, String nickname) {
        if (nickname.isEmpty()) {
            throw new EmptyNicknameException("닉네입을 입력해주세요");
        }
        Member member = memberRepository.findByUsername(username).orElseThrow(() -> new NoSuchUserException("닉네임을 바꿀 수 없습니다."));
        member.setNickname(nickname);
    }

    public TmpMemberDto createTmpMember() {
        String username = UUID.randomUUID().toString();
        String password = UUID.randomUUID().toString();
        Member member = new Member(username, password, "tmp", "tmp", Role.USER, passwordEncoder);
        memberRepository.save(member);
        return new TmpMemberDto(username, password);
    }
}

package com.example.videochatbackend.service;

import com.example.videochatbackend.domain.dto.MemberInfoDto;
import com.example.videochatbackend.domain.entity.Member;
import com.example.videochatbackend.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional
public class MemberService {

    private final MemberRepository memberRepository;

    public MemberInfoDto getMemberInfo(String username) {

        Optional<Member> byUsername = memberRepository.findByUsername(username);
        if (byUsername.isEmpty()) {
            return new MemberInfoDto(false);
        }
        return new MemberInfoDto(byUsername.get());
    }

    public void changeNickname(String username, String nickname) {
        Member member = memberRepository.findByUsername(username).orElseThrow(() -> new RuntimeException("no user"));
        member.setNickname(nickname);
    }
}

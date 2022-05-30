package com.example.videochatbackend.controller;

import com.example.videochatbackend.domain.dto.MemberInfoDto;
import com.example.videochatbackend.domain.entity.Member;
import com.example.videochatbackend.repository.MemberRepository;
import com.example.videochatbackend.security.member.MemberDetails;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Optional;

@RestController
@RequiredArgsConstructor
@Slf4j
public class MemberInfoController {

    private final MemberRepository memberRepository;

    @GetMapping("/api/memberInfo")
    public MemberInfoDto memberInfo(@AuthenticationPrincipal MemberDetails memberDetails) {

        if (memberDetails == null) {
            return new MemberInfoDto(false);
        }

        Optional<Member> byUsername = memberRepository.findByUsername(memberDetails.getUsername());
        if (byUsername.isEmpty()) {
            return new MemberInfoDto(false);
        }
        return new MemberInfoDto(byUsername.get());
    }
}

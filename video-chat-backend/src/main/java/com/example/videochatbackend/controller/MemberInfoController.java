package com.example.videochatbackend.controller;

import com.example.videochatbackend.domain.dto.MemberInfoDto;
import com.example.videochatbackend.domain.exception.NoSuchUserException;
import com.example.videochatbackend.security.member.MemberDetails;
import com.example.videochatbackend.service.MemberService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@Slf4j
@RequestMapping("/api")
public class MemberInfoController {

    private final MemberService memberService;

    @GetMapping("/memberInfo")
    public MemberInfoDto memberInfo(@AuthenticationPrincipal MemberDetails memberDetails) {

        if (memberDetails == null) {
            throw new NoSuchUserException("로그인 실패");
        }
        return memberService.getMemberInfo(memberDetails.getUsername());
    }

    @GetMapping("/changeNickname")
    public ResponseEntity<String> changeNickname(@AuthenticationPrincipal MemberDetails memberDetails, @RequestParam(required = false) String nickname) {
        memberService.changeNickname(memberDetails.getUsername(), nickname);
        return new ResponseEntity<>(HttpStatus.OK);
    }
}

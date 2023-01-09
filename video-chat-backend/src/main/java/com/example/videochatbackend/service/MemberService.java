package com.example.videochatbackend.service;

import com.example.videochatbackend.domain.dto.MemberInfoDto;
import com.example.videochatbackend.domain.dto.TmpMemberDto;

public interface MemberService {

    MemberInfoDto getMemberInfo(String username);

    void changeNickname(String username, String nickname);

    TmpMemberDto createTmpMember();
}

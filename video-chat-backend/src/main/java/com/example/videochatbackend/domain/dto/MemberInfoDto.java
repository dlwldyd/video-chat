package com.example.videochatbackend.domain.dto;

import com.example.videochatbackend.domain.entity.Member;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class MemberInfoDto {

    private boolean authenticated;

    private String email;

    private String nickname;

    public MemberInfoDto(boolean authenticated) {
        this.authenticated = authenticated;
    }

    public MemberInfoDto(Member member) {
        this.authenticated = true;
        this.email = member.getEmail();
        this.nickname = member.getNickname();
    }
}

package com.example.videochatbackend.security.member;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.oauth2.core.user.OAuth2User;

import java.util.Collection;
import java.util.Map;

public class MemberDetails implements OAuth2User {

    private Map<String, Object> attributes;

    public MemberDetails(Map<String, Object> attributes) {
        this.attributes = attributes;
    }

    // 유저 정보 리턴
    @Override
    public Map<String, Object> getAttributes() {
        return attributes;
    }

    //해당 유저의 권한을 리턴
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return null;
    }

    //sub값 리턴
    @Override
    public String getName() {
        return (String) attributes.get("sub");
    }
}

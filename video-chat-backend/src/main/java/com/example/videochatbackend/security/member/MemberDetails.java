package com.example.videochatbackend.security.member;

import com.example.videochatbackend.domain.entity.Member;
import com.example.videochatbackend.security.provider.OAuthUserInfo;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.oauth2.core.user.OAuth2User;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Map;

@RequiredArgsConstructor
public class MemberDetails implements OAuth2User, UserDetails {

    private final Member member;

    private OAuthUserInfo oAuthUserInfo;

    public MemberDetails(Member member, OAuthUserInfo oAuthUserInfo) {
        this.member = member;
        this.oAuthUserInfo = oAuthUserInfo;
    }

    // 유저 정보 리턴
    @Override
    public Map<String, Object> getAttributes() {
        return oAuthUserInfo.getAttributes();
    }

    //해당 유저의 권한을 리턴
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        List<GrantedAuthority> roles = new ArrayList<>();
        roles.add(new SimpleGrantedAuthority(member.getRole().getDescription()));
        return roles;
    }

    @Override
    public String getPassword() {
        return member.getPassword();
    }

    //sub값 리턴
    @Override
    public String getName() {
        return oAuthUserInfo.getProviderId();
    }

    public String getUsername() {
        return member.getUsername();
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }

    public String getNickname() {
        return member.getNickname();
    }

    public String getEmail() {
        return member.getEmail();
    }
}

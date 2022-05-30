package com.example.videochatbackend.service;

import com.example.videochatbackend.domain.entity.Member;
import com.example.videochatbackend.domain.enumtype.Role;
import com.example.videochatbackend.repository.MemberRepository;
import com.example.videochatbackend.security.member.MemberDetails;
import com.example.videochatbackend.security.provider.GoogleOAuthUserInfo;
import com.example.videochatbackend.security.provider.NaverOAuthUserInfo;
import com.example.videochatbackend.security.provider.OAuthUserInfo;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.Map;
import java.util.Optional;

//액세스 토큰을 받기까지의 과정을 oauth2-client 가 전부 자동화해준다.
//여기에서는 authorization server 로 부터 받은 액세스 토큰과 유저 정보를 다룬다.
@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class PrincipalOauth2UserService extends DefaultOAuth2UserService {

    private final PasswordEncoder passwordEncoder;
    private final MemberRepository memberRepository;

    //userRequest 에는 authorization server 로 부터 받은 유저정보 뿐만 아니라 어느 authorization server 로 부터 받았는지(getClientRegistration())에 대한 정보도 들어있다.
    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {

        OAuth2User oAuth2User = super.loadUser(userRequest);
        OAuthUserInfo oAuthUserInfo = null;

        String provider = userRequest.getClientRegistration().getRegistrationId();

        if (provider.equals("google")) {
            oAuthUserInfo = new GoogleOAuthUserInfo(oAuth2User.getAttributes());
        } else if (provider.equals("naver")) {
            oAuthUserInfo = new NaverOAuthUserInfo((Map<String, Object>) oAuth2User.getAttribute("response"));
        }
        String providerId = oAuthUserInfo.getProviderId();
        String email = oAuthUserInfo.getEmail();
        String nickname = oAuthUserInfo.getName();
        String username = provider + "_" + providerId;
        String password = "ocj5df!983@5f";

        Optional<Member> byUsername = memberRepository.findByUsername(username);

        Member member;

        if (byUsername.isEmpty()) {
            member = new Member(username, password, email, nickname, Role.USER, passwordEncoder);
            memberRepository.save(member);
        } else {
            member = byUsername.get();
        }

        MemberDetails memberDetails = new MemberDetails(member, oAuthUserInfo);

        return memberDetails;
    }
}

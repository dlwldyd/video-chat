package com.example.videochatbackend.security.config;

import com.example.videochatbackend.service.PrincipalOauth2UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.crypto.factory.PasswordEncoderFactories;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserService;

@Configuration
@RequiredArgsConstructor
public class SecurityConfig extends WebSecurityConfigurerAdapter {

    private final PrincipalOauth2UserService principalOauth2UserService;

    @Value("${baseUrl}")
    private String loginSuccessUrl;

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http.authorizeRequests()
                .anyRequest().permitAll();
        http.headers()
                .frameOptions()
                .sameOrigin();
        http.oauth2Login() // 이걸 설정해야 /oauth2/authorization/google 로 요청을 받았을 때 구글로 로그인 하도록 리다이렉트함
                .loginPage("/login")
                .defaultSuccessUrl(loginSuccessUrl)
                .userInfoEndpoint()
                .userService(principalOauth2UserService);
    }
}

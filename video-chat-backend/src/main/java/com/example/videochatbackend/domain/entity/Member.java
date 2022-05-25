package com.example.videochatbackend.domain.entity;

import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;

@Entity
@NoArgsConstructor
@Getter
public class Member {

    @Id
    @GeneratedValue
    @Column(name = "member_id")
    private Long id;

    private String username;

    private String password;

    private String email;

    private String nickname;

    public Member(String username, String password, String email, String nickname, PasswordEncoder passwordEncoder) {
        this.username = username;
        this.password = passwordEncoder.encode(password);
        this.email = email;
        this.nickname = nickname;
    }
}

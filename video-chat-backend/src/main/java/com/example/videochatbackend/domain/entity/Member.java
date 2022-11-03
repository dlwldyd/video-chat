package com.example.videochatbackend.domain.entity;

import com.example.videochatbackend.domain.enumtype.Role;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;

import javax.persistence.*;

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

    @Enumerated(EnumType.STRING)
    private Role role;

    public Member(String username, String password, String email, String nickname, Role role, PasswordEncoder passwordEncoder) {
        this.username = username;
        this.password = passwordEncoder.encode(password);
        this.email = email;
        this.nickname = nickname;
        this.role = role;
    }

    public void setNickname(String nickname) {
        this.nickname = nickname;
    }
}

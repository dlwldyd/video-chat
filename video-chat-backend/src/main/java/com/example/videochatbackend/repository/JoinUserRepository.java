package com.example.videochatbackend.repository;

import com.example.videochatbackend.domain.entity.JoinUser;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface JoinUserRepository extends JpaRepository<JoinUser, Long> {

    Optional<JoinUser> findBySimpSessionId(String simpSessionId);
}

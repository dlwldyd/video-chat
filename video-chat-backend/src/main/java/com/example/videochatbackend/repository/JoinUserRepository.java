package com.example.videochatbackend.repository;

import com.example.videochatbackend.domain.entity.JoinUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface JoinUserRepository extends JpaRepository<JoinUser, Long> {

    @Query("select ju from JoinUser ju join fetch ju.chatRoom where ju.sessionId = :sessionId")
    Optional<JoinUser> findBySessionId(@Param("sessionId") String sessionId);
}

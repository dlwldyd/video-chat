package com.example.videochatbackend.repository;

import com.example.videochatbackend.domain.entity.JoinUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.QueryHints;
import org.springframework.data.repository.query.Param;

import javax.persistence.LockModeType;
import javax.persistence.QueryHint;
import java.util.Optional;

public interface JoinUserRepository extends JpaRepository<JoinUser, Long> {

    @Query("select ju from JoinUser ju where ju.sessionId = :sessionId")
    Optional<JoinUser> findBySessionId(@Param("sessionId") String sessionId);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @QueryHints(
        {@QueryHint(name = "javax.persistence.lock.scope", value = "EXTENDED")}
    )
    @Query("select ju from JoinUser ju join fetch ju.chatRoom where ju.sessionId = :sessionId")
    Optional<JoinUser> findBySessionIdForCntDown(@Param("sessionId") String sessionId);
}

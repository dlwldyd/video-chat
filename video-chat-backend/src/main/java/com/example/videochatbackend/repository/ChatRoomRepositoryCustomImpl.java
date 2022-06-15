package com.example.videochatbackend.repository;

import com.example.videochatbackend.domain.entity.ChatRoom;
import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.jpa.impl.JPAQuery;
import com.querydsl.jpa.impl.JPAQueryFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.support.PageableExecutionUtils;

import javax.persistence.EntityManager;
import java.util.List;

import static com.example.videochatbackend.domain.entity.QChatRoom.*;

public class ChatRoomRepositoryCustomImpl implements ChatRoomRepositoryCustom {

    private final JPAQueryFactory jpaQueryFactory;

    public ChatRoomRepositoryCustomImpl(EntityManager em) {
        this.jpaQueryFactory = new JPAQueryFactory(em);
    }

    @Override
    public Page<ChatRoom> findRooms(Pageable pageable, String roomName) {

        List<ChatRoom> results = jpaQueryFactory.selectFrom(chatRoom)
                .where(roomNameLike(roomName))
                .orderBy(chatRoom.id.desc())
                .offset(pageable.getOffset())
                .limit(pageable.getPageSize())
                .fetch();

        JPAQuery<Long> countQuery = jpaQueryFactory.select(chatRoom.count())
                .from(chatRoom)
                .where(roomNameLike(roomName));

        Page<ChatRoom> page = PageableExecutionUtils.getPage(results, pageable, countQuery::fetchOne);

        return page;
    }

    private BooleanExpression roomNameLike(String roomName) {
        return roomName == null || roomName.isEmpty() ? null : chatRoom.roomName.like("%" + roomName + "%");
    }
}

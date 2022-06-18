package com.example.videochatbackend.controller;

import com.example.videochatbackend.domain.dto.ChatRoomDto;
import com.example.videochatbackend.domain.dto.ChatRoomKeyDto;
import com.example.videochatbackend.domain.dto.RoomInfoDto;
import com.example.videochatbackend.domain.dto.SessionIdDto;
import com.example.videochatbackend.domain.exception.BeanValidationException;
import com.example.videochatbackend.security.member.MemberDetails;
import com.example.videochatbackend.service.ChatRoomService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.validation.BindingResult;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@Slf4j
@RequestMapping("/api")
public class ChatRoomController {

    private final ChatRoomService chatRoomService;

    @PostMapping("/createRoom")
    public ChatRoomKeyDto createRoom(@RequestBody @Validated ChatRoomDto chatRoomDto, BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            throw new BeanValidationException("방 이름을 입력해주세요");
        }
        return chatRoomService.createRoom(chatRoomDto);
    }

    @GetMapping("/roomInfo")
    public Page<RoomInfoDto> searchRoom(@PageableDefault(size = 15) Pageable pageable, @RequestParam(required = false) String roomName) {
        return chatRoomService.searchRoom(pageable, roomName);
    }

    @PostMapping("/getRoomKey")
    public ChatRoomKeyDto joinRoom(@RequestBody @Validated ChatRoomKeyDto chatRoomKeyDto, BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            throw new BeanValidationException("방을 찾을 수 없습니다.");
        }
        return chatRoomService.getRoomKey(chatRoomKeyDto);
    }

    @PostMapping("/joinRoom")
    public ResponseEntity<String> joinRoom(@RequestBody SessionIdDto sessionIdDto, @AuthenticationPrincipal MemberDetails memberDetails) {
        chatRoomService.joinRoom(sessionIdDto, memberDetails);
        return new ResponseEntity<>(HttpStatus.OK);
    }
}

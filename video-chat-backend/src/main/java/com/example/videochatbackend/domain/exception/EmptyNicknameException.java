package com.example.videochatbackend.domain.exception;

public class EmptyNicknameException extends RuntimeException {

    public EmptyNicknameException(String message) {
        super(message);
    }
}

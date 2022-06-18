package com.example.videochatbackend.domain.exception;

public class AlreadyJoinException extends NotAcceptableException {

    public AlreadyJoinException(String message) {
        super(message);
    }
}

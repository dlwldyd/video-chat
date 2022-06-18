package com.example.videochatbackend.domain.exception;

public class FullRoomException extends NotAcceptableException {

    public FullRoomException(String message) {
        super(message);
    }
}

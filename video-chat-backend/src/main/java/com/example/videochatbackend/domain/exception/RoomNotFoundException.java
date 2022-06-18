package com.example.videochatbackend.domain.exception;

public class RoomNotFoundException extends NotAcceptableException {

    public RoomNotFoundException(String message) {
        super(message);
    }
}

package com.example.videochatbackend.domain.exception;

public class NotAcceptableException extends RuntimeException {
    public NotAcceptableException(String message) {
        super(message);
    }
}

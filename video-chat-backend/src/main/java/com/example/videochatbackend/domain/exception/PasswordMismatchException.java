package com.example.videochatbackend.domain.exception;

public class PasswordMismatchException extends NotAcceptableException {

    public PasswordMismatchException(String message) {
        super(message);
    }
}

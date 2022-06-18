package com.example.videochatbackend.domain.exception;

public class BeanValidationException extends IllegalArgumentException {

    public BeanValidationException(String s) {
        super(s);
    }
}

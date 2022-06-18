package com.example.videochatbackend.controller.controllerAdvice;

import com.example.videochatbackend.domain.exception.*;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
@Slf4j
public class ExceptionHandlerControllerAdvice {

    @ExceptionHandler
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ErrorResult beanValidationExHandler(BeanValidationException e) {
        return new ErrorResult(e.getMessage());
    }

    @ExceptionHandler
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ErrorResult badRequestExHandler(NotAcceptableException e) {
        return new ErrorResult(e.getMessage());
    }

    @ExceptionHandler
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ErrorResult noSuchUserExHandler(NoSuchUserException e) {
        return new ErrorResult(e.getMessage());
    }

    @ExceptionHandler
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ErrorResult emptyNicknameExHandler(EmptyNicknameException e) {
        return new ErrorResult(e.getMessage());
    }
}

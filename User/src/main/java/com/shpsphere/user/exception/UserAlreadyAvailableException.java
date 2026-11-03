package com.shpsphere.user.exception;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public class UserAlreadyAvailableException extends RuntimeException {

    public UserAlreadyAvailableException(String message) {
        super(message);
    }
}

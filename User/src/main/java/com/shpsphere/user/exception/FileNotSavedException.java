package com.shpsphere.user.exception;

public class FileNotSavedException extends RuntimeException {
    public FileNotSavedException(String message, Throwable cause) {
        super(message, cause);
    }
}

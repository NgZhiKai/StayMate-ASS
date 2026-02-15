package com.example.emailservice.exception;

public class EmailServiceException extends Exception {
    public EmailServiceException(String message, Throwable cause) {
        super(message, cause);
    }

    public EmailServiceException(String message) {
        super(message);
    }

    public EmailServiceException(Throwable cause) {
        super(cause);
    }
}

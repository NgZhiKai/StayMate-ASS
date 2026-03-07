package com.example.paymentservice.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import com.example.paymentservice.dto.custom.CustomResponse;

/**
 * Global exception handler for the PaymentService API
 */
@ControllerAdvice
public class GlobalExceptionHandler {

    // Handle illegal argument exceptions (400)
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<CustomResponse<String>> handleIllegalArgument(IllegalArgumentException ex) {
        return buildResponse(HttpStatus.BAD_REQUEST, ex.getMessage());
    }

    @ExceptionHandler(PaymentNotFoundException.class)
    public ResponseEntity<CustomResponse<String>> handleNotFound(PaymentNotFoundException ex) {
        return buildResponse(HttpStatus.NOT_FOUND, ex.getMessage());
    }

    @ExceptionHandler(BookingClientException.class)
    public ResponseEntity<CustomResponse<String>> handleBookingClient(BookingClientException ex) {
        return buildResponse(HttpStatus.BAD_GATEWAY, ex.getMessage());
    }

    @ExceptionHandler(IllegalStateException.class)
    public ResponseEntity<CustomResponse<String>> handleIllegalState(IllegalStateException ex) {
        return buildResponse(HttpStatus.CONFLICT, ex.getMessage());
    }

    // Catch all other runtime exceptions (500)
    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<CustomResponse<String>> handleRuntime(RuntimeException ex) {
        return buildResponse(HttpStatus.INTERNAL_SERVER_ERROR, ex.getMessage());
    }

    // Catch all other exceptions (500)
    @ExceptionHandler(Exception.class)
    public ResponseEntity<CustomResponse<String>> handleException(Exception ex) {
        return buildResponse(HttpStatus.INTERNAL_SERVER_ERROR, "Internal server error: " + ex.getMessage());
    }

    // Helper to build consistent response
    private ResponseEntity<CustomResponse<String>> buildResponse(HttpStatus status, String message) {
        return ResponseEntity.status(status).body(new CustomResponse<>(message, null));
    }
}

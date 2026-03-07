package com.example.hotelservice.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import com.example.hotelservice.dto.custom.CustomResponse;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler({
            ResourceNotFoundException.class,
            HotelNotFoundException.class,
            RoomNotFoundException.class
    })
    public ResponseEntity<CustomResponse<Void>> handleNotFound(RuntimeException ex) {
        return build(HttpStatus.NOT_FOUND, ex.getMessage());
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<CustomResponse<Void>> handleBadRequest(IllegalArgumentException ex) {
        return build(HttpStatus.BAD_REQUEST, ex.getMessage());
    }

    @ExceptionHandler(RoomAlreadyBookedException.class)
    public ResponseEntity<CustomResponse<Void>> handleConflict(RoomAlreadyBookedException ex) {
        return build(HttpStatus.CONFLICT, ex.getMessage());
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<CustomResponse<Void>> handleValidation(MethodArgumentNotValidException ex) {
        String message = ex.getBindingResult().getAllErrors().stream()
                .findFirst()
                .map(error -> error.getDefaultMessage())
                .orElse("Validation failed");
        return build(HttpStatus.BAD_REQUEST, message);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<CustomResponse<Void>> handleException(Exception ex) {
        return build(HttpStatus.INTERNAL_SERVER_ERROR, "Internal server error: " + ex.getMessage());
    }

    private ResponseEntity<CustomResponse<Void>> build(HttpStatus status, String message) {
        return ResponseEntity.status(status).body(new CustomResponse<>(message, null));
    }
}

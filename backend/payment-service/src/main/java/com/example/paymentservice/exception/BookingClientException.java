package com.example.paymentservice.exception;

/**
 * Custom exception for errors in communicating with the Booking microservice.
 */
public class BookingClientException extends RuntimeException {

    /**
     * Constructs a new BookingClientException with the specified detail message.
     * 
     * @param message the detail message
     */
    public BookingClientException(String message) {
        super(message);
    }

    /**
     * Constructs a new BookingClientException with the specified detail message and
     * cause.
     * 
     * @param message the detail message
     * @param cause   the cause of the exception
     */
    public BookingClientException(String message, Throwable cause) {
        super(message, cause);
    }
}
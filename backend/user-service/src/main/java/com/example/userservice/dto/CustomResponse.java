package com.example.userservice.dto;

public class CustomResponse<T> {
    private String message;
    private T data;

    public CustomResponse() {
    }

    public CustomResponse(String message, T data) {
        this.message = message;
        this.data = data;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public T getData() {
        return data;
    }

    public void setData(T data) {
        this.data = data;
    }
}
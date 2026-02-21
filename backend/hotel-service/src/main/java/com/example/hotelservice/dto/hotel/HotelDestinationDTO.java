package com.example.hotelservice.dto.hotel;

public class HotelDestinationDTO {
    private String city;
    private String country;
    private long count;
    private String imageUrl; // new field for country/city image

    public HotelDestinationDTO(String city, String country, long count, String imageUrl) {
        this.city = city;
        this.country = country;
        this.count = count;
        this.imageUrl = imageUrl;
    }

    // Getters & setters
    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getCountry() {
        return country;
    }

    public void setCountry(String country) {
        this.country = country;
    }

    public long getCount() {
        return count;
    }

    public void setCount(long count) {
        this.count = count;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }
}
package com.example.hotelservice.dto.hotel;

import java.time.LocalTime;

import com.example.hotelservice.entity.hotel.Hotel;

public class HotelSearchDTO {

    private Long id;
    private String name;
    private String address;
    private String city;
    private String country;
    private double latitude;
    private double longitude;
    private byte[] image;
    private String description;
    private String contact;
    private LocalTime checkIn;
    private LocalTime checkOut;

    private double averageRating;
    private double minPrice;
    private double maxPrice;

    public HotelSearchDTO(Hotel hotel, double averageRating, double minPrice, double maxPrice) {

        // Copy ALL hotel fields
        this.id = hotel.getId();
        this.name = hotel.getName();
        this.address = hotel.getAddress();
        this.city = hotel.getCity();
        this.country = hotel.getCountry();
        this.latitude = hotel.getLatitude();
        this.longitude = hotel.getLongitude();
        this.image = hotel.getImage();
        this.description = hotel.getDescription();
        this.contact = hotel.getContact();
        this.checkIn = hotel.getCheckIn();
        this.checkOut = hotel.getCheckOut();

        // Extra calculated fields
        this.averageRating = averageRating;
        this.minPrice = minPrice;
        this.maxPrice = maxPrice;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

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

    public double getLatitude() {
        return latitude;
    }

    public void setLatitude(double latitude) {
        this.latitude = latitude;
    }

    public double getLongitude() {
        return longitude;
    }

    public void setLongitude(double longitude) {
        this.longitude = longitude;
    }

    public byte[] getImage() {
        return image;
    }

    public void setImage(byte[] image) {
        this.image = image;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getContact() {
        return contact;
    }

    public void setContact(String contact) {
        this.contact = contact;
    }

    public LocalTime getCheckIn() {
        return checkIn;
    }

    public void setCheckIn(LocalTime checkIn) {
        this.checkIn = checkIn;
    }

    public LocalTime getCheckOut() {
        return checkOut;
    }

    public void setCheckOut(LocalTime checkOut) {
        this.checkOut = checkOut;
    }

    public double getAverageRating() {
        return averageRating;
    }

    public void setAvgRating(double averageRating) {
        this.averageRating = averageRating;
    }

    public double getMinPrice() {
        return minPrice;
    }

    public void setMinPrice(double minPrice) {
        this.minPrice = minPrice;
    }

    public double getMaxPrice() {
        return maxPrice;
    }

    public void setMaxPrice(double maxPrice) {
        this.maxPrice = maxPrice;
    }

}

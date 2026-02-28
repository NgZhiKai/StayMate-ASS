package com.example.hotelservice.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.hotelservice.entity.cityimage.CityImage;

public interface CityImageRepository extends JpaRepository<CityImage, Long> {
    Optional<CityImage> findByCity(String city);
}
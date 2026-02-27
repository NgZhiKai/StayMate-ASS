package com.example.hotelservice.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.example.hotelservice.entity.hotel.Hotel;

@Repository
public interface HotelRepository extends JpaRepository<Hotel, Long> {

    List<Hotel> findByNameContaining(String name);

    List<Hotel> findByCityIgnoreCaseContainingAndCountryIgnoreCaseContaining(String city, String country);

    @Query("SELECT h.city, h.country, COUNT(h) FROM Hotel h GROUP BY h.city, h.country ORDER BY COUNT(h) DESC")
    List<Object[]> countHotelsByCityAndCountry();

}
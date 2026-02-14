package com.example.hotelservice.service;

import java.util.Collections;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;

import com.example.hotelservice.entity.hotel.Hotel;
import com.example.hotelservice.entity.room.Room;
import com.example.hotelservice.exception.ResourceNotFoundException;
import com.example.hotelservice.repository.HotelRepository;

@Service
public class HotelService {

    private final HotelRepository hotelRepository;

    public HotelService(@NonNull HotelRepository hotelRepository) {
        this.hotelRepository = Objects.requireNonNull(hotelRepository, "HotelRepository must not be null");
    }

    public List<Hotel> getAllHotels() {
        return hotelRepository.findAll();
    }

    public Hotel getHotelById(@NonNull Long id) {
        Objects.requireNonNull(id, "Hotel ID must not be null");
        return hotelRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Hotel not found with ID " + id));
    }

    public Hotel saveHotel(@NonNull Hotel hotel) {
        Objects.requireNonNull(hotel, "Hotel must not be null");
        return hotelRepository.save(hotel);
    }

    public void deleteHotel(@NonNull Long id) {
        Objects.requireNonNull(id, "Hotel ID must not be null");
        Hotel hotel = hotelRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Hotel not found for deletion with ID " + id));
        hotelRepository.delete(hotel);
    }

    public List<Hotel> findHotelsByName(@NonNull String name) {
        Objects.requireNonNull(name, "Name must not be null");
        return hotelRepository.findByNameContaining(name);
    }

    public List<Hotel> searchHotelsByName(@NonNull String name) {
        return findHotelsByName(name);
    }

    public List<Room> getRoomsByHotel(@NonNull Long hotelId) {
        Objects.requireNonNull(hotelId, "Hotel ID must not be null");
        return hotelRepository.findById(hotelId)
                .map(Hotel::getRooms)
                .filter(Objects::nonNull)
                .orElse(Collections.emptyList());
    }

    private static double calculateDistance(@NonNull Double lat1, @NonNull Double lon1,
            @NonNull Double lat2, @NonNull Double lon2) {
        Objects.requireNonNull(lat1, "lat1 must not be null");
        Objects.requireNonNull(lon1, "lon1 must not be null");
        Objects.requireNonNull(lat2, "lat2 must not be null");
        Objects.requireNonNull(lon2, "lon2 must not be null");

        final double R = 6371; // Earth radius in km
        double latDistance = Math.toRadians(lat2 - lat1);
        double lonDistance = Math.toRadians(lon2 - lon1);

        double a = Math.sin(latDistance / 2) * Math.sin(latDistance / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                        * Math.sin(lonDistance / 2) * Math.sin(lonDistance / 2);

        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }

    public List<Hotel> getNearbyHotels(@NonNull Double latitude, @NonNull Double longitude) {
        Objects.requireNonNull(latitude, "Latitude must not be null");
        Objects.requireNonNull(longitude, "Longitude must not be null");

        return hotelRepository.findAll().stream()
                .filter(hotel -> {
                    Double hotelLat = hotel.getLatitude();
                    Double hotelLon = hotel.getLongitude();
                    return hotelLat != null && hotelLon != null
                            && calculateDistance(latitude, longitude, hotelLat, hotelLon) <= 10;
                })
                .toList(); // <-- unmodifiable list
    }
}
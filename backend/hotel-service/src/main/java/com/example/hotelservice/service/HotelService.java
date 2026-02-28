package com.example.hotelservice.service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Objects;

import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.hotelservice.dto.hotel.HotelSearchDTO;
import com.example.hotelservice.entity.hotel.Hotel;
import com.example.hotelservice.entity.review.Review;
import com.example.hotelservice.entity.room.Room;
import com.example.hotelservice.exception.ResourceNotFoundException;
import com.example.hotelservice.repository.HotelRepository;

@Service
public class HotelService {

    private static final String HOTEL_REPOSITORY_NULL_MESSAGE = "HotelRepository must not be null";
    private static final String HOTEL_ID_NULL_MESSAGE = "Hotel ID must not be null";
    private static final String HOTEL_NULL_MESSAGE = "Hotel must not be null";
    private static final String NAME_NULL_MESSAGE = "Name must not be null";
    private static final String LATITUDE_NULL_MESSAGE = "Latitude must not be null";
    private static final String LONGITUDE_NULL_MESSAGE = "Longitude must not be null";

    private final HotelRepository hotelRepository;
    private final ImageService imageService;
    private final RoomService roomService;
    private final ReviewService reviewService;

    public HotelService(
            @NonNull HotelRepository hotelRepository,
            ImageService imageService,
            RoomService roomService,
            ReviewService reviewService) {
        this.hotelRepository = Objects.requireNonNull(hotelRepository, HOTEL_REPOSITORY_NULL_MESSAGE);
        this.imageService = imageService;
        this.roomService = roomService;
        this.reviewService = reviewService;
    }

    public List<HotelSearchDTO> getHotelsByIds(List<Long> ids) {
        List<Hotel> hotels = hotelRepository.findAllById(ids);
        return hotels.stream().map(this::toHotelSearchDTO).toList();
    }

    public List<HotelSearchDTO> getAllHotels() {
        List<Hotel> hotels = hotelRepository.findAll();
        return hotels.stream().map(this::toHotelSearchDTO).toList();
    }

    public Hotel getHotelEntityById(Long id) {
        return hotelRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Hotel not found with ID " + id));
    }

    public HotelSearchDTO getHotelById(@NonNull Long id) {
        Objects.requireNonNull(id, HOTEL_ID_NULL_MESSAGE);

        Hotel hotel = hotelRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Hotel not found with ID " + id));
        return toHotelSearchDTO(hotel);
    }

    public Hotel saveHotel(@NonNull Hotel hotel) {
        Objects.requireNonNull(hotel, HOTEL_NULL_MESSAGE);
        return hotelRepository.save(hotel);
    }

    @Transactional
    public void deleteHotel(@NonNull Long id) {
        Objects.requireNonNull(id, HOTEL_ID_NULL_MESSAGE);

        Hotel hotel = hotelRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Hotel not found for deletion with ID " + id));

        reviewService.deleteReviewsByHotelId(id);
        hotelRepository.delete(hotel);
    }

    public List<HotelSearchDTO> findHotelsByName(@NonNull String name) {
        Objects.requireNonNull(name, NAME_NULL_MESSAGE);
        List<Hotel> hotels = hotelRepository.findByNameContaining(name);
        return hotels.stream().map(this::toHotelSearchDTO).toList();
    }

    public List<Room> getRoomsByHotel(@NonNull Long hotelId) {
        Objects.requireNonNull(hotelId, HOTEL_ID_NULL_MESSAGE);
        return hotelRepository.findById(hotelId)
                .map(Hotel::getRooms)
                .filter(Objects::nonNull)
                .orElse(Collections.emptyList());
    }

    private static double calculateDistance(
            @NonNull Double lat1,
            @NonNull Double lon1,
            @NonNull Double lat2,
            @NonNull Double lon2) {
        Objects.requireNonNull(lat1, "lat1 must not be null");
        Objects.requireNonNull(lon1, "lon1 must not be null");
        Objects.requireNonNull(lat2, "lat2 must not be null");
        Objects.requireNonNull(lon2, "lon2 must not be null");

        final double R = 6371;
        double latDistance = Math.toRadians(lat2 - lat1);
        double lonDistance = Math.toRadians(lon2 - lon1);

        double a = Math.sin(latDistance / 2) * Math.sin(latDistance / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                        * Math.sin(lonDistance / 2) * Math.sin(lonDistance / 2);

        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }

    public List<Hotel> getNearbyHotels(@NonNull Double latitude, @NonNull Double longitude) {
        Objects.requireNonNull(latitude, LATITUDE_NULL_MESSAGE);
        Objects.requireNonNull(longitude, LONGITUDE_NULL_MESSAGE);

        return hotelRepository.findAll().stream()
                .filter(hotel -> {
                    Double hotelLat = hotel.getLatitude();
                    Double hotelLon = hotel.getLongitude();
                    return hotelLat != null && hotelLon != null
                            && calculateDistance(latitude, longitude, hotelLat, hotelLon) <= 10;
                })
                .toList();
    }

    public List<HotelSearchDTO> findHotelsByCityAndCountry(String city, String country) {
        String normalizedCity = city == null ? "" : city;
        String normalizedCountry = country == null ? "" : country;

        List<Hotel> hotels = hotelRepository.findByCityIgnoreCaseContainingAndCountryIgnoreCaseContaining(
                normalizedCity,
                normalizedCountry);
        return hotels.stream().map(this::toHotelSearchDTO).toList();
    }

    public List<Map<String, Object>> getHotelCountsByCityCountry() {
        List<Object[]> results = hotelRepository.countHotelsByCityAndCountry();
        List<Map<String, Object>> destinations = new ArrayList<>();

        for (Object[] row : results) {
            String city = (String) row[0];
            String country = (String) row[1];
            Long count = (Long) row[2];

            String imageBase64 = imageService.getDestinationImageBase64(city, country);

            Map<String, Object> dest = Map.of(
                    "city", city,
                    "country", country,
                    "count", count,
                    "imageBase64", imageBase64);
            destinations.add(dest);
        }

        return destinations;
    }

    private HotelSearchDTO toHotelSearchDTO(Hotel hotel) {
        List<Room> rooms = roomService.getHotelRooms(hotel.getId());
        double minPrice = rooms.stream().mapToDouble(Room::getPricePerNight).min().orElse(0);
        double maxPrice = rooms.stream().mapToDouble(Room::getPricePerNight).max().orElse(0);

        List<Review> reviews = reviewService.findReviewsByHotelId(hotel.getId());
        double avgRating = reviews.stream().mapToInt(Review::getRating).average().orElse(0);

        return new HotelSearchDTO(hotel, avgRating, minPrice, maxPrice);
    }
}

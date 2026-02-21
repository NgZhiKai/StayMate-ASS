package com.example.hotelservice.service;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Objects;

import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;

import com.example.hotelservice.entity.hotel.Hotel;
import com.example.hotelservice.entity.room.Room;
import com.example.hotelservice.exception.ResourceNotFoundException;
import com.example.hotelservice.repository.HotelRepository;

@Service
public class HotelService {

    private final HotelRepository hotelRepository;
    private final String PIXABAY_API_KEY;

    public HotelService(@NonNull HotelRepository hotelRepository, @Value("${pixabay.api.key}") String apiKey) {
        this.hotelRepository = Objects.requireNonNull(hotelRepository, "HotelRepository must not be null");
        this.PIXABAY_API_KEY = apiKey;
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
                .toList();
    }

    public List<Hotel> findHotelsByCityAndCountry(String city, String country) {
        if (city == null)
            city = "";
        if (country == null)
            country = "";
        return hotelRepository.findByCityIgnoreCaseContainingAndCountryIgnoreCaseContaining(city, country);
    }

    public List<Map<String, Object>> getHotelCountsByCityCountry() {
        List<Object[]> results = hotelRepository.countHotelsByCityAndCountry();

        List<Map<String, Object>> destinations = new ArrayList<>();
        for (Object[] row : results) {
            String city = (String) row[0];
            String country = (String) row[1];
            Long count = (Long) row[2];

            // Map city/country to an image URL
            String imageUrl = getDestinationImageUrl(city, country);

            Map<String, Object> dest = Map.of(
                    "city", city,
                    "country", country,
                    "count", count,
                    "imageUrl", imageUrl);
            destinations.add(dest);
        }

        return destinations;
    }

    /**
     * Returns a HTTPS URL for the city/country image
     */
    private String getDestinationImageUrl(String city, String country) {
        try {
            // 1️⃣ Try Pixabay API
            String query = city + " " + country;
            String apiUrl = "https://pixabay.com/api/?key=" + PIXABAY_API_KEY
                    + "&q=" + URLEncoder.encode(query, "UTF-8")
                    + "&image_type=photo&per_page=1";

            HttpURLConnection conn = (HttpURLConnection) new URL(apiUrl).openConnection();
            conn.setRequestMethod("GET");

            int responseCode = conn.getResponseCode();
            if (responseCode == 200) {
                BufferedReader in = new BufferedReader(new InputStreamReader(conn.getInputStream()));
                StringBuilder response = new StringBuilder();
                String line;
                while ((line = in.readLine()) != null)
                    response.append(line);
                in.close();

                JSONObject json = new JSONObject(response.toString());
                JSONArray hits = json.getJSONArray("hits");
                if (hits.length() > 0) {
                    return hits.getJSONObject(0).getString("largeImageURL");
                }
            }
        } catch (Exception e) {
            System.out.println("Pixabay API failed: " + e.getMessage());
        }

        // 2️⃣ Fallback to hardcoded URLs
        return switch (city.toLowerCase()) {
            case "seoul" ->
                "https://images.unsplash.com/photo-1582076856765-7f9b1dbb88e0?auto=format&fit=crop&w=800&q=60";
            case "taipei" ->
                "https://images.unsplash.com/photo-1605902711622-cfb43c4437f2?auto=format&fit=crop&w=800&q=60";
            case "hong kong" ->
                "https://images.unsplash.com/photo-1579338553723-9642f109b8de?auto=format&fit=crop&w=800&q=60";
            case "miami" ->
                "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=60";
            case "malibu" ->
                "https://images.unsplash.com/photo-1493558103817-58b2924bce98?auto=format&fit=crop&w=800&q=60";
            case "singapore" ->
                "https://images.unsplash.com/photo-1501621965065-c6e1cf6b53e2?auto=format&fit=crop&w=800&q=60";
            case "bali" ->
                "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=60";
            default -> "https://images.unsplash.com/photo-1493558103817-58b2924bce98?auto=format&fit=crop&w=800&q=60";
        };
    }

}
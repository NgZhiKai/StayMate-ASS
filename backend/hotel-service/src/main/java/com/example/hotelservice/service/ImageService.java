package com.example.hotelservice.service;

import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;
import java.util.Base64;
import java.util.Random;

import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.hotelservice.entity.cityImage.CityImage;
import com.example.hotelservice.repository.CityImageRepository;

@Service
public class ImageService {

    private final CityImageRepository cityImageRepo;
    private final String PIXABAY_API_KEY;

    public ImageService(CityImageRepository repo, @Value("${pixabay.api.key}") String apiKey) {
        this.cityImageRepo = repo;
        this.PIXABAY_API_KEY = apiKey;
    }

    /**
     * Returns cached image bytes or fetches from Pixabay if not cached.
     */
    public byte[] getDestinationImage(String city, String country) {
        if (city == null || city.isBlank()) {
            return fetchDefaultImageBytes();
        }

        return cityImageRepo.findByCity(city)
                .map(CityImage::getImageData)
                .orElseGet(() -> fetchAndSaveImage(city, country));
    }

    /**
     * Returns Base64 string for frontend usage.
     */
    public String getDestinationImageBase64(String city, String country) {
        byte[] imageBytes = getDestinationImage(city, country);
        return "data:image/jpeg;base64," + Base64.getEncoder().encodeToString(imageBytes);
    }

    /**
     * Fetches image from Pixabay and saves to DB in a separate transaction.
     */
    private byte[] fetchAndSaveImage(String city, String country) {
        byte[] data = fetchImageBytes(city, country);

        if (data == null || data.length == 0) {
            data = fetchDefaultImageBytes();
        }

        saveImage(city, country, data); // transactional save

        return data;
    }

    /**
     * Save image data to DB in a transactional context.
     */
    @Transactional
    protected void saveImage(String city, String country, byte[] data) {
        CityImage entry = new CityImage();
        entry.setCity(city);
        entry.setCountry(country);
        entry.setImageData(data);
        cityImageRepo.save(entry);
    }

    /**
     * Fetch image from Pixabay API.
     */
    private byte[] fetchImageBytes(String city, String country) {
        try {
            String query = city + " skyline " + country + " landmark";
            String apiUrl = "https://pixabay.com/api/?key=" + PIXABAY_API_KEY
                    + "&q=" + URLEncoder.encode(query, "UTF-8")
                    + "&image_type=photo&orientation=horizontal&category=places&per_page=5";

            HttpURLConnection conn = (HttpURLConnection) new URL(apiUrl).openConnection();
            conn.setRequestMethod("GET");
            conn.setConnectTimeout(5000);
            conn.setReadTimeout(5000);

            if (conn.getResponseCode() == 200) {
                try (BufferedReader in = new BufferedReader(new InputStreamReader(conn.getInputStream()))) {
                    StringBuilder response = new StringBuilder();
                    String line;
                    while ((line = in.readLine()) != null)
                        response.append(line);

                    JSONObject json = new JSONObject(response.toString());
                    JSONArray hits = json.optJSONArray("hits");
                    if (hits != null && hits.length() > 0) {
                        int randomIndex = new Random().nextInt(hits.length());
                        String imageUrl = hits.getJSONObject(randomIndex).optString("largeImageURL");
                        return downloadImageBytes(imageUrl);
                    }
                }
            }
        } catch (Exception e) {
            System.out.println("Pixabay fetch failed: " + e.getMessage());
        }

        return null;
    }

    /**
     * Downloads raw bytes from a URL.
     */
    private byte[] downloadImageBytes(String urlStr) {
        try (InputStream in = new URL(urlStr).openStream()) {
            return in.readAllBytes();
        } catch (Exception e) {
            return null;
        }
    }

    /**
     * Default fallback image.
     */
    private byte[] fetchDefaultImageBytes() {
        return downloadImageBytes(
                "https://images.unsplash.com/photo-1493558103817-58b2924bce98?auto=format&fit=crop&w=1200&q=80");
    }
}
package com.example.bookingservice.client;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.RestTemplate;

final class ClientCallSupport {
    private ClientCallSupport() {
    }

    static String buildUrl(String baseUrl, String pathTemplate, Object... pathArgs) {
        String endpoint = pathArgs.length == 0
                ? pathTemplate
                : String.format(pathTemplate, pathArgs);
        return String.format("%s%s", baseUrl, endpoint);
    }

    static <T> T exchangeForBody(
            RestTemplate restTemplate,
            String url,
            HttpMethod method,
            HttpEntity<?> request,
            Class<T> responseType,
            T fallback) {
        try {
            ResponseEntity<T> response = restTemplate.exchange(url, method, request, responseType);
            T body = response.getBody();
            return body != null ? body : fallback;
        } catch (Exception ex) {
            return fallback;
        }
    }
}

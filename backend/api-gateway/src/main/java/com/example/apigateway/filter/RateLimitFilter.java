package com.example.apigateway.filter;

import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.Ordered;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.server.ServerWebExchange;

import com.example.apigateway.config.RateLimitProperties;

import reactor.core.publisher.Mono;

@Component
public class RateLimitFilter implements GlobalFilter, Ordered {
    private final Map<String, TokenBucket> buckets = new ConcurrentHashMap<>();
    private final RateLimitProperties rateLimitProperties;

    public RateLimitFilter(RateLimitProperties rateLimitProperties) {
        this.rateLimitProperties = rateLimitProperties;
    }

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        if (!rateLimitProperties.isEnabled()) {
            return chain.filter(exchange);
        }

        String key = resolveClientKey(exchange.getRequest());
        TokenBucket bucket = buckets.computeIfAbsent(
                key,
                ignored -> new TokenBucket(rateLimitProperties.getBurstCapacity()));

        boolean allowed = bucket.tryConsume(1, rateLimitProperties);
        if (allowed) {
            return chain.filter(exchange);
        }

        exchange.getResponse().setStatusCode(HttpStatus.TOO_MANY_REQUESTS);
        exchange.getResponse().getHeaders().setContentType(MediaType.APPLICATION_JSON);
        exchange.getResponse().getHeaders().set("Retry-After", "1");
        byte[] body = "{\"error\":\"Too Many Requests\"}".getBytes(StandardCharsets.UTF_8);
        return exchange.getResponse().writeWith(Mono.just(exchange.getResponse()
                .bufferFactory()
                .wrap(body)));
    }

    @Override
    public int getOrder() {
        return -190;
    }

    private String resolveClientKey(ServerHttpRequest request) {
        String forwardedFor = request.getHeaders().getFirst("X-Forwarded-For");
        if (StringUtils.hasText(forwardedFor)) {
            int commaIndex = forwardedFor.indexOf(',');
            if (commaIndex > 0) {
                return forwardedFor.substring(0, commaIndex).trim();
            }
            return forwardedFor.trim();
        }

        if (request.getRemoteAddress() != null && request.getRemoteAddress().getAddress() != null) {
            return request.getRemoteAddress().getAddress().getHostAddress();
        }
        return "unknown-client";
    }

    private static final class TokenBucket {
        private final int capacity;
        private double tokens;
        private long lastRefillNanos;

        private TokenBucket(int capacity) {
            this.capacity = capacity;
            this.tokens = capacity;
            this.lastRefillNanos = System.nanoTime();
        }

        private synchronized boolean tryConsume(int requestedTokens, RateLimitProperties properties) {
            refill(properties);
            if (tokens < requestedTokens) {
                return false;
            }
            tokens -= requestedTokens;
            return true;
        }

        private void refill(RateLimitProperties properties) {
            long now = System.nanoTime();
            long elapsedNanos = now - lastRefillNanos;
            if (elapsedNanos <= 0) {
                return;
            }

            double elapsedSeconds = Duration.ofNanos(elapsedNanos).toNanos() / 1_000_000_000.0;
            double refillRatePerSecond = (double) properties.getReplenishTokens()
                    / Math.max(properties.getWindowSeconds(), 1);
            double refillAmount = elapsedSeconds * refillRatePerSecond;

            if (refillAmount > 0) {
                tokens = Math.min(capacity, tokens + refillAmount);
                lastRefillNanos = now;
            }
        }
    }
}

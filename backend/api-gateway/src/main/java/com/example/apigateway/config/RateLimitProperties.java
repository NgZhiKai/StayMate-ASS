package com.example.apigateway.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Component
@ConfigurationProperties(prefix = "gateway.rate-limit")
public class RateLimitProperties {
    private boolean enabled = true;
    private int replenishTokens = 60;
    private int burstCapacity = 120;
    private int windowSeconds = 60;

    public boolean isEnabled() {
        return enabled;
    }

    public void setEnabled(boolean enabled) {
        this.enabled = enabled;
    }

    public int getReplenishTokens() {
        return replenishTokens;
    }

    public void setReplenishTokens(int replenishTokens) {
        this.replenishTokens = replenishTokens;
    }

    public int getBurstCapacity() {
        return burstCapacity;
    }

    public void setBurstCapacity(int burstCapacity) {
        this.burstCapacity = burstCapacity;
    }

    public int getWindowSeconds() {
        return windowSeconds;
    }

    public void setWindowSeconds(int windowSeconds) {
        this.windowSeconds = windowSeconds;
    }
}

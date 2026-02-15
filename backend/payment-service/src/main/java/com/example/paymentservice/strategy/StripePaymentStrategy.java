package com.example.paymentservice.strategy;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class StripePaymentStrategy implements PaymentStrategy {

    private static final Logger logger = LoggerFactory.getLogger(StripePaymentStrategy.class);

    @Override
    public boolean processPayment(double amount) {
        logger.info("Processing Stripe payment of ${}", amount);
        return amount > 0;
    }
}
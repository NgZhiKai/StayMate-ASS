package com.example.paymentservice.strategy;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class PaypalPaymentStrategy implements PaymentStrategy {

    private static final Logger logger = LoggerFactory.getLogger(PaypalPaymentStrategy.class);

    @Override
    public boolean processPayment(double amount) {
        logger.info("Processing PayPal payment of ${}", amount);
        return amount > 0;
    }
}
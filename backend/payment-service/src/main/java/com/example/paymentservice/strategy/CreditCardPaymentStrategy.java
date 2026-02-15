package com.example.paymentservice.strategy;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class CreditCardPaymentStrategy implements PaymentStrategy {

    private static final Logger logger = LoggerFactory.getLogger(CreditCardPaymentStrategy.class);

    @Override
    public boolean processPayment(double amount) {
        logger.info("Processing Credit Card payment of ${}", amount);
        return amount > 0;
    }
}
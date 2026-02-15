package com.example.paymentservice.strategy;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class PaymentContext {

    private static final Logger logger = LoggerFactory.getLogger(PaymentContext.class);

    private PaymentStrategy paymentStrategy;

    // Constructor injection (optional)
    public PaymentContext() {
    }

    public PaymentContext(PaymentStrategy paymentStrategy) {
        this.paymentStrategy = paymentStrategy;
    }

    // Set the strategy dynamically
    public void setPaymentStrategy(PaymentStrategy paymentStrategy) {
        this.paymentStrategy = paymentStrategy;
    }

    // Execute the payment
    public boolean executePayment(double amount) {
        if (paymentStrategy != null) {
            logger.info("Executing payment of ${}", amount);
            return paymentStrategy.processPayment(amount);
        } else {
            throw new IllegalStateException("Payment method not set");
        }
    }
}
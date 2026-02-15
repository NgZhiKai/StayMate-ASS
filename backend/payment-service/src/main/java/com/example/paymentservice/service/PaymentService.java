package com.example.paymentservice.service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import com.example.paymentservice.client.BookingClient;
import com.example.paymentservice.client.NotificationClient;
import com.example.paymentservice.repository.PaymentRepository;
import com.example.paymentservice.entity.PaymentMethod;
import com.example.paymentservice.entity.PaymentStatus;
import com.example.paymentservice.entity.Payment;
import com.example.paymentservice.strategy.CreditCardPaymentStrategy;
import com.example.paymentservice.strategy.PaypalPaymentStrategy;
import com.example.paymentservice.strategy.StripePaymentStrategy;
import com.example.paymentservice.strategy.PaymentContext;
import com.example.paymentservice.dto.booking.BookingDTO;
import com.example.paymentservice.dto.booking.UserBookingDTO;

@Service
public class PaymentService {

    private static final Logger logger = LoggerFactory.getLogger(PaymentService.class);

    private final PaymentRepository paymentRepository;
    private final BookingClient bookingClient;
    private final NotificationClient notificationClient;

    public PaymentService(PaymentRepository paymentRepository,
            BookingClient bookingClient,
            NotificationClient notificationClient) {
        this.paymentRepository = paymentRepository;
        this.bookingClient = bookingClient;
        this.notificationClient = notificationClient;
    }

    /**
     * Creates and processes a payment.
     * Updates booking status via BookingClient and sends notification.
     */
    public Payment createAndProcessPayment(Long bookingId, PaymentMethod paymentMethod, double amount) {
        if (amount <= 0)
            throw new IllegalArgumentException("Payment amount must be greater than zero.");

        // Fetch booking DTO via client
        BookingDTO booking = bookingClient.getBookingById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found with ID: " + bookingId));

        // Check remaining amount
        double totalPaid = getTotalPaidAmount(bookingId);
        double remainingAmount = booking.getTotalAmount() - totalPaid;
        if (amount > remainingAmount) {
            throw new IllegalArgumentException(
                    "Payment exceeds remaining balance. Remaining amount: " + remainingAmount);
        }

        // 1. Create payment (PENDING)
        Payment payment = new Payment();
        payment.setBookingId(booking.getId());
        payment.setPaymentMethod(paymentMethod);
        payment.setAmount(amount);
        payment.setTransactionDate(LocalDateTime.now());
        payment.setStatus(PaymentStatus.PENDING);
        payment = paymentRepository.save(payment);

        logger.info("Created payment {} for booking {} with amount ${}", payment.getId(), bookingId, amount);

        // 2. Process payment via strategy
        processPayment(payment.getId(), paymentMethod);

        // 3. Update booking status to CONFIRMED if fully paid
        double updatedTotalPaid = totalPaid + amount;
        if (updatedTotalPaid >= booking.getTotalAmount()) {
            bookingClient.updateBookingStatus(booking.getId(), "CONFIRMED");
            logger.info("Booking {} fully paid. Status update requested via BookingClient.", booking.getId());
        }

        return getPaymentById(payment.getId());
    }

    /**
     * Process a payment using strategy pattern and send notification
     */
    public void processPayment(Long paymentId, PaymentMethod paymentMethod) {
        Payment payment = getPaymentById(paymentId);

        if (payment.getStatus() == PaymentStatus.SUCCESS) {
            throw new IllegalStateException("Payment has already been successfully processed.");
        }

        PaymentContext context = new PaymentContext();
        switch (paymentMethod) {
            case CREDIT_CARD -> context.setPaymentStrategy(new CreditCardPaymentStrategy());
            case PAYPAL -> context.setPaymentStrategy(new PaypalPaymentStrategy());
            case STRIPE -> context.setPaymentStrategy(new StripePaymentStrategy());
            default -> throw new IllegalArgumentException("Unsupported payment method: " + paymentMethod);
        }

        boolean success = context.executePayment(payment.getAmount());
        payment.setStatus(success ? PaymentStatus.SUCCESS : PaymentStatus.FAILED);
        paymentRepository.save(payment);
        logger.info("Payment {} processed with status: {}", paymentId, payment.getStatus());

        // Send notification using BookingDTO
        BookingDTO booking = bookingClient.getBookingById(payment.getBookingId())
                .orElseThrow(() -> new RuntimeException("Booking not found with ID: " + payment.getBookingId()));

        notificationClient.sendNotification(
                booking.getUserId(),
                "Your payment of $" + payment.getAmount() + " was " + payment.getStatus());
        logger.info("Notification sent for payment {}", paymentId);
    }

    // -------------------- Read Methods --------------------

    public Payment getPaymentById(Long id) {
        if (id == null)
            throw new IllegalArgumentException("Payment ID must not be null.");
        return paymentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Payment not found with ID: " + id));
    }

    public List<Payment> getPaymentsByBookingId(Long bookingId) {
        if (bookingId == null)
            throw new IllegalArgumentException("Booking ID must not be null.");
        return paymentRepository.findByBookingId(bookingId);
    }

    public List<Payment> getPaymentsByUserId(Long userId) {
        if (userId == null)
            throw new IllegalArgumentException("User ID must not be null.");
        List<UserBookingDTO> bookings = bookingClient.getBookingsByUserId(userId);
        List<Payment> payments = new ArrayList<>();
        for (UserBookingDTO booking : bookings) {
            payments.addAll(paymentRepository.findByBookingId(booking.getBookingId()));
        }
        return payments;
    }

    public double getTotalPaidAmount(Long bookingId) {
        return paymentRepository.findTotalPaidAmountByBookingId(bookingId).orElse(0.0);
    }

    public List<Payment> getAllPayments() {
        return paymentRepository.findAll();
    }
}
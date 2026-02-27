package com.example.paymentservice.service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import com.example.paymentservice.client.BookingClient;
import com.example.paymentservice.client.NotificationClient;
import com.example.paymentservice.dto.booking.BookingDTO;
import com.example.paymentservice.dto.booking.UserBookingDTO;
import com.example.paymentservice.entity.Payment;
import com.example.paymentservice.entity.PaymentMethod;
import com.example.paymentservice.entity.PaymentStatus;
import com.example.paymentservice.repository.PaymentRepository;
import com.example.paymentservice.strategy.CreditCardPaymentStrategy;
import com.example.paymentservice.strategy.PaymentContext;
import com.example.paymentservice.strategy.PaymentStrategy;
import com.example.paymentservice.strategy.PaypalPaymentStrategy;
import com.example.paymentservice.strategy.StripePaymentStrategy;

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
     */
    public Payment createAndProcessPayment(Long bookingId, PaymentMethod paymentMethod, double amount) {
        validateAmount(amount);

        BookingDTO booking = fetchBooking(bookingId);

        validatePaymentAmount(booking, amount);

        Payment payment = createPayment(booking, paymentMethod, amount);

        processPayment(payment.getId(), paymentMethod);

        updateBookingIfFullyPaid(booking, amount);

        return getPaymentById(payment.getId());
    }

    /**
     * Process payment using Strategy pattern and notify user
     */
    public void processPayment(Long paymentId, PaymentMethod paymentMethod) {
        Payment payment = getPaymentById(paymentId);

        if (payment.getStatus() == PaymentStatus.SUCCESS) {
            throw new IllegalStateException("Payment has already been successfully processed.");
        }

        PaymentContext context = new PaymentContext();
        context.setPaymentStrategy(getStrategy(paymentMethod));

        boolean success = context.executePayment(payment.getAmount());
        payment.setStatus(success ? PaymentStatus.SUCCESS : PaymentStatus.FAILED);
        paymentRepository.save(payment);

        logger.info("Payment {} processed with status: {}", paymentId, payment.getStatus());

        sendNotification(payment);
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

    // -------------------- Helper Methods --------------------

    private void validateAmount(double amount) {
        if (amount <= 0)
            throw new IllegalArgumentException("Payment amount must be greater than zero.");
    }

    private BookingDTO fetchBooking(Long bookingId) {
        return bookingClient.getBookingById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found with ID: " + bookingId));
    }

    private void validatePaymentAmount(BookingDTO booking, double amount) {
        Double totalAmount = booking.getTotalAmount();
        if (totalAmount == null) {
            throw new IllegalStateException("Booking total amount is missing for booking ID: " + booking.getId());
        }

        double remaining = totalAmount - getTotalPaidAmount(booking.getId());
        if (amount > remaining) {
            throw new IllegalArgumentException("Payment exceeds remaining balance. Remaining amount: " + remaining);
        }
    }

    private Payment createPayment(BookingDTO booking, PaymentMethod method, double amount) {
        Payment payment = new Payment();
        payment.setBookingId(booking.getId());
        payment.setPaymentMethod(method);
        payment.setAmount(amount);
        payment.setTransactionDate(LocalDateTime.now());
        payment.setStatus(PaymentStatus.PENDING);

        payment = paymentRepository.save(payment);
        logger.info("Created payment {} for booking {} with amount ${}", payment.getId(), booking.getId(), amount);

        return payment;
    }

    private void updateBookingIfFullyPaid(BookingDTO booking, double amount) {
        Double totalAmount = booking.getTotalAmount();
        if (totalAmount == null) return;

        double updatedTotalPaid = getTotalPaidAmount(booking.getId()) + amount;
        if (updatedTotalPaid >= totalAmount) {
            bookingClient.updateBookingStatus(booking.getId(), "CONFIRMED");
            logger.info("Booking {} fully paid. Status update requested via BookingClient.", booking.getId());
        }
    }

    private void sendNotification(Payment payment) {
        BookingDTO booking = fetchBooking(payment.getBookingId());
        notificationClient.sendNotification(
                booking.getUserId(),
                "Your payment of $" + payment.getAmount() + " was " + payment.getStatus());
        logger.info("Notification sent for payment {}", payment.getId());
    }

    private PaymentStrategy getStrategy(PaymentMethod method) {
        return switch (method) {
            case CREDIT_CARD -> new CreditCardPaymentStrategy();
            case PAYPAL -> new PaypalPaymentStrategy();
            case STRIPE -> new StripePaymentStrategy();
            default -> throw new IllegalArgumentException("Unsupported payment method: " + method);
        };
    }
}
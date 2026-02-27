package com.example.paymentservice.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.paymentservice.dto.custom.CustomResponse;
import com.example.paymentservice.dto.payment.PaymentIdResponseDTO;
import com.example.paymentservice.dto.payment.PaymentRequestDTO;
import com.example.paymentservice.entity.Payment;
import com.example.paymentservice.entity.PaymentMethod;
import com.example.paymentservice.service.PaymentService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;

@RestController
@RequestMapping("/payments")
public class PaymentController {

    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    /**
     * Create and process a new payment
     */
    @Operation(summary = "Create and process a new payment")
    @PostMapping
    public ResponseEntity<CustomResponse<String>> createAndProcessPayment(
            @Parameter(description = "Payment details") @RequestBody PaymentRequestDTO paymentRequestDTO,
            @RequestParam PaymentMethod paymentMethod) {

        Payment payment = paymentService.createAndProcessPayment(
                paymentRequestDTO.getBookingId(),
                paymentMethod,
                paymentRequestDTO.getAmount());

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new CustomResponse<>(
                        "Payment processed successfully. Status: " + payment.getStatus(),
                        null));
    }

    /**
     * Get payment by ID
     */
    @Operation(summary = "Get payment by ID")
    @GetMapping("/{id}")
    public ResponseEntity<CustomResponse<PaymentIdResponseDTO>> getPaymentById(@PathVariable Long id) {
        Payment payment = paymentService.getPaymentById(id);
        return ResponseEntity.ok(
                new CustomResponse<>("Payment retrieved successfully",
                        new PaymentIdResponseDTO(payment)));
    }

    /**
     * Get payments by booking ID
     */
    @Operation(summary = "Get payments by booking ID")
    @GetMapping("/booking/{bookingId}")
    public ResponseEntity<CustomResponse<List<PaymentIdResponseDTO>>> getPaymentsByBookingId(
            @PathVariable Long bookingId) {
        return buildPaymentListResponse(paymentService.getPaymentsByBookingId(bookingId));
    }

    /**
     * Get payments by user ID
     */
    @Operation(summary = "Get payments by user ID")
    @GetMapping("/user/{userId}")
    public ResponseEntity<CustomResponse<List<PaymentIdResponseDTO>>> getPaymentsByUserId(
            @PathVariable Long userId) {
        return buildPaymentListResponse(paymentService.getPaymentsByUserId(userId));
    }

    /**
     * Get all payments
     */
    @Operation(summary = "Get all payments")
    @GetMapping
    public ResponseEntity<CustomResponse<List<PaymentIdResponseDTO>>> getAllPayments() {
        return buildPaymentListResponse(paymentService.getAllPayments());
    }

    // ------------------- Helper methods -------------------

    private ResponseEntity<CustomResponse<List<PaymentIdResponseDTO>>> buildPaymentListResponse(
            List<Payment> payments) {
        List<PaymentIdResponseDTO> paymentDTOs = payments.stream()
                .map(PaymentIdResponseDTO::new)
                .toList();
        return ResponseEntity.ok(new CustomResponse<>("Payments retrieved successfully", paymentDTOs));
    }
}
package com.example.paymentservice.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

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

    @Operation(summary = "Create and process a new payment")
    @PostMapping
    public ResponseEntity<CustomResponse<String>> createAndProcessPayment(
            @Parameter(description = "Payment details") @RequestBody PaymentRequestDTO paymentRequestDTO,
            @RequestParam PaymentMethod paymentMethod) {

        Long bookingId = paymentRequestDTO.getBookingId();
        double paymentAmount = paymentRequestDTO.getAmount();

        // PaymentService handles all booking-related checks via BookingClient
        try {
            Payment payment = paymentService.createAndProcessPayment(bookingId, paymentMethod, paymentAmount);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(new CustomResponse<>("Payment processed successfully. Status: " +
                            payment.getStatus(), null));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new CustomResponse<>(e.getMessage(), null));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new CustomResponse<>(e.getMessage(), null));
        }
    }

    @Operation(summary = "Get payment by ID")
    @GetMapping("/{id}")
    public ResponseEntity<CustomResponse<PaymentIdResponseDTO>> getPaymentById(@PathVariable Long id) {
        Payment payment = paymentService.getPaymentById(id);
        return ResponseEntity.ok(new CustomResponse<>("Payment retrieved successfully",
                new PaymentIdResponseDTO(payment)));
    }

    @Operation(summary = "Get payments by booking ID")
    @GetMapping("/booking/{bookingId}")
    public ResponseEntity<CustomResponse<List<PaymentIdResponseDTO>>> getPaymentsByBookingId(
            @PathVariable Long bookingId) {

        List<PaymentIdResponseDTO> payments = paymentService.getPaymentsByBookingId(bookingId)
                .stream()
                .map(PaymentIdResponseDTO::new)
                .toList();

        return ResponseEntity.ok(new CustomResponse<>("Payments retrieved successfully", payments));
    }

    @Operation(summary = "Get payments by user ID")
    @GetMapping("/user/{userId}")
    public ResponseEntity<CustomResponse<List<PaymentIdResponseDTO>>> getPaymentsByUserId(
            @PathVariable Long userId) {

        List<PaymentIdResponseDTO> payments = paymentService.getPaymentsByUserId(userId)
                .stream()
                .map(PaymentIdResponseDTO::new)
                .toList();

        return ResponseEntity.ok(new CustomResponse<>("Payments retrieved successfully", payments));
    }

    @Operation(summary = "Get all payments")
    @GetMapping
    public ResponseEntity<CustomResponse<List<PaymentIdResponseDTO>>> getAllPayments() {

        List<PaymentIdResponseDTO> payments = paymentService.getAllPayments()
                .stream()
                .map(PaymentIdResponseDTO::new)
                .toList();

        return ResponseEntity.ok(new CustomResponse<>("Payments retrieved successfully", payments));
    }
}
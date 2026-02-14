package com.example.bookingservice.service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.bookingservice.entity.booking.Booking;
import com.example.bookingservice.BookingStatus;
import com.example.bookingservice.NotificationType;
import com.example.bookingservice.observer.NotificationObserver;
import com.example.bookingservice.observer.Observer;
import com.example.bookingservice.observer.Subject;
import com.example.bookingservice.repository.BookingRepository;

@Service
public class BookingService implements Subject {

    private final BookingRepository bookingRepository;
    private final List<Observer> observers = new ArrayList<>();

    @Autowired
    public BookingService(BookingRepository bookingRepository) {
        this.bookingRepository = bookingRepository;
    }

    @Override
    public void addObserver(Observer observer) {
        observers.add(observer);
    }

    @Override
    public void removeObserver(Observer observer) {
        observers.remove(observer);
    }

    @Override
    public void notifyObservers(Map<String, Object> data) {
        for (Observer observer : observers) {
            observer.update(data);
        }
    }

    public void notifyObservers(NotificationType type, Long userId, String message) {
        Map<String, Object> data = new HashMap<>();
        data.put("type", type);
        data.put("userId", userId);
        data.put("message", message);
        data.put("createdAt", LocalDateTime.now());
        notifyObservers(data);
    }

    @Autowired
    public void setNotificationObserver(NotificationObserver notificationObserver) {
        addObserver(notificationObserver);
    }

    // Create a new booking
    public Booking createBooking(Booking booking) {
        booking.setStatus(BookingStatus.PENDING);
        Booking savedBooking = bookingRepository.save(booking);

        notifyObservers(NotificationType.BOOKING, booking.getUserId(), 
                "Your booking is pending confirmation.");

        return savedBooking;
    }

    // Update booking status
    @Transactional
    public Booking updateBooking(Booking booking) {
        Booking updatedBooking = bookingRepository.save(booking);

        String message = switch (booking.getStatus()) {
            case CONFIRMED -> "Your booking has been confirmed!";
            case CANCELLED -> "Your booking has been canceled.";
            default -> "Your booking status has been updated.";
        };

        notifyObservers(NotificationType.BOOKING, booking.getUserId(), message);

        return updatedBooking;
    }

    // Cancel a booking
    @Transactional
    public Booking cancelBooking(Long id) {
        Booking booking = getBookingById(id);
        if (booking != null) {
            booking.setStatus(BookingStatus.CANCELLED);
            Booking canceledBooking = bookingRepository.save(booking);

            // Here you would call RoomService to mark room as available
            // e.g., roomService.markRoomAvailable(booking.getHotelId(), booking.getRoomId());

            notifyObservers(NotificationType.BOOKING, booking.getUserId(), 
                    "Your booking has been canceled.");

            return canceledBooking;
        }
        return null;
    }

    public Booking getBookingById(Long id) {
        return bookingRepository.findById(id).orElse(null);
    }

    public List<Booking> getBookingsByHotel(Long hotelId) {
        return bookingRepository.findByHotelId(hotelId);
    }

    public List<Booking> getBookingsByUser(Long userId) {
        return bookingRepository.findByUserId(userId);
    }

    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }
}
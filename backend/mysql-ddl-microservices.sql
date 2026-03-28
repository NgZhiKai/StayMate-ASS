-- StayMate backend microservices MySQL DDL
-- Generated from current entities in user/hotel/booking/payment/notification services
-- MySQL 8+

-- Optional: create shared DB user used by dev profile
-- Requires admin privileges
CREATE USER IF NOT EXISTS 'staymate_user'@'localhost' IDENTIFIED BY 'password';
CREATE USER IF NOT EXISTS 'staymate_user'@'%' IDENTIFIED BY 'password';

CREATE DATABASE IF NOT EXISTS StayMate_User CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE DATABASE IF NOT EXISTS StayMate_Hotel CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE DATABASE IF NOT EXISTS StayMate_Booking CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE DATABASE IF NOT EXISTS StayMate_Notification CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE DATABASE IF NOT EXISTS StayMate_Payment CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

GRANT ALL PRIVILEGES ON StayMate_User.* TO 'staymate_user'@'localhost';
GRANT ALL PRIVILEGES ON StayMate_Hotel.* TO 'staymate_user'@'localhost';
GRANT ALL PRIVILEGES ON StayMate_Booking.* TO 'staymate_user'@'localhost';
GRANT ALL PRIVILEGES ON StayMate_Notification.* TO 'staymate_user'@'localhost';
GRANT ALL PRIVILEGES ON StayMate_Payment.* TO 'staymate_user'@'localhost';
GRANT ALL PRIVILEGES ON StayMate_User.* TO 'staymate_user'@'%';
GRANT ALL PRIVILEGES ON StayMate_Hotel.* TO 'staymate_user'@'%';
GRANT ALL PRIVILEGES ON StayMate_Booking.* TO 'staymate_user'@'%';
GRANT ALL PRIVILEGES ON StayMate_Notification.* TO 'staymate_user'@'%';
GRANT ALL PRIVILEGES ON StayMate_Payment.* TO 'staymate_user'@'%';
FLUSH PRIVILEGES;

-- ============================================================
-- StayMate_User (user-service)
-- ============================================================
USE StayMate_User;

CREATE TABLE IF NOT EXISTS users (
    id BIGINT NOT NULL AUTO_INCREMENT,
    first_name VARCHAR(255) DEFAULT NULL,
    last_name VARCHAR(255) DEFAULT NULL,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) DEFAULT NULL,
    phone_number VARCHAR(255) DEFAULT NULL,
    role ENUM('CUSTOMER','ADMIN') NOT NULL,
    verification_token VARCHAR(255) DEFAULT NULL,
    verified BIT(1) NOT NULL DEFAULT b'0',
    is_deleted BIT(1) NOT NULL DEFAULT b'0',
    PRIMARY KEY (id),
    UNIQUE KEY uk_users_email (email)
) ENGINE=InnoDB;

-- Sample admin users (password for all accounts: password)
-- BCrypt hash below corresponds to plain text "password"
INSERT IGNORE INTO users
    (id, first_name, last_name, email, password, phone_number, role, verification_token, verified, is_deleted)
VALUES
    (1, 'ZK', 'Ng', 'ngzk123@gmail.com', '$2a$10$Zpvlj7GeTWW75HqOv5tHyuCWOgP97Mms3bjMNouOmRbqv6y.e30Ne', '+65-9000-0001', 'ADMIN', NULL, b'1', b'0'),
    (2, 'Benjamin', 'Lim', 'admin2@staymate.com', '$2a$10$Zpvlj7GeTWW75HqOv5tHyuCWOgP97Mms3bjMNouOmRbqv6y.e30Ne', '+65-9000-0002', 'ADMIN', NULL, b'1', b'0'),
    (3, 'Chloe', 'Ng', 'admin3@staymate.com', '$2a$10$Zpvlj7GeTWW75HqOv5tHyuCWOgP97Mms3bjMNouOmRbqv6y.e30Ne', '+65-9000-0003', 'ADMIN', NULL, b'1', b'0'),
    (4, 'Daniel', 'Ong', 'admin4@staymate.com', '$2a$10$Zpvlj7GeTWW75HqOv5tHyuCWOgP97Mms3bjMNouOmRbqv6y.e30Ne', '+65-9000-0004', 'ADMIN', NULL, b'1', b'0'),
    (5, 'Evelyn', 'Goh', 'admin5@staymate.com', '$2a$10$Zpvlj7GeTWW75HqOv5tHyuCWOgP97Mms3bjMNouOmRbqv6y.e30Ne', '+65-9000-0005', 'ADMIN', NULL, b'1', b'0');

CREATE TABLE IF NOT EXISTS bookmark (
    userid BIGINT NOT NULL,
    hotelid BIGINT NOT NULL,
    PRIMARY KEY (userid, hotelid),
    KEY idx_bookmark_userid (userid),
    KEY idx_bookmark_hotelid (hotelid)
) ENGINE=InnoDB;

-- ============================================================
-- StayMate_Hotel (hotel-service)
-- ============================================================
USE StayMate_Hotel;

CREATE TABLE IF NOT EXISTS hotel (
    id BIGINT NOT NULL AUTO_INCREMENT,
    name VARCHAR(255) DEFAULT NULL,
    address VARCHAR(255) DEFAULT NULL,
    latitude DOUBLE DEFAULT NULL,
    longitude DOUBLE DEFAULT NULL,
    city VARCHAR(255) DEFAULT NULL,
    country VARCHAR(255) DEFAULT NULL,
    image LONGBLOB DEFAULT NULL,
    description TEXT DEFAULT NULL,
    contact VARCHAR(255) DEFAULT NULL,
    check_in TIME DEFAULT NULL,
    check_out TIME DEFAULT NULL,
    PRIMARY KEY (id),
    KEY idx_hotel_city (city),
    KEY idx_hotel_country (country)
) ENGINE=InnoDB;

-- Sample hotels with location and check-in/out variations
INSERT IGNORE INTO hotel
    (id, name, address, latitude, longitude, city, country, image, description, contact, check_in, check_out)
VALUES
    (1, 'Harbor View Hotel', '1 Marina Boulevard', 1.2835, 103.8607, 'Singapore', 'Singapore', NULL, 'City-center business hotel near Marina Bay.', '+65-6123-1001', '15:00:00', '11:00:00'),
    (2, 'Orchard Grove Inn', '28 Orchard Road', 1.3048, 103.8318, 'Singapore', 'Singapore', NULL, 'Family-friendly stay close to Orchard shopping belt.', '+65-6123-1002', '14:00:00', '12:00:00'),
    (3, 'Sentosa Sands Resort', '5 Island Club Way', 1.2494, 103.8303, 'Singapore', 'Singapore', NULL, 'Resort-style property with beachside access.', '+65-6123-1003', '16:00:00', '11:00:00'),
    (4, 'Bugis Boutique Stay', '77 Victoria Street', 1.3007, 103.8556, 'Singapore', 'Singapore', NULL, 'Boutique hotel with compact premium rooms.', '+65-6123-1004', '15:00:00', '10:00:00'),
    (5, 'Riverside Grand', '10 Clarke Quay', 1.2898, 103.8466, 'Singapore', 'Singapore', NULL, 'Upscale riverfront hotel with larger suites.', '+65-6123-1005', '15:00:00', '12:00:00');

CREATE TABLE IF NOT EXISTS room (
    hotel_id BIGINT NOT NULL,
    room_id BIGINT NOT NULL,
    room_type VARCHAR(31) NOT NULL,
    price_per_night DOUBLE DEFAULT NULL,
    max_occupancy INT DEFAULT NULL,
    PRIMARY KEY (hotel_id, room_id),
    KEY idx_room_room_type (room_type),
    CONSTRAINT fk_room_hotel FOREIGN KEY (hotel_id) REFERENCES hotel(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Sample rooms across hotels (single-table inheritance via room_type)
INSERT IGNORE INTO room
    (hotel_id, room_id, room_type, price_per_night, max_occupancy)
VALUES
    (1, 101, 'SINGLE', 120.00, 1),
    (1, 102, 'DOUBLE', 180.00, 2),
    (1, 201, 'SUITE', 320.00, 3),
    (1, 301, 'DELUXE', 260.00, 2),
    (2, 101, 'SINGLE', 105.00, 1),
    (2, 102, 'DOUBLE', 165.00, 2),
    (2, 201, 'DELUXE', 235.00, 2),
    (3, 101, 'DOUBLE', 210.00, 2),
    (3, 201, 'SUITE', 390.00, 4),
    (3, 301, 'DELUXE', 300.00, 3),
    (4, 101, 'SINGLE', 98.00, 1),
    (4, 102, 'DOUBLE', 145.00, 2),
    (5, 101, 'DOUBLE', 220.00, 2),
    (5, 201, 'SUITE', 420.00, 4),
    (5, 301, 'DELUXE', 315.00, 3);

CREATE TABLE IF NOT EXISTS review (
    id BIGINT NOT NULL AUTO_INCREMENT,
    user_id BIGINT DEFAULT NULL,
    hotel_id BIGINT DEFAULT NULL,
    rating INT DEFAULT NULL,
    comment VARCHAR(255) DEFAULT NULL,
    created_at DATETIME(6) DEFAULT NULL,
    PRIMARY KEY (id),
    KEY idx_review_hotel_id (hotel_id),
    KEY idx_review_user_id (user_id),
    CONSTRAINT fk_review_hotel FOREIGN KEY (hotel_id) REFERENCES hotel(id) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS city_images (
    id BIGINT NOT NULL AUTO_INCREMENT,
    city VARCHAR(100) NOT NULL,
    country VARCHAR(100),
    image_data LONGBLOB,
    created_at DATETIME(6) NOT NULL,
    PRIMARY KEY (id),
    UNIQUE KEY uk_city_images_city (city)
) ENGINE=InnoDB;

-- ============================================================
-- StayMate_Booking (booking-service)
-- ============================================================
USE StayMate_Booking;

CREATE TABLE IF NOT EXISTS booking (
    id BIGINT NOT NULL AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    hotel_id BIGINT NOT NULL,
    room_id BIGINT NOT NULL,
    check_in_date DATE NOT NULL,
    check_out_date DATE NOT NULL,
    total_amount DECIMAL(19,2) DEFAULT NULL,
    status ENUM('PENDING','CONFIRMED','CANCELLED') DEFAULT NULL,
    booking_date DATE DEFAULT NULL,
    PRIMARY KEY (id),
    KEY idx_booking_user_id (user_id),
    KEY idx_booking_hotel_room (hotel_id, room_id),
    KEY idx_booking_status (status)
) ENGINE=InnoDB;

-- ============================================================
-- StayMate_Notification (notification-service)
-- ============================================================
USE StayMate_Notification;

CREATE TABLE IF NOT EXISTS notification (
    id BIGINT NOT NULL AUTO_INCREMENT,
    user_id BIGINT DEFAULT NULL,
    message VARCHAR(255) DEFAULT NULL,
    type ENUM('BOOKING','PAYMENT','PROMOTION') NOT NULL,
    is_read BIT(1) NOT NULL,
    created_at DATETIME(6) DEFAULT NULL,
    PRIMARY KEY (id),
    KEY idx_notification_user_id (user_id),
    KEY idx_notification_created_at (created_at)
) ENGINE=InnoDB;

-- ============================================================
-- StayMate_Payment (payment-service)
-- ============================================================
USE StayMate_Payment;

CREATE TABLE IF NOT EXISTS payment (
    id BIGINT NOT NULL AUTO_INCREMENT,
    booking_id BIGINT DEFAULT NULL,
    payment_method ENUM('CREDIT_CARD','PAYPAL','STRIPE') DEFAULT NULL,
    amount DOUBLE NOT NULL,
    transaction_date DATETIME(6) DEFAULT NULL,
    status ENUM('PENDING','SUCCESS','FAILED') DEFAULT NULL,
    PRIMARY KEY (id),
    KEY idx_payment_booking_id (booking_id),
    KEY idx_payment_status (status)
) ENGINE=InnoDB;

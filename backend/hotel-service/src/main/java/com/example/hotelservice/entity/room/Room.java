package com.example.hotelservice.entity.room;

import com.example.hotelservice.entity.hotel.Hotel;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonTypeInfo;
import jakarta.persistence.*;

@Entity
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
@DiscriminatorColumn(name = "room_type", discriminatorType = DiscriminatorType.STRING)
@Table(name = "room")
@JsonTypeInfo(use = JsonTypeInfo.Id.NAME, include = JsonTypeInfo.As.PROPERTY, property = "room_type")
@JsonSubTypes({
        @JsonSubTypes.Type(value = SingleRoom.class, name = "SINGLE"),
        @JsonSubTypes.Type(value = DoubleRoom.class, name = "DOUBLE"),
        @JsonSubTypes.Type(value = SuiteRoom.class, name = "SUITE"),
        @JsonSubTypes.Type(value = DeluxeRoom.class, name = "DELUXE")
})
public abstract class Room {

    @EmbeddedId
    @AttributeOverride(name = "hotelId", column = @Column(name = "hotel_id"))
    @AttributeOverride(name = "roomId", column = @Column(name = "room_id"))
    private RoomId id;

    @Column(name = "price_per_night")
    private double pricePerNight;

    @Column(name = "max_occupancy")
    private int maxOccupancy;

    protected Room() {
    }

    protected Room(Hotel hotel, Long roomId, double pricePerNight, int maxOccupancy) {
        this.id = new RoomId(hotel.getId(), roomId);
        this.pricePerNight = pricePerNight;
        this.maxOccupancy = maxOccupancy;
    }

    // --- Getters & Setters ---
    public RoomId getId() {
        return id;
    }

    public void setId(RoomId id) {
        this.id = id;
    }

    public Long getHotelId() {
        return id != null ? id.getHotelId() : null;
    }

    public Long getRoomId() {
        return id != null ? id.getRoomId() : null;
    }

    public double getPricePerNight() {
        return pricePerNight;
    }

    public void setPricePerNight(double pricePerNight) {
        this.pricePerNight = pricePerNight;
    }

    public int getMaxOccupancy() {
        return maxOccupancy;
    }

    public void setMaxOccupancy(int maxOccupancy) {
        this.maxOccupancy = maxOccupancy;
    }
}
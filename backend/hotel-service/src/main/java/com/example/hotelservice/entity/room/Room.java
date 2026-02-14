package com.example.hotelservice.entity.room;

import com.example.hotelservice.entity.hotel.Hotel;
import com.example.hotelservice.state.roomstate.*;
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

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private RoomStatus status;

    @Transient
    @JsonIgnore
    private RoomState roomState;

    protected Room() {
        setStatus(RoomStatus.AVAILABLE);
    }

    protected Room(Hotel hotel, Long roomId, double pricePerNight, int maxOccupancy) {
        this.id = new RoomId(hotel.getId(), roomId);
        this.pricePerNight = pricePerNight;
        this.maxOccupancy = maxOccupancy;
        setStatus(RoomStatus.AVAILABLE);
    }

    // Ensure state restored after DB operations
    @PostLoad
    @PostPersist
    private void initState() {
        updateState();
    }

    private void updateState() {
        RoomStatus currentStatus = (status == null)
                ? RoomStatus.AVAILABLE
                : status;

        switch (currentStatus) {
            case AVAILABLE -> this.roomState = new AvailableState();
            case BOOKED -> this.roomState = new BookedState();
            case UNDER_MAINTENANCE -> this.roomState = new UnderMaintenanceState();
            default -> throw new IllegalStateException("Unexpected room status: " + currentStatus);
        }
    }

    // --- State Pattern Actions ---
    public void book() {
        getRoomState().book(this);
        updateState();
    }

    public void checkOut() {
        getRoomState().checkOut(this);
        updateState();
    }

    public void markUnderMaintenance() {
        getRoomState().markUnderMaintenance(this);
        updateState();
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

    public RoomStatus getStatus() {
        return status;
    }

    public void setStatus(RoomStatus status) {
        this.status = status;
        updateState(); // keep state synced
    }

    @JsonIgnore
    public RoomState getRoomState() {
        if (roomState == null) {
            updateState();
        }
        return roomState;
    }
}
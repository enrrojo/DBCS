package com.uva.REST_Reservas.Model;

import java.io.Serializable;
import java.time.LocalDate;

import javax.persistence.*;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import com.fasterxml.jackson.annotation.JsonFormat;

@Entity
@Table(name = "reserva")
@NamedQueries({
    @NamedQuery(
        name = "Reserva.findByGuestEmailAndStatus",
        query = "select r.id as id, r.price as price, r.units as units, r.numGuest as numGuest, r.status as status, r.dateIn as dateIn, r.dateOut as dateOut, r.createdAt as createdAt " + 
                "from Reserva r where r.guestEmail=?1 and r.status=?2"
    ),
    @NamedQuery(
        name = "Reserva.findByStatusOrderByCreatedAt",
        query= "select r.id as id, r.price as price, r.units as units, r.numGuest as numGuest, r.status as status, r.dateIn as dateIn, r.dateOut as dateOut, r.createdAt as createdAt, r.guestName as guestName " + 
                "from Reserva r where r.status=?1"
    )
})
public class Reserva implements Serializable{
    @Id
    @GeneratedValue
    @Column(unique = true)
    private int id;
    private String guestName;
    private String guestEmail;
    private double price;
    private int numGuest;
    private int units;
    private ReservaStatus status;
    @JsonFormat(shape=JsonFormat.Shape.STRING, pattern="yyyy-MM-dd")
    private LocalDate dateIn;
    @JsonFormat(shape=JsonFormat.Shape.STRING, pattern="yyyy-MM-dd")
    private LocalDate dateOut;
    @CreationTimestamp
    @Column(name= "created_at",nullable = false, updatable = false)
    private LocalDate createdAt;
    @UpdateTimestamp
    @Column(name="updated_at")
    private LocalDate updatedAt;

    public Reserva(){}

    public Reserva(String guestName, String guestEmail, double price, int numGuest, int units, ReservaStatus status,
            LocalDate dateIn, LocalDate dateOut){
        this.guestName=guestName;
        this.guestEmail=guestEmail;
        this.price=price;
        this.numGuest=numGuest;
        this.units=units;
        this.status=status;
        this.dateIn=dateIn;
        this.dateOut=dateOut;
    }

    public int getId() {
        return id;
    }
    public void setId(int id) {
        this.id = id;
    }
    public String getGuestName() {
        return guestName;
    }
    public void setGuestName(String guestName) {
        this.guestName = guestName;
    }
    public String getGuestEmail() {
        return guestEmail;
    }
    public void setGuestEmail(String guestId) {
        this.guestEmail = guestId;
    }
    public double getPrice() {
        return price;
    }
    public void setPrice(double price) {
        this.price = price;
    }
    public int getNumGuest() {
        return numGuest;
    }

    public void setNumGuest(int numGuest) {
        this.numGuest = numGuest;
    }
    public int getUnits() {
        return units;
    }
    public void setUnits(int units) {
        this.units = units;
    }
    public ReservaStatus getStatus() {
        return status;
    }
    public void setStatus(ReservaStatus status) {
        this.status = status;
    }
    public LocalDate getDateIn() {
        return dateIn;
    }
    public void setDateIn(LocalDate dateIn) {
        this.dateIn = dateIn;
    }
    public LocalDate getDateOut() {
        return dateOut;
    }
    public void setDateOut(LocalDate dateOut) {
        this.dateOut = dateOut;
    }
    public LocalDate getCreatedAt() {
        return createdAt;
    }
    public void setCreatedAt(LocalDate created_at) {
        this.createdAt = created_at;
    }
    public LocalDate getUpdatedAt() {
        return updatedAt;
    }
    public void setUpdatedAt(LocalDate updated_at) {
        this.updatedAt = updated_at;
    }
}
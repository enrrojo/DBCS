package com.uva.REST_Reservas.Payload;

import java.time.LocalDate;

import com.fasterxml.jackson.annotation.JsonFormat;

public class ReservaPayload {
    private int numGuest;
    private int units;
    @JsonFormat(shape=JsonFormat.Shape.STRING, pattern="yyyy-MM-dd")
    private LocalDate dateIn;
    @JsonFormat(shape=JsonFormat.Shape.STRING, pattern="yyyy-MM-dd")
    private LocalDate dateOut;
    
    public int getNumGuest() {
        return numGuest;
    }
    public int getUnits() {
        return units;
    }
    public LocalDate getDateIn() {
        return dateIn;
    }
    public LocalDate getDateOut() {
        return dateOut;
    }
}

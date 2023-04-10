package com.uva.REST_Reservas.Projections;

import java.time.LocalDate;

import com.uva.REST_Reservas.Model.ReservaStatus;

public interface SpecificFields {
    int getId();
    double getPrice();
    int getUnits();
    int getNumGuest();
    ReservaStatus getStatus();
    LocalDate getDateIn();
    LocalDate getDateOut();
    LocalDate getCreatedAt();
    String getGuestName();
}

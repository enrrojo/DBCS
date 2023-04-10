package com.uva.REST_Reservas.Repository;

import com.uva.REST_Reservas.Model.*;
import com.uva.REST_Reservas.Projections.SpecificFields;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface ReservaRepository extends JpaRepository<Reserva, Integer>{

    List<SpecificFields> findByGuestEmailAndStatus(String guestEmail, ReservaStatus status);

    List<SpecificFields> findByStatusOrderByCreatedAt(ReservaStatus status);

    List<Reserva> findByDateOutGreaterThanAndDateInLessThanOrderByDateIn(LocalDate fecha1, LocalDate fecha2);

    List<Reserva> findAllByOrderByDateIn();
}
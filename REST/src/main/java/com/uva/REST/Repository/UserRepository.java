package com.uva.REST.Repository;

import com.uva.REST.Model.User;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Integer>{
    
    //Devuelve usuarios disponibles
    List<User> findByEnabledTrue();
    //Devuelve usuarios no disponibles
    List<User> findByEnabledFalse();

    //devuelve usuario en base a email
    User findByEmail(String email);
}
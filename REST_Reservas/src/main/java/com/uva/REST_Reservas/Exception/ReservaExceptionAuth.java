package com.uva.REST_Reservas.Exception;

import javax.naming.AuthenticationException;

public class ReservaExceptionAuth extends AuthenticationException{
    public ReservaExceptionAuth(String message){
        super(message);
    }
}

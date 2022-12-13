package com.uva.REST_Autentification.Payload;

import javax.validation.constraints.NotBlank;

//Request que se envia para autenticarse 
public class LoginRequest {
    @NotBlank
    private String email;
    @NotBlank
    private String password;

    public String getEmail(){
        return email;
    }

    public String getPassword(){
        return password;
    }
}

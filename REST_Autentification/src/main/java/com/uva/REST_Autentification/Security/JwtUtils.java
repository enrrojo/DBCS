package com.uva.REST_Autentification.Security;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import io.jsonwebtoken.*;

import com.uva.REST_Autentification.Model.*;

@Component
public class JwtUtils {
    
    //Valor secreto con el que se creara el jwt
    @Value("${uva.app.jwtSecret}")
    private String jwtSecret;

    //Tiempo para que expire el jwt
    @Value("${uva.app.jwtExpirationMs}")
    private int jwtExpirationMs;

    //Genera un jwt con los valores del usuario que se le pasa
    public String generateJwtToken(User user) {

        Map<String, Object> claims = new HashMap<String,Object>();
        claims.put("name",user.getName());
        claims.put("email",user.getEmail());
        claims.put("role",user.getRole());

        //Creacion de jwt encriptado con HS512 y valores name, email y role del usuario
        return Jwts.builder().setHeaderParam("alg","HS512").setHeaderParam("typ", "JWT")
                .setClaims(claims)
                .setIssuedAt(new Date())
                .setExpiration(new Date((new Date()).getTime() + jwtExpirationMs))
                .signWith(SignatureAlgorithm.HS512, jwtSecret)
                .compact();
    }
}
package com.uva.REST_Autentification.Controller;

import com.fasterxml.jackson.databind.ObjectMapper;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.uva.REST_Autentification.Payload.*;
import com.uva.REST_Autentification.Model.*;
import com.uva.REST_Autentification.Exception.*;
import com.uva.REST_Autentification.Security.*;

import java.net.HttpURLConnection;
import java.net.URL;
import java.util.Scanner;

@RestController
@RequestMapping("users")
@CrossOrigin(origins = "*")

//Clase controlador de la API de autenticacion
public class AuthController {

    @Autowired
    private JwtUtils jwtUtil;

    //Autentica a un usuario en funcion de su email y contraseña
    @PostMapping(value = "/login", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest){
        try{
            // URL del endPoint que devuelve un usuario en base a su email
            // En nombre de host tambien puede ponerse el nombre del servicio, en este caso: REST
            URL url = new URL("http://host.docker.internal:8080/users?email="+loginRequest.getEmail()); 
            //Envio de la peticion HTTP con la operacion GET
            HttpURLConnection con = (HttpURLConnection)url.openConnection();
            con.setRequestMethod("GET");
            con.connect();

            int responseCode = con.getResponseCode();

            //Se lanza una exception en el caso de haber habido algun error
            if(responseCode!=200){
                throw new UserException("No se pudo realizar la busqueda del usuario");
            }else {

                //Almacenar el cuerpo de la respuesta recibida en informationString
                StringBuilder informationString = new StringBuilder();
                Scanner scanner = new Scanner(url.openStream());

                while (scanner.hasNext()) {
                    informationString.append(scanner.nextLine());
                }

                scanner.close();

                //Si information String esta vacio no existe ningun usuario con ese email
                if(informationString.toString().isEmpty()){
                    return ResponseEntity
                            .status(HttpStatus.FORBIDDEN)
                            .body("No se encontro ningun usuario con el email proporcionado");
                }

                User user = new ObjectMapper().readValue(informationString.toString(), User.class);

                //Conversion de la contraseña a su version encriptada
                //con el algoritmo que se emplea para almacenar las contraseñas encriptadas en la base de datos
                String hashedPassword = HashOperations.getHash(loginRequest.getPassword().getBytes(),"SHA-256");

                //Comprobacion de que la contraseña empleada para autenticarse coincida con la almacenada en la base de datos
                if(!user.getPassword().equals(hashedPassword)){
                    return ResponseEntity
                            .status(HttpStatus.FORBIDDEN)
                            .body("Contraseña incorrecta");
                }else{

                    //Creacion y envio del json web token
                    String token = jwtUtil.generateJwtToken(user);

                    return ResponseEntity
                            .status(HttpStatus.OK)
                            .body(token);
                }
            }

        }catch(Exception e){            
            throw new UserException("No se pudo realizar la autenticacion del usuario");
        }
    }
}

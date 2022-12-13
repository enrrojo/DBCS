package com.uva.REST_Autentification.Security;

import java.security.MessageDigest;
import javax.xml.bind.DatatypeConverter;

public class HashOperations {

    //Encripta los bytes recibidos empleando un algoritmo pasado como argumento
    public static String getHash(byte[] bytes, String algoritmo){
        String hashValue = " ";
        try{
            //Creacion instancia MessageDigest e introdiccion de bytes a encriptar
            MessageDigest messageDigest = MessageDigest.getInstance(algoritmo);
            messageDigest.update(bytes);
            //Encriptacion de los bytes
            byte[] diggestedBytes = messageDigest.digest();
            //Conversion de los bytes encriptados a hexadecimal
            hashValue = DatatypeConverter.printHexBinary(diggestedBytes).toLowerCase();
        }catch(Exception e){}
        return hashValue;
    }
}

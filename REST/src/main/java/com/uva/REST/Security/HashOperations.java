package com.uva.REST.Security;

import java.security.MessageDigest;
import javax.xml.bind.DatatypeConverter;

public class HashOperations {

    //Encripta los bytes recibidos empleando el algoritmo que se le pase como argumento
    public static String getHash(byte[] bytes, String algoritmo){
        String hashValue = " ";
        try{
            //Creacion instancia MessageDigest e introduccion de bytes a encriptar
            MessageDigest messageDigest = MessageDigest.getInstance(algoritmo);
            messageDigest.update(bytes);
            //Encriptacion de los bytes
            byte[] diggestedBytes = messageDigest.digest();
            //Convresion de los bytes encriptados a hexadecimal
            hashValue = DatatypeConverter.printHexBinary(diggestedBytes).toLowerCase();
        }catch(Exception e){}
        return hashValue;
    }
}

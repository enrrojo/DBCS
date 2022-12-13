package com.uva.REST.Controller;

import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.ArrayList;
import java.util.Optional;

import com.uva.REST.Model.*;
import com.uva.REST.Repository.*;
import com.uva.REST.Exception.*;
import com.uva.REST.Security.*;

@RestController
@RequestMapping("users")
@CrossOrigin(origins = "*")

//Clase controlador de la API Rest
public class Requests {
    
    private final UserRepository repositorio;

    Requests(UserRepository repositorio){
        this.repositorio = repositorio;
    }

    //Devuelve una lista con todos los usuarios en la base de datos
    @GetMapping(produces = "application/json")
    public List<User> getUsers(){
        try{
            return repositorio.findAll();
        }catch(Exception e){
            throw new UserException("Fallo al buscar usuarios");
        }
    }

    //Devuelve un usuario en base a un id recibido
    @GetMapping(value = "/{id}",produces = "application/json")
    public Optional<User> getUserPorId( @PathVariable(value = "id",required = true) int identificador){
        try{
            Optional<User> user = repositorio.findById(identificador);
            return user;
        }catch(Exception e){
            throw new UserException("No se pudo encontrar el usuario");
        }
    }

    //Crea un nuevo usuario en la base de datos y devuelve un mensaje de confirmación si ha sdo posible
    //Recibe un valor Json como cuerpo de la peticion
    @PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE)
    public String postUser(@RequestBody User user){
        try{
            String passwordHashed = HashOperations.getHash(user.getPassword().getBytes(),"SHA-256");
            user.setPassword(passwordHashed);
            repositorio.save(user);
            return "Nuevo usuario creado";
        }catch(Exception e){
            throw new UserException("No se pudo crear el usuario");
        }
    }

    //Actualiza los siguientes valores de un usuario en base a su id: firstName, lastName, email, password
    //Recibe un valor Json como cuerpo de la peticion
    @PutMapping(value = "/{id}",consumes=MediaType.APPLICATION_JSON_VALUE, produces = "application/json")
    public User putUserNameEmailPasswordById(@PathVariable(value = "id")int identificador, @RequestBody User user){
        try{
            Optional<User> userOld = repositorio.findById(identificador);
            User userNew = userOld.get();
            if(user.getFirstName()!=null){userNew.setFirstName(user.getFirstName());}
            if(user.getLastName()!=null){userNew.setLastName(user.getLastName());}
            if(user.getEmail()!=null){userNew.setEmail(user.getEmail());}
            if(user.getPassword()!=null){
                String passwordHashed = HashOperations.getHash(user.getPassword().getBytes(),"SHA-256");
                userNew.setPassword(passwordHashed);
            }
            repositorio.save(userNew);
            return userNew;
        }catch(Exception e){
            throw new UserException("No se ha podido modificar el usuario");
        }
    }

    //Elimina un usuario de la base de datos en funcion de un id recibido
    @DeleteMapping("/{id}")
    public String deleteUserById(@PathVariable(value = "id",required = true)int identificador){
        try{
            repositorio.deleteById(identificador);
            return "Usuario con id "+ identificador +" eliminado";
        }catch(Exception e){
            throw new UserException("No se ha podido eliminar al ususario");
        }
    }

    //Devuelve todos los usuarios habilitados/deshabilitados en funcion del valor del parametro enable
    @GetMapping(produces = "application/json", params = "enable")
    public List<User> getUsersByEnabled(@RequestParam(required = true) boolean enable){
        try{
            if(enable){
                return repositorio.findByEnabledTrue();
            }else{
                return repositorio.findByEnabledFalse();
            }
        }catch(Exception e){
            throw new UserException("No se puedieron encontrar los usuarios");
        }
    }

    //Habilita los usuarios cuyos ids reciba como valor al parametro user_id
    @PutMapping(value = "/enable")
    public String putUserEnable(@RequestParam List<Integer> user_id){
        try{
            List<Integer> idsHabilitados = new ArrayList<>();
            for(int i : user_id){
                Optional<User> userOld = repositorio.findById(i);
                User userNew = userOld.get();
                userNew.setEnabled(true);
                repositorio.save(userNew);
                idsHabilitados.add(userNew.getId());
            }
            return "Habilitados ids: "+idsHabilitados;
        }catch(Exception e){
                throw new UserException("No se puedo habilitar usuario");
        }
    }

    //Deshabilita los usuarios cuyos ids reciba como valor al parametro user_id
    @PutMapping(value = "/disable")
    public String putUserDisable(@RequestParam List<Integer> user_id){
        try{
            List<Integer> idsHabilitados = new ArrayList<>();
            for(int i : user_id){
                Optional<User> userOld = repositorio.findById(i);
                User userNew = userOld.get();
                userNew.setEnabled(false);
                repositorio.save(userNew);
                idsHabilitados.add(userNew.getId());
            }
            return "Deshabilitados ids: "+idsHabilitados;
        }catch(Exception e){
                throw new UserException("No se puedo habilitar usuario");
        }
    }

    //Obtiene el usuario con el email pasado como valor al parametro email
    @GetMapping(produces = "application/json", params = "email")
    public User getUserByEmail(@RequestParam String email){
        try{
            return repositorio.findByEmail(email);
        }catch (Exception e){
            throw new UserException("No se pudo realizar la busqueda del usuario");
        }
    }
}

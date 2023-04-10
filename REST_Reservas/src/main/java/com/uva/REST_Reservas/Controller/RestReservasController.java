package com.uva.REST_Reservas.Controller;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.TreeMap;
import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

import com.uva.REST_Reservas.Repository.ReservaRepository;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;

import com.uva.REST_Reservas.Exception.*;
import com.uva.REST_Reservas.Model.*;
import com.uva.REST_Reservas.Payload.ReservaPayload;
import com.uva.REST_Reservas.Payload.UpdatePayload;
import com.uva.REST_Reservas.Projections.SpecificFields;

@RestController
@RequestMapping("book")
@CrossOrigin(origins = "*")

public class RestReservasController {

  //Variable de entorno para el numero de habitaciones con valor por defecto 10
  @Value("${NUMHABITACIONES:10}")
  private int numHabitaciones;

  //Variable de entorno para el coste habitaciones/dia con valor por defecto 40
  @Value("${COSTHABITACIONES:40}")
  private double costHabitaciones;

  private final ReservaRepository repository;

  RestReservasController(ReservaRepository repository){
    this.repository=repository;
  }

  /*
  * Devuelve las habitaciones que quedan disponibles en un rango de fechas proporcionado, siendo este rango superior a la fecha actual
  *
  * Lanza excepcion si la primera fecha es posterior a la segunda o si esta es anterior al dia actual
  */
  @GetMapping("/availability")
  public Map<LocalDate,Integer> getAvailability(@RequestParam(required = true) List<String> fechas){
    LocalDate fecha1 = LocalDate.parse(fechas.get(0));
    LocalDate fecha2 = LocalDate.parse(fechas.get(1));

    if(fecha1.isAfter(fecha2)){
      throw new ReservaExceptionArg("Fechas mal definidas");
    }else if(fecha1.isBefore(LocalDate.now())){
      throw new ReservaExceptionArg("Solo fechas superiores a la actual");
    }

    Map<LocalDate,Integer> map = new HashMap<>();
    List<Reserva> reservas;
    try{
      reservas = repository.findByDateOutGreaterThanAndDateInLessThanOrderByDateIn(fecha1, fecha2);
    }catch(Exception e){
      throw new ReservaException("Error durante la ejecucion");
    }
    if(!reservas.isEmpty()){
      for(Reserva r : reservas){
        map = addDisponibilidad(r,map,fecha1,fecha2);
      }
    }else{
      while(fecha1.isBefore(fecha2)){
        map.put(fecha1, numHabitaciones);
        fecha1=fecha1.plusDays(1);
      }
    }
    map = new TreeMap<LocalDate,Integer>(map);
  
    return map;
  }
 
  /*
  * De ser un guest devuelve todas sus reservas filtradas por estado y con los campos 
  * id,price, unit, numGuest, status, dateIn, dateOut y created_at
  * 
  * De ser un host devuelve todas las reservas filtradas por estado, ordenadas por fecha ascendente y con los campos 
  * id,price, unit, numGuest, status, dateIn, dateOut, created_at y guestName
  */
  @GetMapping(produces = "application/json")
  public Map<ReservaStatus,List<SpecificFields>> getReservas(@RequestHeader(HttpHeaders.AUTHORIZATION) String authorization){

    String jwt = authorization.substring(7);

    Claims claim = Jwts.parser()
       .setSigningKey("uvaSecretKey")
       .parseClaimsJws(jwt)
       .getBody();
 
    Map<ReservaStatus,List<SpecificFields>> map = new HashMap<>();
    List<SpecificFields> lista;
    //Si es guest
    if(claim.get("role").equals("guest")){
      try{
        lista = repository.findByGuestEmailAndStatus(claim.get("email").toString(), ReservaStatus.PENDING);
        map.put(ReservaStatus.PENDING, lista);

        lista = repository.findByGuestEmailAndStatus(claim.get("email").toString(), ReservaStatus.CONFIRMED);
        map.put(ReservaStatus.CONFIRMED, lista);

        lista = repository.findByGuestEmailAndStatus(claim.get("email").toString(), ReservaStatus.CANCELLED);
        map.put(ReservaStatus.CANCELLED, lista);
      }catch(Exception e){
        throw new ReservaException("Error durante la ejecucion");
      }
    //Si es host
    }else if (claim.get("role").equals("host")){
      try{
        lista = repository.findByStatusOrderByCreatedAt(ReservaStatus.PENDING);
        map.put(ReservaStatus.PENDING, lista);

        lista = repository.findByStatusOrderByCreatedAt(ReservaStatus.CONFIRMED);
        map.put(ReservaStatus.CONFIRMED, lista);

        lista = repository.findByStatusOrderByCreatedAt(ReservaStatus.CANCELLED);
        map.put(ReservaStatus.CANCELLED, lista);
      }catch(Exception e){
        throw new ReservaException("Error durante la ejecucion");
      }
    }
    return map;
  }

  /**
  * Devuelve toda la informacion de una reserva en base a un id proporcionado
  * Operacion solo accesible a usuarios host
  */
  @GetMapping(value = "/{id}", produces="application/json")
  public Optional<Reserva> getReserva(@RequestHeader(HttpHeaders.AUTHORIZATION) String authorization,
                            @PathVariable(value = "id") int identificador) throws ReservaExceptionAuth{
    String jwt = authorization.substring(7);

    Claims claim = Jwts.parser()
       .setSigningKey("uvaSecretKey")
       .parseClaimsJws(jwt)
       .getBody();

    if(!claim.get("role").equals("host")){
      throw new ReservaExceptionAuth("Acceso denegado");
    }
    Optional<Reserva> r;
    try{
      r = repository.findById(identificador);
    }catch(Exception e){
      throw new ReservaException("Error durante la ejecucion");
    }
    return r;
  }

  /**
   * Crea una nueva reserva en la base de datos
   * 
   * Hay que pasar en el cuerpo de la peticion los valores numGuest, units, dateIn y dateOut 
   * (guestName y guestEmail van en el JWT y el resto los calcula el sistema)
   * 
   * Lanza excepciones si no es guest, si dateIn es menor al dia actual o mayor a dateOut, si no hay diponibilidad
   * y si units o numGuest < 1
   */
  @PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE)
  public Reserva setReserva(@RequestHeader(HttpHeaders.AUTHORIZATION) String authorization,
                           @RequestBody ReservaPayload payload) throws ReservaExceptionAuth{
    String jwt = authorization.substring(7);

    Claims claim = Jwts.parser()
       .setSigningKey("uvaSecretKey")
       .parseClaimsJws(jwt)
       .getBody();

    if(!claim.get("role").equals("guest")){
      throw new ReservaExceptionAuth("Acceso denegado");
    }
    else if(payload.getUnits()<1 || payload.getNumGuest()<1){
      throw new ReservaExceptionArg("Argumentos invalidos");
    }
    else if(payload.getDateIn().isBefore(LocalDate.now()) || 
              payload.getDateIn().isAfter(payload.getDateOut())){
      throw new ReservaExceptionArg("Fechas mal definidas");
    }
    else if(!comprobarDisponibilidad(payload.getDateIn(), payload.getDateOut(), payload.getUnits())){
      throw new ReservaExceptionArg("Conflicto de disponibilidad de habitaciones");
    }

    Reserva r = new Reserva(claim.get("name").toString(),claim.get("email").toString(),
                            payload.getUnits()*costHabitaciones*(payload.getDateOut().compareTo(payload.getDateIn())),
                            payload.getNumGuest(),payload.getUnits(),ReservaStatus.PENDING,payload.getDateIn(),payload.getDateOut());
    try{
      repository.save(r);
    }catch(Exception e){
      throw new ReservaException("Error durante la ejecucion");
    }

    return r;
  }

  /**
   * Permite modificar el estado de una reserva en base a un id proporcionado
   * Operacion solo accesible a usuarios host
   * Las modificaciones de estado permitidas son:
   *  PENDING->CONFIRMED
   *  PENDING->CANCELLED
   *  CONFIRMED->CANCELLED
   */
  @PutMapping(value = "/{id}", consumes = MediaType.APPLICATION_JSON_VALUE)
  public Reserva updateReserva(@RequestHeader(HttpHeaders.AUTHORIZATION) String authorization,
                              @RequestBody UpdatePayload payload, @PathVariable int id) throws ReservaExceptionAuth{
    String jwt = authorization.substring(7);

    Claims claim = Jwts.parser()
      .setSigningKey("uvaSecretKey")
      .parseClaimsJws(jwt)
      .getBody();
                            
    if(!claim.get("role").equals("host")){
      throw new ReservaExceptionAuth("Acceso denegado");
    }

    Reserva r;
    try{
      r = repository.findById(id).get();
    }catch(Exception e){
      throw new ReservaException("Error durante la ejecucion");
    }

    if(!cambioPosible(r.getStatus(),payload.getStatus())){
      throw new ReservaExceptionArg("Cambio de estado invalido");
    }else{
      r.setStatus(payload.getStatus());
    }

    try{
      repository.save(r);
    }catch(Exception e){
      throw new ReservaException("Error durante la ejecucion");
    }
    return r;
  }

  //---------------- UTILIDADES -----------------------
  /*
   * Dada una reserva devuelve las habitaciones que quedan disponibles los dias que dura dicha reserva
   */
  private Map<LocalDate,Integer> addDisponibilidad(Reserva r, Map<LocalDate,Integer> m,LocalDate fecha1, LocalDate fecha2){

      while(fecha1.isBefore(fecha2)){
        if((fecha1.isAfter(r.getDateIn()) || fecha1.isEqual(r.getDateIn())) &&
           (fecha1.isBefore(r.getDateOut()))){
          m = addHabitaciones(r, fecha1, m);
        }else if(!m.containsKey(fecha1)){
          m.put(fecha1, numHabitaciones);
        }
        fecha1=fecha1.plusDays(1);
      }
      return m;
  }

  /**
   * Comprueba dado un rango de fechas si existe una disponibilidad de "units" habitaciones duranto todos esos dias
   * De haber un dia dentro del rango de fechas que no posea disponibilidad suficientre se devuleve false
   */
  private boolean comprobarDisponibilidad(LocalDate in, LocalDate out, int units){
    boolean disponibilidad=true;

    if(units>numHabitaciones){
      disponibilidad = false;
    }

    try{
      Map<LocalDate,Integer> m = new HashMap<>();
      for(Reserva r : repository.findAllByOrderByDateIn()){
        LocalDate date = null;

        if(r.getDateIn().isBefore(in) || r.getDateIn().isEqual(in)){
          date = in;
        }else if(r.getDateIn().isAfter(in)){
          date = r.getDateIn();
        }

        while(date.isBefore(r.getDateOut()) && date.isBefore(out)){
          m = addHabitaciones(r, date, m);
          if(m.get(date)<units){
            disponibilidad = false;
          }
          date=date.plusDays(1);
        }
      }
    }catch(Exception e){
      throw new ReservaException("Error durante la ejecucion");
    }
    return disponibilidad;
  }

  // Comprueba si se puede realizar el cambio de estado
  private boolean cambioPosible(ReservaStatus oldS, ReservaStatus newS){
    boolean posible;

    if(newS==null || newS.equals(oldS)){
      posible = false;
    }
    else if(oldS.equals(ReservaStatus.CONFIRMED) && newS.equals(ReservaStatus.PENDING)){
      posible = false;
    }
    else if(oldS.equals(ReservaStatus.CANCELLED) && newS.equals(ReservaStatus.PENDING) ||
            oldS.equals(ReservaStatus.CANCELLED) && newS.equals(ReservaStatus.CONFIRMED)){
      posible = false;
    }else{
      posible = true;
    }
    return posible;
  }

  private Map<LocalDate,Integer> addHabitaciones(Reserva r, LocalDate date, Map<LocalDate,Integer> m){
    if(m.containsKey(date)){
      m.put(date, m.get(date)-r.getUnits());
    }else{
      m.put(date, numHabitaciones-r.getUnits());
    }
    return m;
  }
}
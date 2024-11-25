package com.example.flightsearchback.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.flightsearchback.model.Airline;
import com.example.flightsearchback.model.FlightOffer;
import com.example.flightsearchback.model.Location;
import com.example.flightsearchback.service.AmadeusAPIService;

@RestController
@RequestMapping("/api/v1")
@CrossOrigin(origins = "*") // Allow requests from this origin
public class ApiController {
    @Autowired
    private AmadeusAPIService apiService;

    @GetMapping
    public String helloWorld() {
        return "hola";
    }

    @GetMapping("/airports")
    public ResponseEntity<?> getAirports(
            @RequestParam(required = true) String keyword,
            @RequestParam(defaultValue = "AIRPORT") String subType
            ) {
        try {
            Location[] resp = apiService.getLocations(keyword, subType);
            return ResponseEntity.ok(resp);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(e.getMessage());
        }
    }

    @GetMapping("/flights")
    // public ResponseEntity<FlightOfferSearch[]> getFlightOffers(
    public ResponseEntity<?> getFlightOffers(
            @RequestParam(required = true) String origin,
            @RequestParam(required = true) String destination,
            @RequestParam(required = true) String departDate,
            @RequestParam(defaultValue = "") String returnDate,
            @RequestParam(required = true) String currencyCode,
            @RequestParam(required = true) int adults,
            @RequestParam(required = true) boolean nonStop) {
        try {
            // FlightOfferSearch[] resp = apiService.getFlightOffers(origin, destination, departDate, returnDate, adults,
            //         currencyCode, nonStop);
            FlightOffer[] resp = apiService.getFlightOffers(origin, destination, departDate, returnDate, currencyCode,
                    adults, nonStop);
            return ResponseEntity.ok(resp);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(e.getMessage());
        }
    }

    @GetMapping("/airlines")
    public ResponseEntity<?> getAirports(
            @RequestParam(required = true) String airlineCodes // separated by coma, eg: F9,VB
            ) {
        try {
            Airline[] resp = apiService.getAirline(airlineCodes);
            return ResponseEntity.ok(resp);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(e.getMessage());
        }
    }
}

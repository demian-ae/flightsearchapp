package com.example.flightsearchback.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.amadeus.exceptions.ResponseException;
import com.amadeus.resources.FlightOfferSearch;
import com.amadeus.resources.Location;
import com.example.flightsearchback.service.AmadeusAPIService;

@RestController
@RequestMapping("/api/v1")
@CrossOrigin(origins = "http://localhost:8080") // Allow requests from this origin
public class ApiController {
    @Autowired
    private AmadeusAPIService apiService;

    @GetMapping
    public String helloWorld() {
        return "hola";
    }

    @GetMapping("/airports")
    public ResponseEntity<Location[]> getAirports(
            @RequestParam(required = true) String keywords) {
        try {
            Location[] resp = apiService.getLocations(keywords);
            return ResponseEntity.ok(resp);
        } catch (ResponseException e) {
            return ResponseEntity.internalServerError().body(null);
        }
    }

    @GetMapping("/flights")
    public ResponseEntity<FlightOfferSearch[]> getFlightOffers(
            @RequestParam(required = true) String origin,
            @RequestParam(required = true) String destination,
            @RequestParam(required = true) String departDate,
            @RequestParam(defaultValue = "") String returnDate,
            @RequestParam(required = true) String currencyCode,
            @RequestParam(required = true) int adults,
            @RequestParam(required = true) boolean nonStop) {
        try {
            FlightOfferSearch[] resp = apiService.getFlightOffers(origin, destination, departDate, returnDate, adults,
                    currencyCode, nonStop);
            return ResponseEntity.ok(resp);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(null);
        }
    }
}

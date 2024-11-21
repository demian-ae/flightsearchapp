package com.example.flightsearchback.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.amadeus.exceptions.ResponseException;
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
    public Location[] getAirports(
            @RequestParam(required = true) String keywords) throws ResponseException {
        return apiService.getLocations(keywords);
    }
}

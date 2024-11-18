package com.example.flightsearchback.controller;

import org.springframework.beans.factory.annotation.Autowired;

import com.example.flightsearchback.service.ApiService;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;




@RestController
@RequestMapping("/api/v1")
@CrossOrigin(origins = "http://localhost:8080") // Allow requests from this origin
public class ApiController {
    @Autowired
    private ApiService apiService;

    @GetMapping
    public String helloWorld() {
        return "hola";
    }
    

    @GetMapping("/get-token")
    public String getToken() {
        return apiService.obtenerToken();
    }

    @GetMapping("/airports") 
    public String getAirports(
        @RequestParam(defaultValue = "a") String keywords,
        @RequestParam(defaultValue = "0") int page, 
        @RequestParam(defaultValue = "CITY,AIRPORT") String subType
        ) {
        return apiService.getAirports(keywords, subType, page);
    }
    

    
}

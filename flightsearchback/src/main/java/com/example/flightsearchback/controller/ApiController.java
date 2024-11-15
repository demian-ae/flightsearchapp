package com.example.flightsearchback.controller;

import org.springframework.beans.factory.annotation.Autowired;

import com.example.flightsearchback.service.ApiService;

import reactor.core.publisher.Mono;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestParam;




@RestController
@RequestMapping("/api/v1")
public class ApiController {
    @Autowired
    private ApiService apiService;

    @GetMapping
    public String helloWorld() {
        return "hola";
    }
    

    @GetMapping("/get-token")
    public Mono<String> getToken() {
        return apiService.obtenerToken();
    }

    @GetMapping("/flights")
    public Mono<String> getFlights() {
        return apiService.obtenerVuelos();
    }
    
}

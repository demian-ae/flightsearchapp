package com.example.flightsearchback.controller;

import org.springframework.beans.factory.annotation.Autowired;

import com.example.flightsearchback.service.ApiService;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;




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
    public String getToken() {
        return apiService.obtenerToken();
    }

    @GetMapping("/airports") 
    public String getAirports(@RequestParam(defaultValue = "") String keywords) {
        return apiService.getAirports(keywords);
    }
    

    
}

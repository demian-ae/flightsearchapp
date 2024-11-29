package com.example.flightsearchback.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class Location {
    private String type;

    private String subType;

    private String name;

    private String iataCode;
}

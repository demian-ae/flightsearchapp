package com.example.flightsearchback.model;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Getter;

@Getter
public class Location {
    @JsonProperty("type")
    private String type;

    @JsonProperty("subType")
    private String subType;

    private String name;

    @JsonProperty("iataCode")
    private String iataCode;
}

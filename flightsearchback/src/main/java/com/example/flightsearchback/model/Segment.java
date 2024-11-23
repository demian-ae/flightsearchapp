package com.example.flightsearchback.model;

import lombok.Getter;

@Getter
public class Segment {
    private FlightEndPoint departure;
    private FlightEndPoint arrival;
    private String carrierCode;
    private String number;
    private Aircraft aircraft;
    private Operating operating;
    private String duration;
    private String id;
    private int numberOfStops;
    private boolean blacklistedInEU;

    @Getter
    public static class Aircraft {
        private String code;
    }

    @Getter
    public static class Operating {
        private String carrierCode;
    }
}
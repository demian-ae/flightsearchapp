package com.example.flightsearchback.model;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Getter;

@Getter
public class TravelerPricing {
    private String travelerId;
    private String fareOption;
    private String travelerType;
    private Price price;
    private List<FareDetailBySegment> fareDetailsBySegment;

    @Getter
    public static class Price {
        private String currency;
        private String total;
        private String base;
    }

    @Getter
    public static class FareDetailBySegment {
        private String segmentId;
        private String cabin;
        private String fareBasis;
        private String brandedFare;
        private String brandedFareLabel;
        @JsonProperty("class")
        private String travelerClass; // 'class' is a reserved keyword in Java
        private IncludedCheckedBags includedCheckedBags;
        private List<Amenity> amenities;
    }

    @Getter
    public static class IncludedCheckedBags {
        private int quantity;
    }

    @Getter
    public static class Amenity {
        private String description;
        private boolean isChargeable;
        private String amenityType;
        private AmenityProvider amenityProvider;
    }

    @Getter
    public static class AmenityProvider {
        private String name;
    }

}

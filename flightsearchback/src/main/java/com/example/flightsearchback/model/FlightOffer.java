package com.example.flightsearchback.model;

import java.util.List;

import lombok.Getter;


@Getter
public class FlightOffer {
    private String type;
    private String id;
    private String source;
    private boolean oneWay;
    private List<Itinerary> itineraries;
    private Price price;
    private String[] validatingAirlineCodes;
    private TravelerPricing[] travelerPricings;

    @Getter
    public static class Itinerary {
        private String duration;
        private List<Segment> segments;
    }

    @Getter
    public static class Price {
        private String currency;
        private String total;
        private String base;
        private List<Fee> fees;
        private String grandTotal;

        @Getter
        public static class Fee {
            private String amount;
            private String type;
        }
    }
}

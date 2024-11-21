package com.example.flightsearchback.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.amadeus.Amadeus;
import com.amadeus.Params;
import com.amadeus.exceptions.ResponseException;
import com.amadeus.resources.Location;
import com.amadeus.resources.FlightOfferSearch;
import com.amadeus.referencedata.Locations;

@Service
public class AmadeusAPIService {

    private Amadeus amadeus;

    private AmadeusAPIService(
            @Value("${amadeus.client_id}") String clientId,    @Value("${amadeus.client_secret}") String clientSecret
        ) {
        this.amadeus = Amadeus
                .builder(clientId, clientSecret)
                .build();
    }

    public Location[] getLocations(String keywords) throws ResponseException {
        return amadeus.referenceData.locations.get(Params
            .with("keyword", keywords)
            .and("subType", Locations.ANY));
    }

    public FlightOfferSearch[] getFlightOffers(String origin, String destination, String departDate, String returnDate, int adults, String currencyCode, boolean nonStop) throws ResponseException {
        Params params = Params.with("originLocationCode", origin)
            .and("destinationLocationCode", destination)
            .and("departureDate", departDate)
            .and("currencyCode", currencyCode)
            .and("nonStop", nonStop)
            .and("adults", adults);

        if(returnDate.length() != 0) {
            params.and("returnDate", returnDate);
        }

        System.out.println(params.toString());

        return amadeus.shopping.flightOffersSearch.get(params);
    }

}

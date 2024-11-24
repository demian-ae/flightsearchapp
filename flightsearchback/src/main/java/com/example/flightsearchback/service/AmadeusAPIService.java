package com.example.flightsearchback.service;

import java.net.URI;
import java.time.Instant;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import com.example.flightsearchback.model.Airline;
import com.example.flightsearchback.model.FlightOffer;
import com.example.flightsearchback.model.Location;
import com.example.flightsearchback.model.TokenResponse;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

@Service
public class AmadeusAPIService {
    @Autowired
    private final RestTemplate restTemplate;
    private final String baseUrl;
    private final String clientId;
    private final String clientSecret;
    private final ObjectMapper objectMapper;
    private String token;
    private Instant tokenExpiration;

    public AmadeusAPIService(
            RestTemplate restTemplate,
            @Value("${amadeus.base_url}") String baseUrl,
            @Value("${amadeus.client_id}") String clientId,
            @Value("${amadeus.client_secret}") String clientSecret,
            ObjectMapper objectMapper) {
        this.restTemplate = restTemplate;
        this.baseUrl = baseUrl;
        this.clientId = clientId;
        this.clientSecret = clientSecret;
        this.objectMapper = objectMapper;
    }

    private synchronized void refreshToken() {
        if (token == null || Instant.now().isAfter(tokenExpiration)) {
            try {
                System.out.println("refreshing token...");
                HttpHeaders headers = new HttpHeaders();
                headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

                MultiValueMap<String, String> body = new LinkedMultiValueMap<>();
                body.add("grant_type", "client_credentials");
                body.add("client_id", clientId);
                body.add("client_secret", clientSecret);

                HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(body, headers);
                ResponseEntity<TokenResponse> response = restTemplate.postForEntity(
                        baseUrl + "/v1/security/oauth2/token",
                        request, TokenResponse.class);

                if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
                    TokenResponse responseBody = response.getBody();
                    token = responseBody.getAccessToken();
                    int expiresIn = responseBody.getExpiresIn();
                    tokenExpiration = Instant.now().plusSeconds(expiresIn);
                }
            } catch (Exception e) {
                System.err.print(e);
                throw new RuntimeException(e);
            }
        }
    }

    private HttpHeaders createHeaders() {
        refreshToken();
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(token);
        return headers;
    }

    public String getApiData() {
        try {
            HttpHeaders headers = createHeaders();
            HttpEntity<String> entity = new HttpEntity<>(headers);

            ResponseEntity<String> response = restTemplate.exchange(baseUrl, HttpMethod.GET, entity, String.class);
            return response.getBody();

        } catch (HttpClientErrorException.Unauthorized e) {
            // Refresh token on 401 error and retry
            refreshToken();
            return getApiData();
        } catch (Exception e) {
            throw new RuntimeException("Failed to retrieve API data", e);
        }
    }

    public Location[] getLocations(String keywords, String subType) {
        try {
            System.out.println("get locations: "+keywords+","+subType);
            HttpHeaders headers = createHeaders();
            HttpEntity<String> entity = new HttpEntity<>(headers);
            ResponseEntity<JsonNode> response = restTemplate.exchange(
                    baseUrl + "/v1/reference-data/locations?subType=" + subType + "&keyword=" + keywords
                            + "&view=LIGHT",
                    HttpMethod.GET, entity, JsonNode.class);

            if (response.hasBody()) {
                return objectMapper.treeToValue(response.getBody().get("data"), Location[].class);
            } else {
                throw new RuntimeException("no data");
            }
        } catch (HttpClientErrorException.Unauthorized e) {
            // Refresh token on 401 error and retry
            refreshToken();
            return getLocations(keywords, subType);
        } catch (Exception e) {
            throw new RuntimeException("Failed to retrieve API data", e);
        }
    }

    public FlightOffer[] getFlightOffers(
            String origin,
            String destination,
            String departDate,
            String returnDate,
            String currencyCode,
            int adults,
            boolean nonStop) {
        try {
            HttpHeaders headers = createHeaders();
            HttpEntity<String> entity = new HttpEntity<>(headers);

            UriComponentsBuilder uriBuilder = UriComponentsBuilder.fromHttpUrl(baseUrl + "/v2/shopping/flight-offers?")
                    .queryParam("originLocationCode", origin)
                    .queryParam("destinationLocationCode", destination)
                    .queryParam("departureDate", departDate)
                    .queryParam("currencyCode", currencyCode)
                    .queryParam("adults", adults)
                    .queryParam("nonStop", nonStop)
                    .queryParam("max", 10);

            if (!returnDate.isBlank()) {
                uriBuilder.queryParam("returnDate", returnDate);
            }

            URI uri = uriBuilder.build().toUri();

            ResponseEntity<JsonNode> response = restTemplate.exchange(
                    uri,
                    HttpMethod.GET, entity, JsonNode.class);

            if (response.hasBody()) {
                return objectMapper.treeToValue(response.getBody().get("data"), FlightOffer[].class);
                // return response.getBody().get("data").toString();
            } else {
                throw new RuntimeException("no data");
            }
        } catch (HttpClientErrorException.Unauthorized e) {
            // Refresh token on 401 error and retry
            refreshToken();
            return getFlightOffers(origin, destination, departDate, returnDate, currencyCode, adults, nonStop);
        } catch (Exception e) {
            System.out.print(e);
            throw new RuntimeException("Failed to retrieve API data", e);
        }
    }

    public Airline[] getAirline(String airlineCodes) {
        try {
            System.out.println("get airline: " + airlineCodes);
            HttpHeaders headers = createHeaders();
            HttpEntity<String> entity = new HttpEntity<>(headers);

            URI uri = UriComponentsBuilder.fromHttpUrl(baseUrl + "/v1/reference-data/airlines")
                    .queryParam("airlineCodes", airlineCodes)
                    .build()
                    .toUri();

            ResponseEntity<JsonNode> response = restTemplate.exchange(
                    uri,
                    HttpMethod.GET, entity, JsonNode.class);

            if (response.hasBody()) {
                return objectMapper.treeToValue(response.getBody().get("data"), Airline[].class);
            } else {
                throw new RuntimeException("no data");
            }
        } catch (HttpClientErrorException.Unauthorized e) {
            // Refresh token on 401 error and retry
            refreshToken();
            return getAirline(airlineCodes);
        } catch (Exception e) {
            System.out.print(e);
            throw new RuntimeException("Failed to retrieve API data", e);
        }
    }
}

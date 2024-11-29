package com.example.flightsearchback.service;

import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.*;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.web.client.RestTemplate;

import com.example.flightsearchback.model.Location;
import com.example.flightsearchback.model.TokenResponse;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.http.HttpStatus;
import org.springframework.web.client.HttpClientErrorException;



@ExtendWith(MockitoExtension.class)
public class AmadeusAPIServiceTest {

    @Mock
    private RestTemplate restTemplate;

    @Mock
    private ObjectMapper objectMapper;

    @InjectMocks
    private AmadeusAPIService amadeusAPIService;

    @Value("${amadeus.base_url}")
    private String baseUrl = "https://api.example.com";

    @Value("${amadeus.client_id}")
    private String clientId = "client_id";

    @Value("${amadeus.client_secret}")
    private String clientSecret = "client_secret";

    private TokenResponse tokenResponse;

    @BeforeEach
    public void setUp() {
        tokenResponse = new TokenResponse("access_token", 1799, "Bearer");  
    }

    @Test
    public void testGetApiData() {
        ResponseEntity<String> mockResponse = new ResponseEntity<>("API data", HttpStatus.OK);
        when(restTemplate.exchange(anyString(), eq(HttpMethod.GET), any(HttpEntity.class), eq(String.class)))
                .thenReturn(mockResponse);

        String result = amadeusAPIService.getApiData();


        assertEquals("API data", result);


        verify(restTemplate, times(1)).exchange(anyString(), eq(HttpMethod.GET), any(HttpEntity.class), eq(String.class));
    }

    @Test
    public void testGetApiDataUnauthorizedThenRefreshToken() {
        HttpClientErrorException unauthorizedException = new HttpClientErrorException(HttpStatus.UNAUTHORIZED);
        when(restTemplate.exchange(anyString(), eq(HttpMethod.GET), any(HttpEntity.class), eq(String.class)))
                .thenThrow(unauthorizedException)
                .thenReturn(new ResponseEntity<>("API data", HttpStatus.OK));  //

        String result = amadeusAPIService.getApiData();


        assertEquals("API data", result);


        verify(restTemplate, times(2)).exchange(anyString(), eq(HttpMethod.GET), any(HttpEntity.class), eq(String.class));
    }

    @Test
    public void testGetLocations() throws Exception {

        JsonNode mockJsonNode = mock(JsonNode.class);
        Location[] mockLocations = new Location[]{new Location("location", "AIRPORT", "LOS ANGELES INTL", "LAX"), new Location("location", "CITY", "LOS ANGELES", "LAX")};
        when(mockJsonNode.get("data")).thenReturn(mockJsonNode);
        when(objectMapper.treeToValue(mockJsonNode, Location[].class)).thenReturn(mockLocations);
        ResponseEntity<JsonNode> mockLocationResponse = new ResponseEntity<>(mockJsonNode, HttpStatus.OK);
        when(restTemplate.exchange(anyString(), eq(HttpMethod.GET), any(HttpEntity.class), eq(JsonNode.class)))
                .thenReturn(mockLocationResponse);


        Location[] locations = amadeusAPIService.getLocations("angeles", "AIRPORT,CITY");


        assertEquals(2, locations.length);
        assertEquals("LOS ANGELES INTL", locations[0].getName());
        assertEquals("LOS ANGELES", locations[1].getName());


        verify(restTemplate, times(1)).exchange(anyString(), eq(HttpMethod.GET), any(HttpEntity.class), eq(JsonNode.class));
    }

    @Test
    public void testGetLocationsUnauthorizedThenRefreshToken() throws Exception {

        HttpClientErrorException unauthorizedException = new HttpClientErrorException(HttpStatus.UNAUTHORIZED);
        when(restTemplate.exchange(anyString(), eq(HttpMethod.GET), any(HttpEntity.class), eq(JsonNode.class)))
                .thenThrow(unauthorizedException)
                .thenReturn(new ResponseEntity<>(mock(JsonNode.class), HttpStatus.OK));  //

        Location[] locations = amadeusAPIService.getLocations("angeles", "AIRPORT,CITY");

        // two calls, 1 for the failed call,
        verify(restTemplate, times(2)).exchange(anyString(), eq(HttpMethod.GET), any(HttpEntity.class), eq(JsonNode.class));
    }
}


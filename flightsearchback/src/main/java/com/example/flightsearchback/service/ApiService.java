package com.example.flightsearchback.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.BodyInserters;
import org.springframework.web.reactive.function.client.ClientResponse;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;

import com.example.flightsearchback.model.TokenResponse;

@Service
public class ApiService {
    private final WebClient webClient;
    private final String clientId;
    private final String clientSecret;

    private String token;

    public ApiService(
        @Value("${amadeus.url}") String baseUrl,
        @Value("${amadeus.client_id}") String clientId,
        @Value("${amadeus.client_secret}") String clientSecret
    ) {
        this.webClient = WebClient.builder().baseUrl(baseUrl).build();
        this.clientId = clientId;
        this.clientSecret = clientSecret;
    }

    public String obtenerToken() {
        return this.webClient.post()
            .uri("/security/oauth2/token")
            .contentType(MediaType.APPLICATION_FORM_URLENCODED) 
            .body(BodyInserters
                .fromFormData("grant_type", "client_credentials")
                .with("client_id", clientId)
                .with("client_secret", clientSecret)
            )
            .retrieve()
            .onStatus(status -> status.is4xxClientError() || status.is5xxServerError(), 
                      ClientResponse::createException) // arroja una excepcion
            .bodyToMono(TokenResponse.class)
            .map(TokenResponse::getAccessToken)
            .block(); // :: -> es para la funcion en si, no para invocarla. Map necesita una funcion como parametro
    }

    public void actualizarToken() {
        System.out.println("----------   ACTUALIZANDO TOKEN...   ----------");
        this.token = obtenerToken();
        System.out.println("----------   ACTUALIZADO   ----------");
    }

    public String obtenerVuelos() {
        try {
            return this.webClient.get()
                .uri("/reference-data/locations?subType=AIRPORT&keyword=Mex&view=LIGHT")
                .headers(h -> h.setBearerAuth(token))
                .retrieve()
                .onStatus(status -> status.is4xxClientError() || status.is5xxServerError(), 
                        ClientResponse::createException)
                .bodyToMono(String.class)
                .block();
        } catch (WebClientResponseException.Unauthorized e) {
            System.out.println("----------   TOKEN INVALIDO   ----------");
            actualizarToken(); // Actualizar token si ocurre Unauthorized
            return this.webClient.get() // Reintentar con el nuevo token
                .uri("/reference-data/locations?subType=AIRPORT&keyword=Mex&view=LIGHT")
                .headers(h -> h.setBearerAuth(token))
                .retrieve()
                .bodyToMono(String.class)
                .block();
        }
    }

}

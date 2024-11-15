package com.example.flightsearchback.model;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Getter;
import lombok.Setter;


// {
//     "type": "amadeusOAuth2Token",
//     "username": "name@mail.com",
//     "application_name": "flight-search",
//     "client_id": "xxxxx",
//     "token_type": "Bearer",  <---
//     "access_token": "xxxxxx",    <---
//     "expires_in": 1799,      <---
//     "state": "approved",
//     "scope": ""
// }
// los demas valores los ignora

@Getter
@Setter
public class TokenResponse {

    @JsonProperty("access_token")
    private String accessToken;

    @JsonProperty("expires_in")
    private int expiresIn;

    @JsonProperty("token_type")
    private String tokenType;
}

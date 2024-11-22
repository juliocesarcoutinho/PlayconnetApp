package br.com.ibrecchurch.playconnectapi.dto.api;

import com.fasterxml.jackson.annotation.JsonProperty;

public record CepDTO(
        @JsonProperty("updated") String ultimaAtualizacao,
        @JsonProperty("code") String cep,
        @JsonProperty("municipality") Long codigoMunicipio,
        @JsonProperty("number") String numero,
        @JsonProperty("district") String bairro,
        @JsonProperty("city") String cidade,
        @JsonProperty("state") String estado


) {
}

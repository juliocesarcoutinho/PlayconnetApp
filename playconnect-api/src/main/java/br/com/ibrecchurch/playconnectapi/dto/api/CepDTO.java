package br.com.ibrecchurch.playconnectapi.dto.api;

import com.fasterxml.jackson.annotation.JsonProperty;

public record CepDTO(
        String ultimaAtualizacao,
        String cep,
        String logradouro,
        Long codigoMunicipio,
        String numero,
        String bairro,
        String cidade,
        String estado


) {
}

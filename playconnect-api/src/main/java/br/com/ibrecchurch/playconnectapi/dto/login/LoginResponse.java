package br.com.ibrecchurch.playconnectapi.dto.login;

public record LoginResponse(String token, Long tempoExpiracao) {
}

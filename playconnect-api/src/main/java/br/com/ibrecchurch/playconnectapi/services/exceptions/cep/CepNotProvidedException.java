package br.com.ibrecchurch.playconnectapi.services.exceptions.cep;

public class CepNotProvidedException extends RuntimeException {
    public CepNotProvidedException(String message) {
        super(message);
    }
}


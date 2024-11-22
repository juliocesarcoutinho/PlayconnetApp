package br.com.ibrecchurch.playconnectapi.services.exceptions.cep;

public class CepNotFoundException extends RuntimeException {
    public CepNotFoundException(String message) {
        super(message);
    }

}

package br.com.ibrecchurch.playconnectapi.services.exceptions;

public class InvalidEmailException extends RuntimeException {
    public InvalidEmailException(String msg, Throwable cause) {
        super(msg, cause);
    }
}
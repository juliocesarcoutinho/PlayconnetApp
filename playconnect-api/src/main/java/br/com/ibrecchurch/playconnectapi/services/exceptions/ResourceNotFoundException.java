package br.com.ibrecchurch.playconnectapi.services.exceptions;

public class ResourceNotFoundException extends RuntimeException{
    
    public ResourceNotFoundException(String msg) {
        super(msg);
    }
}

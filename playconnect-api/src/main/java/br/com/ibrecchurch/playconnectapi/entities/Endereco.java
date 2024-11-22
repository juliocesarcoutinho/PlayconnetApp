package br.com.ibrecchurch.playconnectapi.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Embeddable
@Data
public class Endereco {

    @NotBlank
    @Column(length = 8)
    private String cep;

    @NotBlank
    @Column(length = 200)
    private String logradouro;

    @NotBlank
    @Column(length = 10)
    private String numero;

    @NotBlank
    @Column(length = 200)
    private String complemento;

    @NotBlank
    @Column(length = 200)
    private String bairro;

    @NotBlank
    @Column(length = 200)
    private String cidade;

    @NotBlank
    @Column(length = 2)
    private String estado;

}

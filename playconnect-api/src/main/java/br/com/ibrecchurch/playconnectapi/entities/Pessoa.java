package br.com.ibrecchurch.playconnectapi.entities;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.time.LocalDate;

@Entity
@Data
@Table(name = "pessoa")
@EqualsAndHashCode(of = "id")
public class Pessoa {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column
    private String nome;    
    @Column
    private String cpf;
    @Column
    private String rg;
    @Column(columnDefinition = "TIMESTAMP WITHOUT TIME ZONE")
    @Temporal(TemporalType.DATE)
    private LocalDate dataNascimento;
    @Column
    private String nomePai;
    @Column
    private String nomeMae;
    @Embedded
    private Endereco endereco;

    @Version
    @Column(name = "versao")
    private Long version;
}

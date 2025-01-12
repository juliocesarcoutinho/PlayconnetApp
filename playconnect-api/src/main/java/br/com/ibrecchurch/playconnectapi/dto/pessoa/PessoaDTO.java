package br.com.ibrecchurch.playconnectapi.dto.pessoa;

import br.com.ibrecchurch.playconnectapi.entities.Endereco;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import org.hibernate.validator.constraints.br.CPF;

import java.time.LocalDate;

public record PessoaDTO(       
        @CPF(message = "O cpf é invalido") @NotBlank(message = "O campo CPF é obrigatório") String cpf,
        String nome,
        String rg,
        LocalDate dataNascimento,
        String nomePai,
        String nomeMae,
        Endereco endereco,
        Long id
) {
}
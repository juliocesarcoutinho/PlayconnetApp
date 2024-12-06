package br.com.ibrecchurch.playconnectapi.mappers;

import br.com.ibrecchurch.playconnectapi.dto.pessoa.PessoaDTO;
import br.com.ibrecchurch.playconnectapi.entities.Pessoa;
import org.springframework.stereotype.Component;

@Component
public class PessoaMappers {
    public PessoaDTO toDTO(Pessoa pessoa) {
        return new PessoaDTO(
                pessoa.getCpf(),
                pessoa.getNome(),
                pessoa.getRg(),
                pessoa.getDataNascimento(),
                pessoa.getNomePai(),
                pessoa.getNomeMae(),
                pessoa.getEndereco(),
                pessoa.getId()
        );
    }
}

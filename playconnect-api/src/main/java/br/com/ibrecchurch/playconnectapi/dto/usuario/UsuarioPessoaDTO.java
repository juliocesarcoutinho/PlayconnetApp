package br.com.ibrecchurch.playconnectapi.dto.usuario;

import br.com.ibrecchurch.playconnectapi.dto.pessoa.PessoaDTO;
import br.com.ibrecchurch.playconnectapi.entities.Pessoa;
import br.com.ibrecchurch.playconnectapi.entities.Usuario;
import jakarta.validation.Valid;

import java.util.Set;

public record UsuarioPessoaDTO(
        Long id,
        String nome,
        String email,
        String celular,
        String ativo,
        String dataCadastro,
        String dataAtualizacao,
        @Valid PessoaDTO pessoa
) {
    public UsuarioPessoaDTO(UsuarioDTO usuarioDTO, PessoaDTO pessoaDTO) {
        this(usuarioDTO.id(),
                usuarioDTO.nome(),
                usuarioDTO.email(),
                usuarioDTO.celular(),
                usuarioDTO.ativo(),
                usuarioDTO.dataCadastro(),
                usuarioDTO.dataAtualizacao(),
                pessoaDTO);
    }

    public UsuarioPessoaDTO(Usuario usuario, PessoaDTO dto) {
        this(new UsuarioDTO(usuario), dto);
    }
}

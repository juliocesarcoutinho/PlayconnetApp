package br.com.ibrecchurch.playconnectapi.dto.usuario;

import br.com.ibrecchurch.playconnectapi.entities.Endereco;
import br.com.ibrecchurch.playconnectapi.entities.Role;
import br.com.ibrecchurch.playconnectapi.entities.Usuario;
import br.com.ibrecchurch.playconnectapi.validation.ValidEmailDomain;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.util.HashSet;
import java.util.Set;

public record UsuarioCompletoDTO(
        Long id,
        @NotBlank(message = "O campo nome é obrigatório") String nome,
        @NotBlank(message = "O campo email é obrigatório") @ValidEmailDomain String email,
        @NotBlank String celular,
        String senha,
        Set<RoleDTO> roles,
        Endereco endereco) {

    public UsuarioCompletoDTO(Usuario entity) {
        this(entity.getId(),
                entity.getNome(),
                entity.getEmail(),
                entity.getCelular(),
                entity.getSenha(),
                new HashSet<>(),
                entity.getEndereco());
    }

    public UsuarioCompletoDTO(Usuario entity, Set<Role> roles) {
        this(entity);
        roles.forEach(role -> this.roles.add(new RoleDTO(role)));
    }
}
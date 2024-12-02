package br.com.ibrecchurch.playconnectapi.dto.usuario;

import br.com.ibrecchurch.playconnectapi.entities.Role;
import br.com.ibrecchurch.playconnectapi.entities.Usuario;
import br.com.ibrecchurch.playconnectapi.validation.ValidEmailDomain;
import jakarta.validation.constraints.NotBlank;
import java.util.HashSet;
import java.util.Set;

public record UsuarioCompletoDTO(
        Long id,
        @NotBlank(message = "O campo nome é obrigatório") String nome,
        @NotBlank(message = "O campo email é obrigatório") @ValidEmailDomain String email,
        @NotBlank String celular,
        String senha,
        Set<RoleDTO> roles) {

    public UsuarioCompletoDTO(Usuario entity) {
        this(entity.getId(),
                entity.getNome(),
                entity.getEmail(),
                entity.getCelular(),
                entity.getSenha(),
                new HashSet<>());
    }

    public UsuarioCompletoDTO(Usuario entity, Set<Role> roles) {
        this(entity);
        roles.forEach(role -> this.roles.add(new RoleDTO(role)));
    }
}
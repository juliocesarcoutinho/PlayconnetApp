package br.com.ibrecchurch.playconnectapi.dto.usuario;

import br.com.ibrecchurch.playconnectapi.entities.Role;
import br.com.ibrecchurch.playconnectapi.enums.TipoUsuario;
import jakarta.validation.constraints.NotBlank;

public record RoleDTO(
        Long id, 
        @NotBlank(message = "O campo descrição é obrigatório") String descricao, 
        TipoUsuario tipoUsuario) {

    public RoleDTO(Role entity) {
        this(entity.getId(),
             entity.getDescricao(),
             entity.getTipoUsuario());
    }
}
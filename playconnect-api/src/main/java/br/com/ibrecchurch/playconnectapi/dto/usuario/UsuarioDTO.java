package br.com.ibrecchurch.playconnectapi.dto.usuario;

import br.com.ibrecchurch.playconnectapi.entities.Role;
import br.com.ibrecchurch.playconnectapi.entities.Usuario;
import br.com.ibrecchurch.playconnectapi.util.DateUtils;

import java.util.Set;
import java.util.stream.Collectors;

public record UsuarioDTO(
        Long id,
        String nome,
        String email,
        String celular,
        String dataCadastro,
        String dataAtualizacao,
        Set<RoleDTO> roles) {

    public UsuarioDTO(Usuario entity) {
        this(entity.getId(),
                entity.getNome(),
                entity.getEmail(),
                entity.getCelular(),
                DateUtils.formatData(entity.getDataCadastro().toLocalDateTime()),
                DateUtils.formatData(entity.getDataAlteracao().toLocalDateTime()),
                entity.getRoles().stream().map(RoleDTO::new).collect(Collectors.toSet()));
    }

    public UsuarioDTO(Usuario entity, Set<Role> roles) {
        this(entity);
        roles.forEach(role -> this.roles.add(new RoleDTO(role)));
    }
}
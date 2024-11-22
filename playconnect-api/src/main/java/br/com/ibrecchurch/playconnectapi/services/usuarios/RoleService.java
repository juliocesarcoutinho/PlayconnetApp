package br.com.ibrecchurch.playconnectapi.services.usuarios;

import br.com.ibrecchurch.playconnectapi.dto.usuario.RoleDTO;
import br.com.ibrecchurch.playconnectapi.entities.Role;
import br.com.ibrecchurch.playconnectapi.enums.TipoUsuario;
import br.com.ibrecchurch.playconnectapi.repositories.RoleRepository;
import br.com.ibrecchurch.playconnectapi.services.exceptions.ResourceNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class RoleService {

    private final RoleRepository roleRepository;

    public RoleService(RoleRepository roleRepository) {
        this.roleRepository = roleRepository;
    }

    // Lista de roles
    public List<RoleDTO> findAll() {
        return roleRepository.findAll().stream().map(RoleDTO::new).collect(Collectors.toList());
    }

    // Busca role por ID
    public RoleDTO findById(Long id) {
        return new RoleDTO(roleRepository.findById(id).orElseThrow(() ->
                new ResourceNotFoundException("Função não encontrada com ID: " + id)));
    }

    // Edita role
    public RoleDTO update(Long id, RoleDTO dto) {
        var role = roleRepository.findById(id).orElseThrow(() ->
                new ResourceNotFoundException("Função não encontrada com ID: " + id));

        roleRepository.buscaDescricao(dto.descricao().toUpperCase())
                .ifPresent(existingRole -> {
                    if (!existingRole.getId().equals(id)) {
                        throw new IllegalArgumentException("Já existe uma função com essa descrição.");
                    }
                });

        role.setDescricao(dto.descricao().toUpperCase());
        role.setTipoUsuario(TipoUsuario.valueOf(dto.tipoUsuario().name().toUpperCase()));
        return new RoleDTO(roleRepository.save(role));
    }

    // Cria role
    public RoleDTO create(RoleDTO dto) {

        roleRepository.buscaDescricao(dto.descricao().toUpperCase())
                .ifPresent(role -> {
                    throw new IllegalArgumentException("Já existe uma função com essa descrição.");
                });

        var role = new Role();
        role.setDescricao(dto.descricao().toUpperCase());
        role.setTipoUsuario(TipoUsuario.valueOf(dto.tipoUsuario().name().toUpperCase()));
        return new RoleDTO(roleRepository.save(role));
    }

    // Deleta role
    public void delete(Long id) {
        if (!roleRepository.existsById(id)) {
            throw new ResourceNotFoundException("Função não encontrada com ID: " + id);
        }
        roleRepository.deleteById(id);
    }
}
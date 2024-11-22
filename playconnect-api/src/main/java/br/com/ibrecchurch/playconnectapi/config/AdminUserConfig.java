package br.com.ibrecchurch.playconnectapi.config;

import br.com.ibrecchurch.playconnectapi.entities.Role;
import br.com.ibrecchurch.playconnectapi.entities.Usuario;
import br.com.ibrecchurch.playconnectapi.enums.TipoUsuario;
import br.com.ibrecchurch.playconnectapi.repositories.RoleRepository;
import br.com.ibrecchurch.playconnectapi.repositories.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;
import java.util.Set;

@Component
public class AdminUserConfig implements CommandLineRunner {

    private final RoleRepository roleRepository;
    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public AdminUserConfig(RoleRepository roleRepository,
                           UsuarioRepository usuarioRepository,
                           PasswordEncoder passwordEncoder) {
        this.roleRepository = roleRepository;
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        // Verificar se o role ADMINISTRADOR existe
        var roleAdmin = roleRepository.findByDescricao(TipoUsuario.ADMINISTRADOR.name());
        if (roleAdmin == null) {
            // Se não existir, cria e salva o role ADMINISTRADOR
            roleAdmin = new Role();
            roleAdmin.setDescricao(TipoUsuario.ADMINISTRADOR.name());
            roleAdmin.setTipoUsuario(TipoUsuario.ADMINISTRADOR);
            roleAdmin = roleRepository.save(roleAdmin);
        }
        
        Optional<Usuario> usuarioAdmin = usuarioRepository.findByEmail("playconnect@ibrecchurch.com.br");

        final Role finalRoleAdmin = roleAdmin;
        usuarioAdmin.ifPresentOrElse(
            usuario -> System.out.println("Usuário administrador já cadastrado!"),
            () -> {
                // Criar e salvar o usuário administrador se não existir
                Usuario usuario = new Usuario();
                usuario.setNome("Administrador");
                usuario.setEmail("playconnect@ibrecchurch.com.br");
                usuario.setSenha(passwordEncoder.encode("123456"));
                usuario.setRoles(Set.of(finalRoleAdmin));
                usuarioRepository.save(usuario);
            }
        );
    }
}

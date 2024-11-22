package br.com.ibrecchurch.playconnectapi.repositories;

import br.com.ibrecchurch.playconnectapi.entities.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    
    Optional<Usuario> findByEmail(String email);

    @Query("SELECT u FROM Usuario u JOIN FETCH u.roles")
    List<Usuario> findAllWithRoles();

    @Query("SELECT u FROM Usuario u JOIN FETCH u.roles WHERE u.id IN :ids")
    List<Usuario> findAllWithRolesByIds(@Param("ids") List<Long> ids);
}

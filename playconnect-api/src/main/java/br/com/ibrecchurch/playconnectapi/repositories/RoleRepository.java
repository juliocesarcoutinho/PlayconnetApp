package br.com.ibrecchurch.playconnectapi.repositories;

import br.com.ibrecchurch.playconnectapi.entities.Role;
import br.com.ibrecchurch.playconnectapi.enums.TipoUsuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RoleRepository extends JpaRepository<Role, Long> {

    Role findByDescricao(String descricao);

    Optional<Role> findByDescricaoAndTipoUsuario(String descricao, TipoUsuario tipoUsuario);

    @Query("SELECT DISTINCT R.tipoUsuario FROM Role R")
    List<TipoUsuario> findAllTipoUsuaio();

    @Query("SELECT R FROM Role R WHERE TRIM(UPPER(R.descricao)) = TRIM(UPPER(?1)) ")
    Optional<Role> buscaDescricao(String descricao);

}

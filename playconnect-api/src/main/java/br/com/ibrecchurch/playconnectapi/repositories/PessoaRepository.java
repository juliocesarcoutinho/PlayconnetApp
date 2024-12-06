package br.com.ibrecchurch.playconnectapi.repositories;

import br.com.ibrecchurch.playconnectapi.entities.Pessoa;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PessoaRepository extends JpaRepository<Pessoa, Long> {
}

package br.com.ibrecchurch.playconnectapi.services;

import br.com.ibrecchurch.playconnectapi.dto.pessoa.PessoaDTO;
import br.com.ibrecchurch.playconnectapi.entities.Pessoa;
import br.com.ibrecchurch.playconnectapi.mappers.PessoaMappers;
import br.com.ibrecchurch.playconnectapi.repositories.PessoaRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class PessoaService {
    
    private final PessoaRepository pessoaRepository;
    private final PessoaMappers pessoaMapper ;
    
    public PessoaService(PessoaRepository pessoaRepository, PessoaMappers pessoaMapper) {
        this.pessoaRepository = pessoaRepository;
        this.pessoaMapper = pessoaMapper;
    }
    
    //Lista paginada de pessoas
    @Transactional(readOnly = true)
    public Page<PessoaDTO> findAll(Pageable pageable) {
        Page<Pessoa> pessoas = pessoaRepository.findAll(pageable);
        return pessoas.map(pessoaMapper::toDTO);
    }
    
    //Buscar pessoa por id
    @Transactional(readOnly = true)
    public PessoaDTO buscar(Long id) {
        Pessoa pessoa = pessoaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Pessoa não encontrada"));
        return pessoaMapper.toDTO(pessoa);
    }
    
}

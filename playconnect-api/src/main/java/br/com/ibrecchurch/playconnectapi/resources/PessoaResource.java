package br.com.ibrecchurch.playconnectapi.resources;

import br.com.ibrecchurch.playconnectapi.dto.pessoa.PessoaDTO;
import br.com.ibrecchurch.playconnectapi.services.PessoaService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(value = "/api/v1/pessoas")
public class PessoaResource {
    
    private final PessoaService service;
    
    public PessoaResource(PessoaService service) {
        this.service = service;
    }

    // Busca Pessoa paginada
    @GetMapping
    public ResponseEntity<Page<PessoaDTO>> listarPessoas(Pageable pageable) {
        Page<PessoaDTO> page = service.findAll(pageable);
        return ResponseEntity.ok(page);
    }
    
    // Busca Pessoa por id
    @GetMapping(value = "/pessoas/{id}")
    public ResponseEntity<PessoaDTO> buscar(@PathVariable("id") Long id) {
        PessoaDTO dto = service.buscar(id);
        return ResponseEntity.ok().body(dto);
    }
}

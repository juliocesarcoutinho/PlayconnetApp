package br.com.ibrecchurch.playconnectapi.resources.usuario;

import br.com.ibrecchurch.playconnectapi.dto.usuario.UsuarioCompletoDTO;
import br.com.ibrecchurch.playconnectapi.dto.usuario.UsuarioDTO;
import br.com.ibrecchurch.playconnectapi.services.usuarios.UsuarioService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

@RestController
@RequestMapping(value = "/api/v1/usuarios")
@CrossOrigin
public class UsuarioResource {

    private final UsuarioService service;

    public UsuarioResource(UsuarioService service) {
        this.service = service;
    }
    
    //Lista paginada de usuários
    @GetMapping
    public ResponseEntity<Page<UsuarioDTO>> listar(Pageable pageable) {
        Page<UsuarioDTO> page = service.findAll(pageable);
        return ResponseEntity.ok(page);
    }
    
    //Buscar usuário por id
    @GetMapping(value = "/{id}")
    public ResponseEntity<UsuarioDTO> buscar(@PathVariable("id") Long id) {
        UsuarioDTO dto = service.buscar(id);
        return ResponseEntity.ok().body(dto);
    }
    
    //Inserir usuário
    @PostMapping
    public ResponseEntity<UsuarioDTO> inserir(@RequestBody @Valid UsuarioCompletoDTO dto) {
        UsuarioDTO novoDto = service.inserir(dto);
        return ResponseEntity.created(
                        ServletUriComponentsBuilder.fromCurrentRequest()
                                .path("/{id}")
                                .buildAndExpand(novoDto.id())
                                .toUri())
                .body(novoDto);
    }
    
    //Atualizar usuário
    @PutMapping(value = "/{id}")
    public ResponseEntity<UsuarioDTO> atualizar(@PathVariable("id") Long id, 
                                                @RequestBody 
                                                @Valid UsuarioCompletoDTO dto) {
        UsuarioDTO novoDto = service.atualizar(id, dto);
        return ResponseEntity.ok().body(novoDto);
    }
    
    //Deletar usuário
    @DeleteMapping(value = "/{id}")
    public ResponseEntity<Void> deletar(@PathVariable("id") Long id) {
        service.deletar(id);
        return ResponseEntity.noContent().build();
    }
}

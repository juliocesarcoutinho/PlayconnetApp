package br.com.ibrecchurch.playconnectapi.resources.usuario;

import br.com.ibrecchurch.playconnectapi.dto.usuario.EmailDTO;
import br.com.ibrecchurch.playconnectapi.dto.usuario.UsuarioDTO;
import br.com.ibrecchurch.playconnectapi.services.usuarios.UsuarioService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/recovery-password")
public class RecuperarSenhaResource {

    private final UsuarioService usuarioService;

    public RecuperarSenhaResource(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }

    @PostMapping
    public ResponseEntity<UsuarioDTO> recuperaSenha(@RequestBody @Valid EmailDTO dto) {
        usuarioService.recoveryPassword(dto.email());
        return ResponseEntity.ok().build();
    }

}

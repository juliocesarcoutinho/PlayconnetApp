package br.com.ibrecchurch.playconnectapi.resources.usuario;

import br.com.ibrecchurch.playconnectapi.dto.login.LoginRequest;
import br.com.ibrecchurch.playconnectapi.dto.login.LoginResponse;
import br.com.ibrecchurch.playconnectapi.securities.AuthenticationService;
import br.com.ibrecchurch.playconnectapi.services.usuarios.UsuarioService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/login")
@CrossOrigin
public class TokenResource {

    private final AuthenticationService authenticationService;
    private final UsuarioService usuarioService;

    @Autowired
    public TokenResource(AuthenticationService authenticationService, UsuarioService usuarioService) {
        this.authenticationService = authenticationService;
        this.usuarioService = usuarioService;
    }

    @PostMapping
    public ResponseEntity<LoginResponse> login(@RequestBody @Valid LoginRequest loginRequest) {
        var response = authenticationService.authenticate(loginRequest);
        return ResponseEntity.ok(response);
    }
}

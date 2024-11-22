package br.com.ibrecchurch.playconnectapi.securities;

import br.com.ibrecchurch.playconnectapi.dto.login.LoginRequest;
import br.com.ibrecchurch.playconnectapi.dto.login.LoginResponse;
import br.com.ibrecchurch.playconnectapi.repositories.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthenticationService {

    private final UsuarioRepository usuarioRepository;
    private final BCryptPasswordEncoder passwordEncoder;
    private final TokenService tokenService;

    @Autowired
    public AuthenticationService(UsuarioRepository usuarioRepository, BCryptPasswordEncoder passwordEncoder, TokenService tokenService) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
        this.tokenService = tokenService;
    }

    public LoginResponse authenticate(LoginRequest loginRequest) {
        var usuario = usuarioRepository.findByEmail(loginRequest.email());
        if (usuario.isEmpty() || !usuario.get().isLoginCorreto(loginRequest, passwordEncoder)) {
            throw new BadCredentialsException("Credenciais inválidas!");
        }
        return tokenService.generateToken(usuario.get().getId());
    }
}


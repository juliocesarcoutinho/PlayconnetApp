package br.com.ibrecchurch.playconnectapi.securities;

import br.com.ibrecchurch.playconnectapi.dto.login.LoginResponse;
import br.com.ibrecchurch.playconnectapi.entities.Role;
import br.com.ibrecchurch.playconnectapi.repositories.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.stream.Collectors;

@Service
public class TokenService {

    private final JwtEncoder jwtEncoder;
    private final UsuarioRepository usuarioRepository;

    @Autowired
    public TokenService(JwtEncoder jwtEncoder, UsuarioRepository usuarioRepository) {
        this.jwtEncoder = jwtEncoder;
        this.usuarioRepository = usuarioRepository;
    }

    public LoginResponse generateToken(Long userId) {
        var usuario = usuarioRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        var now = Instant.now();
        var tempoExpiracao = 3600L;

        var authorities = usuario.getRoles().stream()
                .map(Role::getTipoUsuario)
                .collect(Collectors.toList());

        var claims = JwtClaimsSet.builder()
                .issuer("playconnect-api")
                .subject(userId.toString())
                .issuedAt(now)
                .expiresAt(now.plusSeconds(tempoExpiracao))
                .claim("authorities", authorities)
                .build();

        var jwtValue = jwtEncoder.encode(JwtEncoderParameters.from(claims)).getTokenValue();
        return new LoginResponse(jwtValue, tempoExpiracao);
    }
}

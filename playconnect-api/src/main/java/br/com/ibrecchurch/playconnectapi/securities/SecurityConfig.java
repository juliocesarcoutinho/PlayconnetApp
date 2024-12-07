package br.com.ibrecchurch.playconnectapi.securities;

import br.com.ibrecchurch.playconnectapi.config.JwtAuthenticationConverter;
import br.com.ibrecchurch.playconnectapi.config.RSAKeyGenerator;
import com.nimbusds.jose.jwk.JWK;
import com.nimbusds.jose.jwk.JWKSet;
import com.nimbusds.jose.jwk.RSAKey;
import com.nimbusds.jose.jwk.source.ImmutableJWKSet;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.security.oauth2.jwt.NimbusJwtEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.security.PrivateKey;
import java.security.interfaces.RSAPublicKey;
import java.util.Collections;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final RSAPublicKey publicKey;
    private final PrivateKey privateKey;

    private final CustomUserDetailsService customUserDetailsService;

    @Autowired
    public SecurityConfig(CustomUserDetailsService customUserDetailsService, RSAKeyGenerator rsaKeyGenerator) {
        this.customUserDetailsService = customUserDetailsService;
        this.publicKey = (RSAPublicKey) rsaKeyGenerator.getPublicKey();
        this.privateKey = rsaKeyGenerator.getPrivateKey();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http.cors(cors -> cors.configurationSource(corsConfigurationSource())) // Adiciona suporte a CORS
                .authorizeHttpRequests(authorize -> authorize
                        .requestMatchers(HttpMethod.POST, "/api/v1/login").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/v1/recovery-password").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/v1/usuarios").hasAnyAuthority("ADMINISTRADOR")
                        .requestMatchers(HttpMethod.GET, "/api/v1/usuarios").hasAnyAuthority("ADMINISTRADOR")
                        .requestMatchers(HttpMethod.PUT, "/api/v1/usuarios/**").hasAnyAuthority("ADMINISTRADOR", "ADOLESCENTE")
                        .requestMatchers(HttpMethod.PUT, "/api/v1/roles/**").hasAnyAuthority("ADMINISTRADOR")
                        .requestMatchers(HttpMethod.GET, "/api/v1/usuarios/{id}").hasAnyAuthority("ADMINISTRADOR")
                        .requestMatchers(HttpMethod.GET, "/api/v1/ceps/**").hasAnyAuthority("ADMINISTRADOR", "ADOLESCENTE")
                        .requestMatchers(HttpMethod.GET, "/api/v1/pessoas/**").hasAnyAuthority("ADMINISTRADOR")
                        .requestMatchers(HttpMethod.GET, "/api/v1/usuarios/adolecentes").hasAnyAuthority("ADMINISTRADOR")
                        .requestMatchers(HttpMethod.GET, "/api/v1/usuarios/adolecentes/{id}").hasAnyAuthority("ADMINISTRADOR")
                        .anyRequest().authenticated())
                .csrf(AbstractHttpConfigurer::disable)
                .oauth2ResourceServer(oauth2 -> oauth2.jwt(jwt -> jwt.jwtAuthenticationConverter(new JwtAuthenticationConverter())))
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS));

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Collections.singletonList("http://localhost:3000")); // Ajuste conforme necessário
        configuration.setAllowedMethods(Collections.singletonList("*"));
        configuration.setAllowedHeaders(Collections.singletonList("*"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }

    @Bean
    public JwtDecoder jwtDecoder() {
        return NimbusJwtDecoder.withPublicKey(this.publicKey).build();
    }

    @Bean
    public JwtEncoder jwtEncoder() {
        JWK jwk = new RSAKey.Builder(this.publicKey).privateKey(this.privateKey).build();
        var jwks = new ImmutableJWKSet<>(new JWKSet(Collections.singletonList(jwk)));
        return new NimbusJwtEncoder(jwks);
    }

    @Bean
    public BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
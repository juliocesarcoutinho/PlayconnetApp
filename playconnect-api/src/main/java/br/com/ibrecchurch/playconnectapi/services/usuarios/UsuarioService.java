package br.com.ibrecchurch.playconnectapi.services.usuarios;

import br.com.ibrecchurch.playconnectapi.config.EmailService;
import br.com.ibrecchurch.playconnectapi.config.PasswordGenerator;
import br.com.ibrecchurch.playconnectapi.dto.usuario.RoleDTO;
import br.com.ibrecchurch.playconnectapi.dto.usuario.UsuarioCompletoDTO;
import br.com.ibrecchurch.playconnectapi.dto.usuario.UsuarioDTO;
import br.com.ibrecchurch.playconnectapi.entities.Usuario;
import br.com.ibrecchurch.playconnectapi.repositories.RoleRepository;
import br.com.ibrecchurch.playconnectapi.repositories.UsuarioRepository;
import br.com.ibrecchurch.playconnectapi.services.exceptions.DataBaseException;
import br.com.ibrecchurch.playconnectapi.services.exceptions.InvalidEmailException;
import br.com.ibrecchurch.playconnectapi.services.exceptions.ResourceNotFoundException;
import br.com.ibrecchurch.playconnectapi.util.Capitalizer;
import jakarta.mail.MessagingException;
import jakarta.mail.SendFailedException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.BeanUtils;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.mail.MailSendException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;

@Service
public class UsuarioService {

    private static final Logger logger = LoggerFactory.getLogger(UsuarioService.class);

    private final UsuarioRepository repository;
    private final RoleRepository roleRepository;
    private final BCryptPasswordEncoder passwordEncoder;
    private final EmailService emailService;
    private final UsuarioRepository usuarioRepository;

    public UsuarioService(UsuarioRepository repository, RoleRepository roleRepository, BCryptPasswordEncoder passwordEncoder, EmailService emailService, UsuarioRepository usuarioRepository) {
        this.repository = repository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
        this.emailService = emailService;
        this.usuarioRepository = usuarioRepository;
    }

    // Lista paginada de usuários com roles carregadas
    @Transactional(readOnly = true)
    public Page<UsuarioDTO> findAll(Pageable pageable) {
        // Passo 1: Buscar IDs paginados
        Page<Usuario> pagedResult = repository.findAll(pageable);

        // Passo 2: Carregar os usuários com roles usando os IDs
        List<Long> ids = pagedResult.map(Usuario::getId).getContent();
        List<Usuario> usuariosWithRoles = repository.findAllWithRolesByIds(ids);

        // Retornar o resultado como Page<UsuarioDTO>
        return new PageImpl<>(usuariosWithRoles, pageable, pagedResult.getTotalElements())
                .map(UsuarioDTO::new);
    }

    //Buscar usuário por id
    @Transactional(readOnly = true)
    public UsuarioDTO buscar(Long id) {
        Usuario usuario = repository.findById(id).orElseThrow(() ->
                new ResourceNotFoundException("Usuário não encontrado com id: " + id));
        return new UsuarioDTO(usuario, usuario.getRoles());
    }

    //Inserir usuário
    @Transactional
    public UsuarioDTO inserir(UsuarioCompletoDTO dto) {
        Usuario entity = new Usuario();
        copyDtoToEntity(dto, entity);
        entity.setNome(Capitalizer.capitalizeWords(entity.getNome()));
        entity = repository.save(entity);

        // Enviar e-mail de boas-vindas
        try {
            emailService.sendWelcomeEmail(entity.getEmail(), entity.getNome(), entity.getEmail(), dto.senha());
        } catch (MailSendException e) {
            Throwable cause = e.getCause();
            if (cause instanceof SendFailedException) {
                logger.error("Falha ao enviar e-mail de acesso", e);
                throw new InvalidEmailException("Falha ao enviar e-mail. O endereço de e-mail é inválido ou a caixa de correio não existe.", e);
            } else {
                logger.error("Erro de mensagem ao enviar e-mail de acesso", e);
                throw new InvalidEmailException("Falha ao enviar e-mail. Verifique as configurações de e-mail e tente novamente.", e);
            }
        } catch (MessagingException e) {
            throw new RuntimeException(e);
        }

        return new UsuarioDTO(entity, entity.getRoles());
    }

    //Atualizar usuário
    @Transactional
    public UsuarioDTO atualizar(Long id, UsuarioCompletoDTO dto) {
        Usuario usuario = repository.findById(id).orElseThrow(() ->
                new ResourceNotFoundException("Usuário não encontrado com id: " + id));
        usuario.getRoles().clear();
        copyDtoToEntity(dto, usuario);
        usuario.setNome(Capitalizer.capitalizeWords(dto.nome()));
        usuario = repository.save(usuario);
        return new UsuarioDTO(usuario, usuario.getRoles());
    }
    
    //Deletar usuário
    @Transactional
    public void deletar(Long id) {
        Usuario usuario = repository.findById(id).orElseThrow(() ->
                new ResourceNotFoundException("Usuário não encontrado com id: " + id));
        try {

            usuario.getRoles().clear();
            repository.save(usuario);

            repository.delete(usuario);
        } catch (DataIntegrityViolationException e) {
            throw new DataBaseException("Violação de integridade de dados");
        }
    }

    /*Metodo para recuperar senha*/
    @Transactional
    public void recoveryPassword(String email) {
        Usuario usuario = repository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Email não encontrado no sistema: " + email));
        String novaPassword = gerarNovaSenha();
        usuario.setSenha(passwordEncoder.encode(novaPassword));
        repository.save(usuario);

        try {
            emailService.recoveryEmailAcess(usuario.getEmail(), usuario.getNome(), novaPassword);
        } catch (MailSendException e) {
            Throwable cause = e.getCause();
            if (cause instanceof SendFailedException) {
                logger.error("Falha ao enviar e-mail de recuperação de senha", e);
                throw new InvalidEmailException("Falha ao enviar e-mail. O endereço de e-mail é inválido ou a caixa de correio não existe.", e);
            } else {
                logger.error("Erro de mensagem ao enviar e-mail de recuperação de senha", e);
                throw new InvalidEmailException("Falha ao enviar e-mail. Verifique as configurações de e-mail e tente novamente.", e);
            }
        } catch (MessagingException e) {
            throw new RuntimeException(e);
        }
    }

    //Copiar dados do DTO para a entidade
    private void copyDtoToEntity(UsuarioCompletoDTO dto, Usuario entity) {
        BeanUtils.copyProperties(dto, entity, "id", "roles", "senha");
        if (entity.getRoles() == null) {
            entity.setRoles(new HashSet<>());
        }
        entity.getRoles().clear();
        for (RoleDTO roleDto : dto.roles()) {
            var role = roleRepository.findById(roleDto.id())
                    .orElseThrow(() -> new ResourceNotFoundException("Função não encontrada com ID: " + roleDto.id()));
            entity.getRoles().add(role);
        }
        if (dto.senha() != null && !dto.senha().isEmpty()) {
            entity.setSenha(passwordEncoder.encode(dto.senha()));
        }
    }

    private String gerarNovaSenha() {
        return PasswordGenerator.generateSecurePassword();
    }


}

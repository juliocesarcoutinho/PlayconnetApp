package br.com.ibrecchurch.playconnectapi.services.usuarios;

import br.com.ibrecchurch.playconnectapi.config.EmailService;
import br.com.ibrecchurch.playconnectapi.config.PasswordGenerator;
import br.com.ibrecchurch.playconnectapi.dto.pessoa.PessoaDTO;
import br.com.ibrecchurch.playconnectapi.dto.usuario.RoleDTO;
import br.com.ibrecchurch.playconnectapi.dto.usuario.UsuarioCompletoDTO;
import br.com.ibrecchurch.playconnectapi.dto.usuario.UsuarioDTO;
import br.com.ibrecchurch.playconnectapi.dto.usuario.UsuarioPessoaDTO;
import br.com.ibrecchurch.playconnectapi.entities.Pessoa;
import br.com.ibrecchurch.playconnectapi.entities.Role;
import br.com.ibrecchurch.playconnectapi.entities.Usuario;
import br.com.ibrecchurch.playconnectapi.mappers.PessoaMappers;
import br.com.ibrecchurch.playconnectapi.repositories.PessoaRepository;
import br.com.ibrecchurch.playconnectapi.repositories.RoleRepository;
import br.com.ibrecchurch.playconnectapi.repositories.UsuarioRepository;
import br.com.ibrecchurch.playconnectapi.services.exceptions.DataBaseException;
import br.com.ibrecchurch.playconnectapi.services.exceptions.InvalidEmailException;
import br.com.ibrecchurch.playconnectapi.services.exceptions.ResourceNotFoundException;
import br.com.ibrecchurch.playconnectapi.util.Capitalizer;
import br.com.ibrecchurch.playconnectapi.util.DateUtils;
import jakarta.mail.MessagingException;
import jakarta.mail.SendFailedException;
import jakarta.persistence.EntityNotFoundException;
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

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class UsuarioService {

    private static final Logger logger = LoggerFactory.getLogger(UsuarioService.class);

    private final UsuarioRepository repository;
    private final RoleRepository roleRepository;
    private final BCryptPasswordEncoder passwordEncoder;
    private final EmailService emailService;

    private final PessoaRepository pessoaRepository;
    private final UsuarioRepository usuarioRepository;

    private PessoaMappers pessoaMapper;

    public UsuarioService(UsuarioRepository repository, RoleRepository roleRepository,
                          BCryptPasswordEncoder passwordEncoder, EmailService emailService,
                          PessoaRepository pessoaRepository, UsuarioRepository usuarioRepository,
                          PessoaMappers pessoaMapper) {
        this.repository = repository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
        this.emailService = emailService;
        this.pessoaRepository = pessoaRepository;
        this.usuarioRepository = usuarioRepository;
        this.pessoaMapper = pessoaMapper;
    }

    @Transactional(readOnly = true)
    public Page<UsuarioDTO> findAll(Pageable pageable) {
        Page<Usuario> pagedResult = repository.findAll(pageable);
        List<Long> ids = pagedResult.map(Usuario::getId).getContent();
        List<Usuario> usuariosWithRoles = repository.findAllWithRolesByIds(ids);
        return new PageImpl<>(usuariosWithRoles, pageable, pagedResult.getTotalElements())
                .map(UsuarioDTO::new);
    }

    @Transactional(readOnly = true)
    public UsuarioDTO buscar(Long id) {
        Usuario usuario = repository.findById(id).orElseThrow(() ->
                new ResourceNotFoundException("Usuário não encontrado com id: " + id));
        return new UsuarioDTO(usuario, usuario.getRoles());
    }

    @Transactional
    public UsuarioDTO inserir(UsuarioCompletoDTO dto) {
        Usuario entity = new Usuario();
        copyDtoToEntity(dto, entity);
        entity.setNome(Capitalizer.capitalizeWords(entity.getNome()));

        if (entity.getAtivo() == null) {
            entity.setAtivo(true);
        } else {
            entity.setAtivo(entity.getAtivo());
        }
        entity = repository.save(entity);

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

        if (usuario.getAtivo() == null) {
            usuario.setAtivo(true);
        } else {
            usuario.setAtivo(usuario.getAtivo());
        }

        usuario = repository.save(usuario);
        return new UsuarioDTO(usuario, usuario.getRoles());
    }

    //atualizar dados com a pessoa
    @Transactional
    public UsuarioPessoaDTO atualizarPessoa(Long id, PessoaDTO dto) {
        Usuario usuario = repository.findById(id).orElseThrow(() ->
                new ResourceNotFoundException("Usuário não encontrado com id: " + id));

        var pessoa = getPessoa(dto, usuario);

        usuario.setPessoa(pessoa);
        usuarioRepository.save(usuario);
        return new UsuarioPessoaDTO(usuario, dto);
    }

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

    private void copyDtoToEntity(UsuarioCompletoDTO dto, Usuario entity) {
        BeanUtils.copyProperties(dto, entity, "id", "roles", "senha");
        if (entity.getRoles() == null) {
            entity.setRoles(new HashSet<>());
        }
        entity.getRoles().clear();
        for (RoleDTO roleDto : dto.roles()) {
            Role role = roleRepository.findById(roleDto.id())
                    .orElseThrow(() -> new ResourceNotFoundException("Função não encontrada com ID: " + roleDto.id()));
            entity.getRoles().add(role);
        }
        if (dto.senha() != null && !dto.senha().isEmpty()) {
            entity.setSenha(passwordEncoder.encode(dto.senha()));
        }
    }

    private Pessoa getPessoa(PessoaDTO dto, Usuario usuario) {
        // Se a pessoa já existe, recarregue ela da base de dados para garantir que o controle de versão seja mantido.
        var pessoa = usuario.getPessoa();
        if (pessoa == null) {
            pessoa = new Pessoa();
        } else {
            // Recarregue a pessoa da base de dados para garantir que a versão esteja inicializada
            pessoa = pessoaRepository.findById(pessoa.getId())
                    .orElseThrow(() -> new EntityNotFoundException("Pessoa não encontrada"));
        }

        // Atualize os campos da pessoa
        pessoa.setNome(usuario.getNome());
        pessoa.setRg(dto.rg());
        pessoa.setCpf(dto.cpf());
        pessoa.setEndereco(dto.endereco());
        pessoa.setNomePai(dto.nomePai());
        pessoa.setNomeMae(dto.nomeMae());
        pessoa.setDataNascimento(dto.dataNascimento());

        pessoaRepository.save(pessoa);
        return pessoa;
    }

    @Transactional(readOnly = true)
    public Page<UsuarioPessoaDTO> findAllWithPessoa(Pageable pageable) {
        Page<Usuario> pagedResult = repository.findAll(pageable);
        List<UsuarioPessoaDTO> usuarioPessoaDTOs = getUsuarioPessoaDTOS(pagedResult);
        return new PageImpl<>(usuarioPessoaDTOs, pageable, pagedResult.getTotalElements());
    }

    // Busca Usuario com dados da pessoa por id
    @Transactional(readOnly = true)
    public UsuarioPessoaDTO findByIdWithPessoa(Long id) {
        Usuario usuario = repository.findById(id).orElseThrow(() ->
                new ResourceNotFoundException("Usuário não encontrado com id: " + id));
        PessoaDTO pessoaDTO = usuario.getPessoa() != null ? pessoaMapper.toDTO(usuario.getPessoa()) : null;
        return new UsuarioPessoaDTO(usuario, pessoaDTO);
    }

    private String gerarNovaSenha() {
        return PasswordGenerator.generateSecurePassword();
    }

    private List<UsuarioPessoaDTO> getUsuarioPessoaDTOS(Page<Usuario> pagedResult) {
        List<UsuarioPessoaDTO> usuarioPessoaDTOs = pagedResult.stream()
                .map(usuario -> new UsuarioPessoaDTO(
                        usuario.getId(),
                        usuario.getNome(),
                        usuario.getEmail(),
                        usuario.getCelular(),
                        usuario.getAtivo() ? "Ativo" : "Inativo",
                        DateUtils.formatData(usuario.getDataCadastro().toLocalDateTime()),
                        usuario.getDataAlteracao().toString(),
                        usuario.getPessoa() != null ? pessoaMapper.toDTO(usuario.getPessoa()) : null
                ))
                .collect(Collectors.toList());
        return usuarioPessoaDTOs;
    }
}
CREATE TABLE `role`
(
    id               BIGINT AUTO_INCREMENT NOT NULL,
    descricao        VARCHAR(255) NULL,
    data_cadastro    TIMESTAMP NULL,
    data_atualizacao TIMESTAMP NULL,
    tipo_usuario     VARCHAR(255) NULL,
    CONSTRAINT pk_role PRIMARY KEY (id)
);

CREATE TABLE usuario
(
    id              BIGINT AUTO_INCREMENT NOT NULL,
    nome            VARCHAR(255) NULL,
    email           VARCHAR(255) NULL,
    senha           VARCHAR(255) NULL,
    celular         VARCHAR(255) NULL,
    data_nascimento date NULL,
    data_cadastro   TIMESTAMP NULL,
    data_alteracao  TIMESTAMP NULL,
    cep             VARCHAR(8) NULL,
    logradouro      VARCHAR(200) NULL,
    numero          VARCHAR(10) NULL,
    complemento     VARCHAR(200) NULL,
    bairro          VARCHAR(200) NULL,
    cidade          VARCHAR(200) NULL,
    estado          VARCHAR(2) NULL,
    CONSTRAINT pk_usuario PRIMARY KEY (id)
);

CREATE TABLE usuario_roles
(
    role_id    BIGINT NOT NULL,
    usuario_id BIGINT NOT NULL,
    CONSTRAINT pk_usuario_roles PRIMARY KEY (role_id, usuario_id)
);

ALTER TABLE usuario_roles
    ADD CONSTRAINT fk_usurol_on_role FOREIGN KEY (role_id) REFERENCES `role` (id);

ALTER TABLE usuario_roles
    ADD CONSTRAINT fk_usurol_on_usuario FOREIGN KEY (usuario_id) REFERENCES usuario (id);
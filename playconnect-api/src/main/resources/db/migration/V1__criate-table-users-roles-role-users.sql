CREATE TABLE `role`
(
    id               BIGINT AUTO_INCREMENT NOT NULL,
    descricao        VARCHAR(255) NULL,
    data_cadastro    TIMESTAMP NULL,
    data_atualizacao TIMESTAMP NULL,
    tipo_usuario     VARCHAR(255) NULL,
    CONSTRAINT pk_role PRIMARY KEY (id)
);

CREATE TABLE pessoa
(
    id               BIGINT AUTO_INCREMENT NOT NULL,
    nome             VARCHAR(255) NOT NULL,
    cpf              VARCHAR(14) NULL,
    rg               VARCHAR(20) NULL,
    data_nascimento  DATE NULL,
    nome_pai         VARCHAR(255) NULL,
    nome_mae         VARCHAR(255) NULL,
    cep              VARCHAR(8) NULL,
    logradouro       VARCHAR(200) NULL,
    numero           VARCHAR(10) NULL,
    complemento      VARCHAR(200) NULL,
    bairro           VARCHAR(200) NULL,
    cidade           VARCHAR(200) NULL,
    estado           VARCHAR(2) NULL,
    versao           BIGINT NULL,
    CONSTRAINT pk_pessoa PRIMARY KEY (id)
);

CREATE TABLE usuario
(
    id              BIGINT AUTO_INCREMENT NOT NULL,
    nome            VARCHAR(200) NOT NULL,
    email           VARCHAR(160) NULL UNIQUE NOT NULL,
    senha           VARCHAR(255) NOT NULL,
    ativo           BOOLEAN NOT NULL,
    celular         VARCHAR(14) DEFAULT NULL,
    data_cadastro   TIMESTAMP NULL,
    data_alteracao  TIMESTAMP NULL,
    pessoa_id       BIGINT,
    CONSTRAINT pk_usuario PRIMARY KEY (id),
    CONSTRAINT fk_usuario_pessoa FOREIGN KEY (pessoa_id) REFERENCES pessoa(id)
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
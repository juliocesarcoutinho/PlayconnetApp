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
    nome            VARCHAR(200) NOT NULL,
    email           VARCHAR(160) NULL UNIQUE NOT NULL ,
    senha           VARCHAR(255) NOT NULL,
    ativo           BOOLEAN DEFAULT TRUE,
    celular         VARCHAR(14) DEFAULT NULL,
    data_nascimento date NULL,
    data_cadastro   TIMESTAMP NULL,
    data_alteracao  TIMESTAMP NULL,
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
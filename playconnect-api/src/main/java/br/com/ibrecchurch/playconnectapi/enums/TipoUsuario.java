package br.com.ibrecchurch.playconnectapi.enums;

public enum TipoUsuario {
    ADMINISTRADOR ("Administrador"),
    USUARIO ("Usuário");

    public static TipoUsuario fromString(String tipoUsuario) {
        for (TipoUsuario tipo : TipoUsuario.values()) {
            if (tipo.name().equalsIgnoreCase(tipoUsuario)) {
                return tipo;
            }
        }
        return null;
    }

    private String descricao;

    TipoUsuario(String descricao) {
        this.descricao = descricao;
    }
}

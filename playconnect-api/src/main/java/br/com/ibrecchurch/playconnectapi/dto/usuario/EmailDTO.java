package br.com.ibrecchurch.playconnectapi.dto.usuario;

import br.com.ibrecchurch.playconnectapi.validation.ValidEmailDomain;
import jakarta.validation.constraints.NotBlank;

public record EmailDTO(@NotBlank @ValidEmailDomain String email) {
}

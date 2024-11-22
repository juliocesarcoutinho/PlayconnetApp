package br.com.ibrecchurch.playconnectapi.resources;

import br.com.ibrecchurch.playconnectapi.dto.api.CepDTO;
import br.com.ibrecchurch.playconnectapi.services.api.CepService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/ceps")
public class CepResource {

    private final CepService cepService;

    public CepResource(CepService cepService) {
        this.cepService = cepService;
    }

    @GetMapping("/{cep}")
    public ResponseEntity<CepDTO> buscarCep(@PathVariable String cep) {
        CepDTO cepDTO = cepService.consultaCep(cep);
        return ResponseEntity.ok(cepDTO);
    }

}

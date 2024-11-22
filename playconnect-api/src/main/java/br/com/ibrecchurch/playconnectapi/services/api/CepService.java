package br.com.ibrecchurch.playconnectapi.services.api;

import br.com.ibrecchurch.playconnectapi.dto.api.CepDTO;
import br.com.ibrecchurch.playconnectapi.services.exceptions.cep.CepNotFoundException;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

@Service
public class CepService {

    @Value("${cnpja.api.url}")
    private String apiUrl;

    @Value("${cnpja.api.token}")
    private String apiToken;

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    public CepService(RestTemplate restTemplate, ObjectMapper objectMapper) {
        this.restTemplate = restTemplate;
        this.objectMapper = objectMapper;
    }

        public CepDTO consultaCep(String cep) {
            String url = apiUrl + "/zip/" + cep;

            HttpHeaders headers = new HttpHeaders();
            headers.set("Authorization", apiToken);

            HttpEntity<String> entity = new HttpEntity<>(headers);

            try {
                ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.GET, entity, String.class);

                // Verifica se a resposta é bem-sucedida
                if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                    JsonNode rootNode = objectMapper.readTree(response.getBody());

                    String ultimaAtualizacao = rootNode.path("updated").asText();
                    String codigoCep = rootNode.path("code").asText();
                    long codigoMunicipio = rootNode.path("municipality").asLong();
                    String numero = rootNode.path("number").asText();
                    String bairro = rootNode.path("district").asText();
                    String cidade = rootNode.path("city").asText();
                    String estado = rootNode.path("state").asText();

                    return new CepDTO(ultimaAtualizacao, codigoCep, codigoMunicipio, numero, bairro, cidade, estado);
                } else {
                    throw new RuntimeException("Erro desconhecido ao consultar o CEP.");
                }
            } catch (HttpClientErrorException ex) {
                if (ex.getStatusCode() == HttpStatus.NOT_FOUND) {

                    try {
                        JsonNode errorNode = objectMapper.readTree(ex.getResponseBodyAsString());
                        String message = errorNode.path("message").asText();
                        throw new CepNotFoundException(message);
                    } catch (JsonProcessingException e) {
                        throw new RuntimeException("Erro ao processar mensagem de erro da API de CEP.", e);
                    }
                } else {
                    throw new RuntimeException("Erro ao consultar o CEP: " + ex.getMessage(), ex);
                }
            } catch (JsonProcessingException e) {
                throw new RuntimeException("Erro ao processar resposta da API de CEP.", e);
            }
        }

}
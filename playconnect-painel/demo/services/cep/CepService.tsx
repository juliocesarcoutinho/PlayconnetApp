import axios from 'axios';
import config from '../../config/config';

interface Cep {
    cep: string;
    cidade: string;
    bairro: string;
    logradouro: string;
    estado: string;
    complemento: string;
}

// Criação da instância do Axios com a configuração da baseURL
const api = axios.create({
    baseURL: config.API_BASE_URL
});

// Interceptor para adicionar o token de autorização nas requisições
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem(CepService.CHAVE_TOKEN);
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export const CepService = {
    CHAVE_TOKEN: 'authToken',

    // Método para buscar endereço pelo CEP
    async getEnderecoByCep(cep: string): Promise<{ success: boolean; data?: Cep | null; message?: string }> {
        try {
            const response = await api.get<Cep>(`/ceps/${cep}`);
            return {success: true, data: response.data};
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Erro ao buscar endereço.';
            return {success: false, message: errorMessage};
        }
    }
};

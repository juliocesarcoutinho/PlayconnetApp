import config from "@/config/config";
import axios from "axios";

interface Role {
    id: number;
    descricao: string;
    tipoUsuario: string;
}

export interface Usuario {
    id: number;
    nome: string;
    email: string;
    celular: string | null;
    dataCadastro: string;
    dataAtualizacao: string;
    roles: { id: number; descricao: string; tipoUsuario: string }[];
}


export interface PaginatedResponse<T> {
    content: T[];
    totalPages: number;
    totalElements: number;
    number: number;
    size: number;
    first: boolean;
    last: boolean;
    empty: boolean;
}

const api = axios.create({
    baseURL: config.API_BASE_URL,
});

// Interceptor para adicionar o token de autorização nas requisições
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem(UsuarioService.CHAVE_TOKEN);
        console.log("Token:", token);
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export const UsuarioService = {
    CHAVE_TOKEN: 'auth-token',

    async getUsuarios(page = 0, size = 12): Promise<PaginatedResponse<Usuario>> {
        try {
            const response = await api.get(`/usuarios?page=${page}&size=${size}`);
            console.log('Resposta da API:', response.data);
            return response.data; // Retorna a estrutura completa da API
        } catch (error) {
            console.error('Erro ao buscar usuários:', error);
            throw new Error('Erro ao buscar usuários. Verifique sua conexão ou tente novamente.');
        }
    },
};


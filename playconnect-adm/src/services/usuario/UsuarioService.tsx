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
    senha: string;
    celular: string | null;
    dataCadastro: string;
    dataAtualizacao: string;
    roles: { id: number; descricao: string; tipoUsuario: string }[] | null;
    endereco: {
        cep: string;
        logradouro: string;
        numero: string;
        complemento: string;
        bairro: string;
        cidade: string;
        estado: string;
    }
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

    //Buscar usuário por ID
    async getUsuarioById(id: number): Promise<Usuario | null> {
        try {
            const response = await api.get(`/usuarios/${id}`);
            return response.data;
        } catch (error) {
            console.error('Erro ao buscar usuário:', error);
            return null;
        }
    },

    // criar usuário
    async createUsuario(usuario: Usuario): Promise<{ success: boolean; message?: string }> {
        try {
            await api.post('/usuarios', usuario);
            return {success: true};
        } catch (error: any) {
            console.error('Erro ao criar usuário:', error);
            let errorMessage = 'Erro ao criar o usuário.';
            if (error.response?.status === 400 && error.response?.data) {
                const validationErrors = error.response.data;
                errorMessage = Object.values(validationErrors).join(', ');
            } else {
                errorMessage = error.response?.data?.message || errorMessage;
            }

            return {success: false, message: errorMessage};
        }
    },

    // editar usuario
    async editUsuario(usuario: Usuario): Promise<{ success: boolean; message?: string }> {
        try {
            await api.put(`/usuarios/${usuario.id}`, usuario);
            return {success: true};
        } catch (error: any) {
            console.error('Erro ao editar usuário:', error);
            let errorMessage = 'Erro ao atualizar o usuário.';
            if (error.response?.status === 400 && error.response?.data) {
                const validationErrors = error.response.data;
                errorMessage = Object.values(validationErrors).join(', ');
            } else {
                errorMessage = error.response?.data?.message || errorMessage;
            }

            return {success: false, message: errorMessage};
        }
    },

    // deletar usuario
    async deleteUsuario(id: number): Promise<{ success: boolean; message?: string }> {
        try {
            await api.delete(`/usuarios/${id}`);
            return {success: true};
        } catch (error: any) {
            console.error('Erro ao deletar usuário:', error);
            let errorMessage = 'Erro ao deletar o usuário.';
            if (error.response?.status === 400 && error.response?.data) {
                const validationErrors = error.response.data;
                errorMessage = Object.values(validationErrors).join(', ');
            } else {
                errorMessage = error.response?.data?.message || errorMessage;
            }

            return {success: false, message: errorMessage};
        }
    },

    // buscar roles
    async getRoles(): Promise<Role[]> {
        try {
            const response = await api.get('/roles');
            return response.data;
        } catch (error) {
            console.error('Erro ao buscar roles:', error);
            return [];
        }
    }
};


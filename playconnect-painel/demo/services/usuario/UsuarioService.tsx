import axios from 'axios';
import config from '../../config/config';
import UsuarioPessoa = Demo.UsuarioPessoa;

interface Role {
    id: number;
    descricao: string;
    tipoUsuario: string;
}

interface Usuario {
    id?: number;
    nome: string;
    email: string;
    ativo: boolean;
    celular: string;
    dataCadastro: string;
    dataAtualizacao: string;
    roles: Role[];
}


// Criação da instância do Axios com a configuração da baseURL
const api = axios.create({
    baseURL: config.API_BASE_URL
});

// Interceptor para adicionar o token de autorização nas requisições
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem(UsuarioService.CHAVE_TOKEN);
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Definição do serviço de usuário
export const UsuarioService = {
    CHAVE_TOKEN: 'authToken',

    // Método para buscar a lista de usuários
    async getUsuarios(page = 0, size = 12): Promise<Usuario[]> {
        try {
            const response = await api.get(`/usuarios?page=${page}&size=${size}`);
            const usuarios = response.data.content.map((usuario: Usuario) => ({
                ...usuario,
                ativo: typeof usuario.ativo === 'string' ? usuario.ativo === 'Sim' : usuario.ativo
            }));


            return usuarios;
        } catch (error) {
            console.error('Erro na API:', error);
            return [];
        }
    },

    // Método para deletar um usuário
    async deleteUsuario(id: number): Promise<boolean> {
        try {
            await api.delete(`/usuarios/${id}`);
            return true;
        } catch (error) {
            console.error('Erro ao deletar usuário:', error);
            return false;
        }
    },

    // Método para editar um usuário
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

    // Método para criar um usuário
    async createUsuario(usuario: {
        senha: string;
        celular: string;
        ativo: boolean;
        dataAtualizacao: string;
        roles: { nome: string; id: number }[];
        nome: string;
        dataCadastro: string;
        email: string
    }): Promise<{ success: boolean; message?: string }> {
        try {
            await api.post('/usuarios', usuario);
            return {success: true};
        } catch (error: any) {
            console.error('Erro ao criar usuário:', error);
            let errorMessage = 'Erro ao salvar o usuário.';
            if (error.response?.status === 400 && error.response?.data) {
                const validationErrors = error.response.data;
                errorMessage = Object.values(validationErrors).join(', ');
            } else {
                errorMessage = error.response?.data?.message || errorMessage;
            }
            return {success: false, message: errorMessage};
        }
    },

    //Método de buscar por id
    async getUsuarioById(id: number): Promise<Usuario | null> {
        try {
            const response = await api.get(`/usuarios/${id}`);
            const usuario = response.data;
            return {
                ...usuario,
                ativo: typeof usuario.ativo === 'string' ? usuario.ativo === 'Sim' : usuario.ativo
            };
        } catch (error) {
            console.error('Erro ao buscar usuário por id:', error);
            return null;
        }
    },

    //Metodo que busca Usuario com dados da pessoa
    async getUsuarioPessoa(page = 0, size = 12): Promise<UsuarioPessoa[]> {
        try {
            const response = await api.get(`/usuarios/adolecentes?page=${page}&size=${size}`);
            const usuarios = response.data.content.map((usuario: Usuario) => ({
                ...usuario,
                ativo: typeof usuario.ativo === 'string' ? usuario.ativo === 'Sim' : usuario.ativo
            }));


            return usuarios;
        } catch (error) {
            console.error('Erro na API:', error);
            return [];
        }
    },

    // Método que busca Usuario com dados da pessoa por id
    async getUsuarioPessoaById(id: number): Promise<UsuarioPessoa | null> {
        try {
            const response = await api.get(`/usuarios/adolecentes/${id}`);
            const usuario = response.data;
            console.log(usuario);
            return {
                ...usuario,
                ativo: typeof usuario.ativo === 'string' ? usuario.ativo === 'Sim' : usuario.ativo
            };
        } catch (error) {
            console.error('Erro ao buscar usuário pessoa por id:', error);
            return null;
        }
    },

    // Metodo para editar um usuario pessoa
    async editUsuarioPessoa(usuario: UsuarioPessoa): Promise<{ success: boolean; message?: string }> {
        try {
            await api.put(`/usuarios${usuario.id}/adolecente/`, usuario);
            return {success: true};
        } catch (error: any) {
            console.error('Erro ao editar o cadasttro:', error);
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
};

export default UsuarioService;

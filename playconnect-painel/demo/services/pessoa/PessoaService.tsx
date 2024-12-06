import axios from 'axios';
import config from '../../../../../../Topone/PetSystemTopOne/petsystem-app/demo/config/config';

interface Pessoa {
    id?: number;
    nome: string;
    email: string;
    cpf: string;
    rg: string;
    estadoCivil: string;
    dataNascimento: string;
    sexo: string;
    telefone: string;
    celular: string;
    cep: string;
    cidade: string;
    bairro: string;
    endereco: string;
    uf: string;
    numCasa: string;
    complemento: string;
    dataCadastro: string;
    dataAtualizacao: string;
    tipoPessoa: string;
}

// Criação da instância do Axios com a configuração da baseURL
const api = axios.create({
    baseURL: config.API_BASE_URL
});

// Interceptor para adicionar o token de autorização nas requisições
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem(PessoaService.CHAVE_TOKEN);
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Definição do serviço de pessoa
export const PessoaService = {
    CHAVE_TOKEN: 'authToken',

    // Método para criar um pessoa fisica
    async createClienteFisico(pessoa: Pessoa): Promise<{ success: boolean; data?: any; message?: string }> {
        try {
            const response = await api.post('/pessoas/fisica', pessoa);
            return {success: true, data: response.data};
        } catch (error: any) {
            console.error('Erro ao criar pessoa:', error);

            let errorMessage = 'Erro ao salvar o cliente.';

            // Verificar se é um erro de validação de campo
            if (error.response?.status === 400 && error.response?.data) {
                const validationErrors = error.response.data;
                // Mapear todas as mensagens de erro de validação para exibir no toast
                errorMessage = Object.values(validationErrors).join(', ');
            } else {
                // Caso o erro não seja de validação, pegar a mensagem padrão
                errorMessage = error.response?.data?.message || errorMessage;
            }

            return {success: false, message: errorMessage};
        }
    },

    // Método para criar um pessoa juridica
    async createClienteJuridica(pessoa: Pessoa): Promise<{ success: boolean; data?: any; message?: string }> {
        try {
            const response = await api.post('/pessoas/juridica', pessoa);
            return {success: true, data: response.data};
        } catch (error: any) {
            console.error('Erro ao criar pessoa:', error);

            let errorMessage = 'Erro ao salvar o cliente.';

            // Verificar se é um erro de validação de campo
            if (error.response?.status === 400 && error.response?.data) {
                const validationErrors = error.response.data;
                // Mapear todas as mensagens de erro de validação para exibir no toast
                errorMessage = Object.values(validationErrors).join(', ');
            } else {
                // Caso o erro não seja de validação, pegar a mensagem padrão
                errorMessage = error.response?.data?.message || errorMessage;
            }

            return {success: false, message: errorMessage};
        }
    },

    // Método para buscar a lista de pessoas
    async getPessoas(page = 0, size = 25): Promise<Pessoa[]> {
        try {
            const response = await api.get(`/pessoas/listar?page=${page}&size=${size}`);
            const pessoas = response.data.content.map((pessoa: Pessoa) => ({
                ...pessoa
            }));

            return pessoas;
        } catch (error) {
            console.error('Erro na API:', error);
            return [];
        }
    },

    // Método para buscar a lista de pessoas fisica
    async getPessoasFisica(page = 0, size = 12): Promise<Pessoa[]> {
        try {
            const response = await api.get(`/pessoas/fisica?page=${page}&size=${size}`);
            const pessoas = response.data.content.map((pessoa: Pessoa) => ({
                ...pessoa
            }));

            return pessoas;
        } catch (error) {
            console.error('Erro na API:', error);
            return [];
        }
    },

    // Método para editar um pessoa
    async editPessoa(pessoa: Pessoa): Promise<{ success: boolean; message?: string }> {
        try {
            const endpoint = pessoa.tipoPessoa === 'F'
                ? `/pessoas/fisica/${pessoa.id}`
                : `/pessoas/juridica/${pessoa.id}`;

            await api.put(endpoint, pessoa);
            return {success: true};
        } catch (error: any) {
            console.error('Erro ao editar pessoa:', error);

            let errorMessage = 'Erro ao atualizar o cliente.';

            if (error.response?.status === 400 && error.response?.data) {
                const validationErrors = error.response.data;
                errorMessage = Object.values(validationErrors).join(', ');
            } else {
                errorMessage = error.response?.data?.message || errorMessage;
            }

            return {success: false, message: errorMessage};
        }
    },

    // Método para deletar uma pessoa, física ou jurídica
    async deletePessoa(id: number, tipoPessoa: 'F' | 'J'): Promise<boolean> {
        try {
            const url = tipoPessoa === 'F' ? `/pessoas/fisica/${id}` : `/pessoas/juridica/${id}`;
            await api.delete(url);
            return true;
        } catch (error) {
            console.error('Erro ao deletar pessoa:', error);
            return false;
        }
    },

    //Método de buscar por id
    async getPessoaById(id: number, tipoPessoa: string): Promise<Pessoa | null> {
        try {
            const endpoint = tipoPessoa === 'F' ? `/pessoas/fisica/${id}` : `/pessoas/juridica/${id}`;
            const response = await api.get(endpoint);
            const cliente = response.data;
            return {
                ...cliente,
            };
        } catch (error) {
            console.error('Erro ao buscar cliente por id:', error);
            return null;
        }
    }
};

export default PessoaService;
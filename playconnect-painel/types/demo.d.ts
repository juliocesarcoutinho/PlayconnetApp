type StatusUsuario = 'ATIVO' | 'INATIVO'

declare namespace Demo {

    export interface Role {
        id: number | null;
        descricao: string;
        tipoUsuario: string;
    }

    export interface Usuario {
        id?: number | null;
        nome: string;
        email: string;
        ativo: boolean;
        celular: string;
        dataCadastro: string;
        dataAtualizacao: string;
        roles: {
            id: number
            descricao: string;
            tipoUsuario: string;
        }[];
    }

    export interface UsuarioPessoa {
        id?: number | null;
        nome: string;
        email: string;
        celular: string;
        pessoa: {
            cpf: string;
            rg: string;
            nomeMae: string;
            nomePai: string;
            dataNascimento: string;
            endereco: {
                cep: string;
                logradouro: string;
                complemento: string;
                numero: string;
                cidade: string;
                estado: string;
            }
        }
    }
}


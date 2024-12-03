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

    export interface Pessoa {
        id?: number;
        nome: string;
        nomeRazao: string;
        nomeFantasia: string;
        email: string;
        cpf: string;
        cnpj: string;
        tipoPessoa: string;
        rg: string;
        estadoCivil: string;
        dataNascimento: string;
        sexo: string;
        telefone: string;
        celular: string
        endereco?: {
            complemento: string;
            cep: string;
            numero: string;
            estado: string;
            cidade: string;
            bairro: string;
            logradouro: string;
        }
        dataCadastro: string;
        dataAtualizacao: string;
        razaoSocial: string;
        inscricaoEstadual: string;
        inscricaoMunicipal: string;
        dataAbertura: string;
    }
}


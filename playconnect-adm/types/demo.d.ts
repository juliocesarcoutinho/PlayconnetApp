declare namespace Demo {
    interface Task {
        id?: number;
        name?: string;
        description?: string;
        completed?: boolean;
        status?: string;
        comments?: string;
        attachments?: string;
        members?: Member[];
        startDate?: string;
        endDate?: string;
    }

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
        telefone: string;
        dataCadastro: string;
        dataAtualizacao: string;
        roles: {
            id: number
            descricao: string;
            tipoUsuario: string;
        }[];
    }

}

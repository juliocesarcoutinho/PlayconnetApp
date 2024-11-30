import React, {useEffect, useState} from "react";
import DataTable from "react-data-table-component";
import {Usuario, UsuarioService} from "@/services/usuario/UsuarioService";

export default function DataTableUsuarios() {
    const [usuarios, setUsuarios] = useState<Usuario[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [totalRows, setTotalRows] = useState<number>(0);
    const [page, setPage] = useState<number>(0);
    const [perPage] = useState<number>(12); // Tamanho da página

    const fetchUsuarios = async (pageNumber: number = 0) => {
        setLoading(true);
        try {
            const response = await UsuarioService.getUsuarios(pageNumber, perPage);
            console.log('Dados recebidos:', response); // Log para depuração

            // Popula os dados da tabela e total de registros
            if (response.content && Array.isArray(response.content)) {
                setUsuarios(response.content); // Array de usuários
                setTotalRows(response.totalElements); // Número total de registros
            } else {
                console.error('Formato inesperado da resposta:', response);
            }
        } catch (error) {
            console.error('Erro ao carregar usuários:', error);
        } finally {
            setLoading(false);
        }
    };


    // Carregar usuários na mudança de página
    useEffect(() => {
        fetchUsuarios(page);
    }, [page]);

    const handlePageChange = (pageNumber: number) => {
        setPage(pageNumber - 1);
    };

    const columns = [
        {name: "Nome", selector: (row: Usuario) => row.nome, sortable: true},
        {name: "Email", selector: (row: Usuario) => row.email, sortable: true},
        {name: "Celular", selector: (row: Usuario) => row.celular || "Não informado", sortable: true},
        {name: "Data de Cadastro", selector: (row: Usuario) => row.dataCadastro, sortable: true},
        {name: "Data de Atualização", selector: (row: Usuario) => row.dataAtualizacao, sortable: true},
    ];

    return (
        <div className="w-full bg-white shadow-md rounded-lg p-4">
            <DataTable
                title="Usuários"
                columns={columns}
                data={usuarios}
                progressPending={loading}
                pagination
                paginationServer
                paginationTotalRows={totalRows}
                paginationDefaultPage={page + 1}
                onChangePage={handlePageChange}
                highlightOnHover
                pointerOnHover
                noDataComponent="Nenhum usuário encontrado."
            />
        </div>
    );
}

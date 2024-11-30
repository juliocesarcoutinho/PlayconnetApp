import React, {useEffect, useState} from "react";
import DataTable from "react-data-table-component";
import {Usuario, UsuarioService} from "@/services/usuario/UsuarioService";
import {FaEdit, FaTrash} from "react-icons/fa";
import toast from "react-hot-toast";
import EditarUsuarioDialog from "./EditarUsuarioDialog";

export default function DataTableUsuarios() {
    const [usuarios, setUsuarios] = useState<Usuario[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [totalRows, setTotalRows] = useState<number>(0);
    const [page, setPage] = useState<number>(0);
    const [perPage] = useState<number>(12);
    const [editarUsuarioDialog, setEditarUsuarioDialog] = useState<boolean>(false);
    const [usuarioEditar, setUsuarioEditar] = useState<Usuario | null>(null);

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

    const handleEdit = async (usuario: Usuario) => {
        // Lógica para editar o usuário
        if (usuario.id) {
            try {
                const usuarioEncontrado = await UsuarioService.getUsuarioById(usuario.id);
                if (usuarioEncontrado) {
                    setUsuarioEditar(usuarioEncontrado);
                    setEditarUsuarioDialog(true);
                }
            } catch (error) {
                console.error('Erro ao buscar usuario para edição:', error);
                toast.error('Não foi possível carregar os dados do usuario para edição', {
                    duration: 3000,
                });
            }
        }
        console.log("Editar usuário:", usuario);
    };

    const handleDelete = (usuario: Usuario) => {
        // Lógica para deletar o usuário
        console.log("Deletar usuário:", usuario);
    };


    const handleSave = async (usuario: Usuario) => {
        try {
            await UsuarioService.editUsuario(usuario);
            fetchUsuarios(page);
        } catch (error) {
            console.error("Erro ao atualizar usuário:", error);
            toast.error("Erro ao atualizar usuário.");
        }
    }

    const columns = [
        {name: "Nome", selector: (row: Usuario) => row.nome, sortable: true},
        {name: "Email", selector: (row: Usuario) => row.email, sortable: true},
        {name: "Celular", selector: (row: Usuario) => row.celular || "Não informado", sortable: true},
        {name: "Data de Cadastro", selector: (row: Usuario) => row.dataCadastro, sortable: true},
        {name: "Data de Atualização", selector: (row: Usuario) => row.dataAtualizacao, sortable: true},
        {
            name: "Ações",
            cell: (row: Usuario) => (
                <div className="flex gap-4">
                    <button onClick={() => handleEdit(row)}
                            className="text-blue-500 hover:text-blue-700 p-2 rounded-full border border-blue-500">
                        <FaEdit/>
                    </button>
                    <button onClick={() => handleDelete(row)}
                            className="text-red-500 hover:text-red-700 p-2 rounded-full border border-red-500">
                        <FaTrash/>
                    </button>
                </div>
            ),
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
        },
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
            <EditarUsuarioDialog
                isOpen={editarUsuarioDialog}
                onClose={() => setEditarUsuarioDialog(false)}
                usuario={usuarioEditar}
                onSave={handleSave}
            />
        </div>
    );
}
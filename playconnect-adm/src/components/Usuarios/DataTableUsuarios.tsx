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
    const [perPage, setPerPage] = useState<number>(12);
    const [editarUsuarioDialog, setEditarUsuarioDialog] = useState<boolean>(false);
    const [usuarioEditar, setUsuarioEditar] = useState<Usuario | null>(null);
    const [novoCadastro, setNovoCadastro] = useState<boolean>(false);

    const fetchUsuarios = async (pageNumber: number = 0) => {
        setLoading(true);
        try {
            const response = await UsuarioService.getUsuarios(pageNumber, perPage);
            if (response.content && Array.isArray(response.content)) {
                setUsuarios(response.content);
                setTotalRows(response.totalElements);
            } else {
                console.error('Formato inesperado da resposta:', response);
            }
        } catch (error) {
            console.error('Erro ao carregar usuários:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsuarios(page);
    }, [page, perPage]);

    const handlePageChange = (pageNumber: number) => {
        setPage(pageNumber - 1);
    };

    const handlePerRowsChange = (newPerPage: number) => {
        setPerPage(newPerPage);
    };

    const handleEdit = async (usuario: Usuario) => {
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
    };

    const handleDelete = (usuario: Usuario) => {
        console.log("Deletar usuário:", usuario);
    };

    const columns = [
        {name: "Nome", selector: (row: Usuario) => row.nome, sortable: true},
        {name: "Email", selector: (row: Usuario) => row.email, sortable: true},
        {name: "Celular", selector: (row: Usuario) => row.celular || "Não informado", sortable: true},
        {name: "Data de Cadastro", selector: (row: Usuario) => row.dataCadastro, sortable: true},
        {
            name: "Tipo de Usuário",
            selector: (row: Usuario) => row.roles.map(role => role.descricao).join(", "),
            sortable: true
        },
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

    const paginationComponentOptions = {
        rowsPerPageText: 'Registros por página:',
        rangeSeparatorText: 'de',
        selectAllRowsItem: true,
        selectAllRowsItemText: 'Todos',
    };

    const handleSave = async (usuario: Usuario) => {
        try {
            await UsuarioService.createUsuario(usuario);
            fetchUsuarios(page);
        } catch (error) {
            console.error("Erro ao criar usuário:", error);
            toast.error("Erro ao criar usuário.");
        }
    };

    return (
        <div className="w-full bg-white shadow-md rounded-lg p-4">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-xl font-semibold">Usuários</h1>
                <button
                    onClick={() => setNovoCadastro(true)}
                    className="text-white bg-green-500 hover:bg-green-600 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                >
                    Novo Cadastro
                </button>
            </div>
            {novoCadastro && (
                <EditarUsuarioDialog
                    isOpen={novoCadastro}
                    onClose={() => setNovoCadastro(false)}
                    usuario={null}
                    onSave={handleSave}
                    isEdit={false}
                />
            )}
            {editarUsuarioDialog && (
                <EditarUsuarioDialog
                    isOpen={editarUsuarioDialog}
                    onClose={() => setEditarUsuarioDialog(false)}
                    usuario={usuarioEditar}
                    onSave={handleEdit}
                    isEdit={true}
                />
            )}
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
                onChangeRowsPerPage={handlePerRowsChange}
                paginationComponentOptions={paginationComponentOptions}
                highlightOnHover
                pointerOnHover
                noDataComponent="Nenhum usuário encontrado."
            />
        </div>
    );
}
'use client';
import React, {useEffect, useRef, useState} from 'react';
import {Column} from 'primereact/column';
import {Button} from 'primereact/button';
import {InputText} from 'primereact/inputtext';
import {Demo} from '../../../types';
import {Toast} from 'primereact/toast';
import {Tag} from 'primereact/tag';
import {DataTable} from 'primereact/datatable';
import {ConfirmDialog} from 'primereact/confirmdialog';
import {FilterMatchMode} from 'primereact/api';
import UsuarioService from "@/demo/services/usuario/UsuarioService";
import EditarUsuario from "@/demo/components/usuario/EditarUsuario";
import DeletarUsuario from "@/demo/components/usuario/DeletarUsuario";

const UsuarioDataTable = ({usuarios: initialUsuarios, loading}: { usuarios: Demo.Usuario[], loading: boolean }) => {
    const [usuarios, setUsuarios] = useState<Demo.Usuario[]>([]);
    const toast = useRef<Toast>(null);
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [filters, setFilters] = useState<any>({global: {value: '', matchMode: 'contains'}});
    const [usuarioEditar, setUsuarioEditar] = useState<Demo.Usuario | null>(null);
    const [editarUsuarioDialog, setEditarUsuarioDialog] = useState(false);
    const [deletUsuario, setDeletUsuario] = useState<Demo.Usuario | null>(null);
    const [deletarUsuarioDialog, setDeletarUsuarioDialog] = useState(false);

    useEffect(() => {
        setUsuarios(Array.isArray(initialUsuarios) ? initialUsuarios : []);
    }, [initialUsuarios]);

    const editarUsuario = async (usuario: Demo.Usuario) => {
        if (usuario.id) {
            try {
                const usuarioEncontrado = await UsuarioService.getUsuarioById(usuario.id);
                if (usuarioEncontrado) {
                    setUsuarioEditar(usuarioEncontrado);
                    setEditarUsuarioDialog(true);
                }
            } catch (error) {
                console.error('Erro ao buscar usuario para edição:', error);
                toast.current?.show({
                    severity: 'error',
                    summary: 'Erro',
                    detail: 'Não foi possível carregar os dados do usuario para edição',
                    life: 3000
                });
            }
        }
    };

    const deletarUsuario = async (usuario: Demo.Usuario) => {
        if (usuario.id) {
            try {
                const usuarioEncontrado = await UsuarioService.getUsuarioById(usuario.id);
                if (usuarioEncontrado) {
                    setDeletUsuario(usuarioEncontrado);
                    setDeletarUsuarioDialog(true);
                }
            } catch (error) {
                console.error('Erro ao buscar usuario para deletar:', error);
                toast.current?.show({
                    severity: 'error',
                    summary: 'Erro',
                    detail: 'Não foi possível carregar os dados do usuario para deletar',
                    life: 3000
                });
            }
        }
    };

    const actionBodyTemplate = (rowData: Demo.Usuario) => {
        return (
            <div className="flex gap-2">
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-success"
                        onClick={() => editarUsuario(rowData)}
                />
                <Button icon="pi pi-trash" className="p-button-rounded p-button-danger"
                        onClick={() => deletarUsuario(rowData)}/>
            </div>
        );
    };

    const formatRoles = (roles: { descricao: string; }[]) => {
        return roles.map(role => `${role.descricao}`).join(', ');
    };

    const statusBodyTemplate = (usuario: Demo.Usuario) => {
        const status = usuario.ativo ? 'Ativo' : 'Inativo';
        return <Tag value={status} severity={getSeverity(status)}></Tag>;
    };

    const getSeverity = (status: string) => {
        switch (status) {
            case 'Ativo':
                return 'success';

            case 'Inativo':
                return 'danger';

            default:
                return null;
        }
    };

    const onGlobalFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setGlobalFilterValue(value);

        setFilters({
            global: {value, matchMode: FilterMatchMode.CONTAINS}
        });
    };

    const renderHeader = () => {
        return (
            <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
                <h5 className="m-0">Listagem de usuário</h5>
                <span className="p-input-icon-left">
                    <i className="pi pi-search"/>
                    <InputText
                        value={globalFilterValue}
                        onChange={onGlobalFilterChange}
                        placeholder="Pesquisar usuário..."
                    />
                </span>
            </div>
        );
    };

    const header = renderHeader();

    return (
        <div className="grid">
            <div className="col-12 mt-5">
                <Toast ref={toast}/>
                <ConfirmDialog/>
                <DataTable
                    value={usuarios}
                    loading={loading}
                    paginator
                    rows={5}
                    rowsPerPageOptions={[5, 10, 25]}
                    emptyMessage="Nenhum registro encontrado..."
                    dataKey="id"
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} usuários"
                    tableStyle={{minWidth: '50rem'}}
                    filters={filters}
                    header={header}
                >
                    <Column field="id" header="Código"></Column>
                    <Column field="nome" header="Nome"></Column>
                    <Column field="email" header="Email"></Column>
                    <Column field="celular" header="Celular"></Column>
                    <Column field="descricao" header="Funções"
                            body={(rowData: Demo.Usuario) => formatRoles(rowData.roles)}></Column>
                    <Column field="ativo" header="Ativo" body={statusBodyTemplate}></Column>
                    <Column body={actionBodyTemplate} header="Ações"/>
                </DataTable>

                {/* Componente para Editar Usuário */}
                {usuarioEditar && (
                    <EditarUsuario
                        usuario={usuarioEditar}
                        isOpen={editarUsuarioDialog}
                        onHide={() => setEditarUsuarioDialog(false)}
                        setUsuarios={setUsuarios}
                    />
                )}

                {/* Componente para Deletar Usuário */}
                {deletUsuario && (
                    <DeletarUsuario
                        usuario={deletUsuario}
                        isOpen={deletarUsuarioDialog}
                        onHide={() => setDeletarUsuarioDialog(false)}
                        onUpdate={() => setUsuarios(usuarios.filter((usuario) => usuario.id !== deletUsuario.id))}
                        toast={toast}
                    />
                )}

            </div>
        </div>
    );
};

export default UsuarioDataTable;


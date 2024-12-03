'use client';
import {useSearchParams} from 'next/navigation';
import React, {useEffect, useState} from 'react';
import {DataTable} from 'primereact/datatable';
import {Column} from 'primereact/column';
import {Button} from 'primereact/button';
import {Demo} from '../../../types';
import {Tag} from 'primereact/tag';
import EditarOperador from './EditarOperador';
import UsuarioService from "@/demo/services/usuario/UsuarioService";

const OperadorLogado = () => {
    const [usuario, setUsuario] = useState<Demo.Usuario | null>(null);
    const [loading, setLoading] = useState(true);
    const [editDialogVisible, setEditDialogVisible] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const searchParams = useSearchParams();

    // Função para buscar o operador logado com ID
    useEffect(() => {
        if (!mounted) return;

        const fetchOperadorLogado = async () => {
            setLoading(true);
            try {
                const userId = searchParams.get('id');

                if (userId) {
                    const data = await UsuarioService.getUsuarioById(Number(userId));
                    setUsuario(data);
                } else {
                    console.error('ID do operador não encontrado na URL');
                }
            } catch (error) {
                console.error('Erro ao buscar o operador logado:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchOperadorLogado();
    }, [mounted, searchParams]);

    const openEditDialog = () => {
        setEditDialogVisible(true);
    };

    const formatRoles = (roles: Demo.Role[]) => {
        return roles.map(role => role.descricao).join(', ');
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

    const renderHeader = () => {
        return (
            <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
                <h5 className="m-0">Gerenciar operador</h5>
                <span className="p-input-icon-left">
            </span>
            </div>
        );
    };

    const header = renderHeader();

    return (
        <div className="grid">
            <div className="col-12 mt-5">
                {usuario && (
                    <DataTable
                        value={[usuario]}
                        loading={loading}
                        emptyMessage="Nenhum registro encontrado..."
                        dataKey="id"
                        header={header}
                        tableStyle={{minWidth: '50rem'}}
                    >
                        <Column field="id" header="Código"></Column>
                        <Column field="nome" header="Nome"></Column>
                        <Column field="email" header="Email"></Column>
                        <Column field="roles" header="Funções"
                                body={(rowData: Demo.Usuario) => formatRoles(rowData.roles)}/>
                        <Column field="ativo" header="Status" body={statusBodyTemplate}></Column>
                        <Column header="Editar Cadastro" body={() => (
                            <Button icon="pi pi-pencil" className="p-button-rounded p-button-success"
                                    onClick={openEditDialog}/>
                        )}/>
                    </DataTable>
                )}
            </div>

            {/* Componente de edição */}
            <EditarOperador
                visible={editDialogVisible}
                onHide={() => setEditDialogVisible(false)}
                operador={usuario} // Passa os dados do operador
            />
        </div>
    );
};

export default OperadorLogado;

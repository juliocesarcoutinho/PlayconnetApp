"use client";
import React, {useEffect, useState} from 'react';
import {DataTable} from 'primereact/datatable';
import {Column} from 'primereact/column';
import {Dialog} from 'primereact/dialog';
import {InputText} from 'primereact/inputtext';
import UsuarioService from "@/demo/services/usuario/UsuarioService";
import {Button} from 'primereact/button';

interface UsuarioPessoa {
    id: number;
    nome: string;
    email: string;
    celular: string;
    pessoa: {
        endereco: {
            logradouro: string;
            numero: string;
            cidade: string;
            estado: string;
        }
    }
}

const UsuarioPessoaDataTable = () => {
    const [usuarios, setUsuarios] = useState<UsuarioPessoa[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [selectedUsuario, setSelectedUsuario] = useState<UsuarioPessoa | null>(null);
    const [editDialogVisible, setEditDialogVisible] = useState<boolean>(false);

    useEffect(() => {
        const fetchUsuarios = async () => {
            setLoading(true);
            try {
                const fetchedUsuarios: Demo.UsuarioPessoa[] = await UsuarioService.getUsuarioPessoa();
                const usuariosComId: UsuarioPessoa[] = fetchedUsuarios.map(usuario => ({
                    ...usuario,
                    id: usuario.id ?? 0,
                    pessoa: {
                        ...usuario.pessoa,
                        endereco: {
                            logradouro: usuario.pessoa?.endereco?.logradouro ?? '',
                            numero: usuario.pessoa?.endereco?.numero ?? '',
                            cidade: usuario.pessoa?.endereco?.cidade ?? '',
                            estado: usuario.pessoa?.endereco?.estado ?? ''
                        }
                    }
                }));
                setUsuarios(usuariosComId);
            } catch (error) {
                console.error('Erro ao buscar usuários:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchUsuarios();
    }, []);

    const onCellClick = (usuario: UsuarioPessoa) => {
        setSelectedUsuario(usuario);
        setEditDialogVisible(true);
    };

    const hideDialog = () => {
        setEditDialogVisible(false);
        setSelectedUsuario(null);
    };

    const saveUsuario = () => {
        // Implementar método de salvar usuário


        hideDialog();
    };

    const renderHeader = () => {
        return (
            <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
                <h5 className="m-0">Listagem de Adolescentes</h5>
                <span className="p-input-icon-left">
                    <i className="pi pi-search"/>
                    <InputText placeholder="Pesquisar usuário..."/>
                </span>
            </div>
        );
    };

    const header = renderHeader();

    return (
        <div className="card">
            <DataTable value={usuarios} responsiveLayout="scroll" loading={loading} paginator rows={5}
                       rowsPerPageOptions={[5, 10, 25]} dataKey="id" header={header}
                       emptyMessage="Nenhum adolescente encontrado">
                <Column field="id" header="Código" sortable body={(rowData) => (
                    <div onClick={() => onCellClick(rowData)} style={{cursor: 'pointer'}}>
                        {rowData.id}
                    </div>
                )}/>
                <Column field="nome" header="Nome" sortable body={(rowData) => (
                    <div onClick={() => onCellClick(rowData)} style={{cursor: 'pointer'}}>
                        {rowData.nome}
                    </div>
                )}/>
                <Column field="email" header="Email" sortable body={(rowData) => (
                    <div onClick={() => onCellClick(rowData)} style={{cursor: 'pointer'}}>
                        {rowData.email}
                    </div>
                )}/>
                <Column field="celular" header="Celular" sortable body={(rowData) => (
                    <div onClick={() => onCellClick(rowData)} style={{cursor: 'pointer'}}>
                        {rowData.celular}
                    </div>
                )}/>
                <Column field="pessoa?.endereco?.logradouro" header="Logradouro" sortable body={(rowData) => (
                    <div onClick={() => onCellClick(rowData)} style={{cursor: 'pointer'}}>
                        {rowData.pessoa?.endereco?.logradouro}
                    </div>
                )}/>
                <Column field="pessoa?.endereco?.numero" header="Número" sortable body={(rowData) => (
                    <div onClick={() => onCellClick(rowData)} style={{cursor: 'pointer'}}>
                        {rowData.pessoa?.endereco?.numero}
                    </div>
                )}/>
                <Column field="pessoa?.endereco?.cidade" header="Cidade" sortable body={(rowData) => (
                    <div onClick={() => onCellClick(rowData)} style={{cursor: 'pointer'}}>
                        {rowData.pessoa?.endereco?.cidade}
                    </div>
                )}/>
                <Column field="pessoa?.endereco?.estado" header="Estado" sortable body={(rowData) => (
                    <div onClick={() => onCellClick(rowData)} style={{cursor: 'pointer'}}>
                        {rowData.pessoa?.endereco?.estado}
                    </div>
                )}/>
            </DataTable>

            <Dialog visible={editDialogVisible} style={{width: '450px'}} header="Editar Usuário" modal
                    className="p-fluid" footer={
                <div>
                    <Button label="Cancelar" icon="pi pi-times" onClick={hideDialog} className="p-button-text"/>
                    <Button label="Salvar" icon="pi pi-check" onClick={saveUsuario}/>
                </div>
            } onHide={hideDialog}>
                {selectedUsuario && (
                    <div>
                        <div className="field">
                            <label htmlFor="nome">Nome</label>
                            <InputText id="nome" value={selectedUsuario.nome} onChange={(e) => setSelectedUsuario({
                                ...selectedUsuario,
                                nome: e.target.value
                            })}/>
                        </div>
                        <div className="field">
                            <label htmlFor="email">Email</label>
                            <InputText id="email" value={selectedUsuario.email} onChange={(e) => setSelectedUsuario({
                                ...selectedUsuario,
                                email: e.target.value
                            })}/>
                        </div>
                        <div className="field">
                            <label htmlFor="celular">Celular</label>
                            <InputText id="celular" value={selectedUsuario.celular}
                                       onChange={(e) => setSelectedUsuario({
                                           ...selectedUsuario,
                                           celular: e.target.value
                                       })}/>
                        </div>
                        <div className="field">
                            <label htmlFor="logradouro">Logradouro</label>
                            <InputText id="logradouro" value={selectedUsuario.pessoa?.endereco?.logradouro}
                                       onChange={(e) => setSelectedUsuario({
                                           ...selectedUsuario,
                                           pessoa: {
                                               ...selectedUsuario.pessoa,
                                               endereco: {
                                                   ...selectedUsuario.pessoa.endereco,
                                                   logradouro: e.target.value
                                               }
                                           }
                                       })}/>
                        </div>
                        <div className="field">
                            <label htmlFor="numero">Número</label>
                            <InputText id="numero" value={selectedUsuario.pessoa?.endereco?.numero}
                                       onChange={(e) => setSelectedUsuario({
                                           ...selectedUsuario,
                                           pessoa: {
                                               ...selectedUsuario.pessoa,
                                               endereco: {
                                                   ...selectedUsuario.pessoa.endereco,
                                                   numero: e.target.value
                                               }
                                           }
                                       })}/>
                        </div>
                        <div className="field">
                            <label htmlFor="cidade">Cidade</label>
                            <InputText id="cidade" value={selectedUsuario.pessoa?.endereco?.cidade}
                                       onChange={(e) => setSelectedUsuario({
                                           ...selectedUsuario,
                                           pessoa: {
                                               ...selectedUsuario.pessoa,
                                               endereco: {
                                                   ...selectedUsuario.pessoa.endereco,
                                                   cidade: e.target.value
                                               }
                                           }
                                       })}/>
                        </div>
                        <div className="field">
                            <label htmlFor="estado">Estado</label>
                            <InputText id="estado" value={selectedUsuario.pessoa?.endereco?.estado}
                                       onChange={(e) => setSelectedUsuario({
                                           ...selectedUsuario,
                                           pessoa: {
                                               ...selectedUsuario.pessoa,
                                               endereco: {
                                                   ...selectedUsuario.pessoa.endereco,
                                                   estado: e.target.value
                                               }
                                           }
                                       })}/>
                        </div>
                    </div>
                )}
            </Dialog>
        </div>
    );
};

export default UsuarioPessoaDataTable;
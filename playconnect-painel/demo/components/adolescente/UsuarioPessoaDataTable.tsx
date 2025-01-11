// components/UsuarioPessoaDataTable.tsx
import React, {useEffect, useState} from 'react';
import {DataTable} from 'primereact/datatable';
import {Column} from 'primereact/column';
import {InputText} from 'primereact/inputtext';
import {Button} from 'primereact/button';
import {Toast} from 'primereact/toast';
import {Dialog} from 'primereact/dialog';
import {Calendar} from 'primereact/calendar';
import {InputMask} from 'primereact/inputmask';
import {addLocale} from 'primereact/api';
import UsuarioService from '@/demo/services/usuario/UsuarioService';

interface UsuarioPessoa {
    id: number;
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

const UsuarioPessoaDataTable = () => {
    const [usuarios, setUsuarios] = useState<UsuarioPessoa[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [selectedUsuario, setSelectedUsuario] = useState<UsuarioPessoa | null>(null);
    const [editDialogVisible, setEditDialogVisible] = useState<boolean>(false);
    const toast = React.useRef<Toast>(null);

    // Adiciona a localidade para o português do Brasil
    addLocale('pt-BR', {
        firstDayOfWeek: 0,
        dayNames: ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'],
        dayNamesShort: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'],
        dayNamesMin: ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'],
        monthNames: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
        monthNamesShort: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
        today: 'Hoje',
        clear: 'Limpar'
    });

    const parseDate = (dateString: string) => {
        const date = new Date(dateString);
        return isNaN(date.getTime()) ? null : date;
    };

    useEffect(() => {
        const fetchUsuarios = async () => {
            setLoading(true);
            try {
                const fetchedUsuarios: Demo.UsuarioPessoa[] = await UsuarioService.getUsuarioPessoa();
                console.log(fetchedUsuarios)
                const usuariosComId: UsuarioPessoa[] = fetchedUsuarios.map(usuario => ({
                    ...usuario,
                    id: usuario.id ?? 0,
                    pessoa: {
                        ...usuario.pessoa,
                        endereco: {
                            cep: usuario.pessoa?.endereco?.cep ?? '',
                            logradouro: usuario.pessoa?.endereco?.logradouro ?? '',
                            complemento: usuario.pessoa?.endereco?.complemento ?? '',
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

    const saveUsuario = async () => {
        if (selectedUsuario) {
            try {
                const response = await UsuarioService.editUsuarioPessoa(selectedUsuario);
                if (response.success) {
                    toast.current?.show({
                        severity: 'success',
                        summary: 'Sucesso',
                        detail: 'Usuário atualizado com sucesso',
                        life: 3000
                    });
                    setUsuarios(prevUsuarios => prevUsuarios.map(usuario => usuario.id === selectedUsuario.id ? selectedUsuario : usuario));
                } else {
                    toast.current?.show({severity: 'error', summary: 'Erro', detail: response.message, life: 3000});
                }
            } catch (error) {
                console.error('Erro ao salvar usuário:', error);
                toast.current?.show({severity: 'error', summary: 'Erro', detail: 'Erro ao salvar usuário', life: 3000});
            }
        }
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

    const renderFooter = () => {
        return (
            <div>
                <Button label="Cancelar" icon="pi pi-times" onClick={hideDialog} className="p-button-text"/>
                <Button label="Salvar" icon="pi pi-check" onClick={saveUsuario}/>
            </div>
        );
    };

    return (
        <div className="card">
            <Toast ref={toast}/>
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
                
            </DataTable>

            <Dialog visible={editDialogVisible} style={{width: '600px'}} header="Editar Usuário" modal
                    className="p-fluid" footer={renderFooter()} onHide={hideDialog}>
                {selectedUsuario && (
                    <div className="p-fluid formgrid grid">
                        <div className="field col-12 md:col-6">
                            <label htmlFor="nome">Nome</label>
                            <InputText id="nome" value={selectedUsuario.nome} onChange={(e) => setSelectedUsuario({
                                ...selectedUsuario,
                                nome: e.target.value
                            })}/>
                        </div>
                        <div className="field col-12 md:col-6">
                            <label htmlFor="email">Email</label>
                            <InputText id="email" value={selectedUsuario.email} onChange={(e) => setSelectedUsuario({
                                ...selectedUsuario,
                                email: e.target.value
                            })}/>
                        </div>

                        <div className="field col-12 md:col-6">
                            <label htmlFor="cpf">CPF</label>
                            <InputMask
                                mask="999.999.999-99"
                                id="cpf"
                                value={selectedUsuario?.pessoa.cpf ?? ""}
                                onChange={(e) =>
                                    setSelectedUsuario(prev => ({
                                        ...(prev as UsuarioPessoa),
                                        cpf: e.target.value as string
                                    }))
                                }
                            />
                        </div>
                        <div className="field col-12 md:col-6">
                            <label htmlFor="rg">RG</label>
                            <InputMask
                                mask="99.999.999-9"
                                id="rg"
                                value={selectedUsuario?.pessoa.rg ?? ""}
                                onChange={(e) =>
                                    setSelectedUsuario(prev => ({
                                        ...(prev as UsuarioPessoa),
                                        rg: e.target.value as string
                                    }))
                                }
                            />
                        </div>
                        <div className="field col-12 md:col-6">
                            <label htmlFor="celular">Celular</label>
                            <InputMask
                                mask="(99)99999-9999"
                                id="celular"
                                value={selectedUsuario?.celular ?? ""}
                                onChange={(e) =>
                                    setSelectedUsuario(prev => ({
                                        ...(prev as UsuarioPessoa),
                                        celular: e.target.value as string
                                    }))
                                }
                            />
                        </div>

                        <div className="field col-12 md:col-6">
                            <label htmlFor="nascimento">Data de Nascimento</label>
                            <Calendar
                                id="nascimento"
                                value={parseDate(selectedUsuario?.pessoa?.dataNascimento || '')}
                                onChange={(e) => setSelectedUsuario({
                                    ...selectedUsuario,
                                    pessoa: {
                                        ...selectedUsuario?.pessoa,
                                        dataNascimento: e.value?.toISOString() || ''
                                    }
                                })}
                                dateFormat="dd/mm/yy"
                                locale="pt-BR"
                            />
                        </div>
                        <div className="field col-12 md:col-6">
                            <label htmlFor="nomeMae">Nome da Mãe</label>
                            <InputText
                                id="nomeMae"
                                value={selectedUsuario?.pessoa?.nomeMae || ''}
                                onChange={(e) => setSelectedUsuario({
                                    ...selectedUsuario,
                                    pessoa: {
                                        ...selectedUsuario?.pessoa,
                                        nomeMae: e.target.value
                                    }
                                })}
                            />
                        </div>

                        <div className="field col-12 md:col-6">
                            <label htmlFor="nomePai">Nome do Pai</label>
                            <InputText
                                id="nomePai"
                                value={selectedUsuario?.pessoa?.nomePai || ''}
                                onChange={(e) => setSelectedUsuario({
                                    ...selectedUsuario,
                                    pessoa: {
                                        ...selectedUsuario?.pessoa,
                                        nomePai: e.target.value
                                    }
                                })}
                            />
                        </div>

                        <div className="field col-12 md:col-6">
                            <label htmlFor="logradouro">Cep</label>
                            <InputText id="logradouro" value={selectedUsuario.pessoa?.endereco?.cep}
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

                        <div className="field col-12 md:col-6">
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
                        <div className="field col-12 md:col-6">
                            <label htmlFor="numero">Número</label>
                            <InputText id="numero" value={selectedUsuario.pessoa?.endereco?.numero}
                                       onChange={(e) => setSelectedUsuario({
                                           ...selectedUsuario,
                                           pessoa: {
                                               ...selectedUsuario.pessoa,
                                               endereco: {...selectedUsuario.pessoa.endereco, numero: e.target.value}
                                           }
                                       })}/>
                        </div>

                        <div className="field col-12 md:col-6">
                            <label htmlFor="numero">Complemento</label>
                            <InputText id="numero" value={selectedUsuario.pessoa?.endereco?.numero}
                                       onChange={(e) => setSelectedUsuario({
                                           ...selectedUsuario,
                                           pessoa: {
                                               ...selectedUsuario.pessoa,
                                               endereco: {...selectedUsuario.pessoa.endereco, numero: e.target.value}
                                           }
                                       })}/>
                        </div>
                        <div className="field col-12 md:col-6">
                            <label htmlFor="cidade">Cidade</label>
                            <InputText id="cidade" value={selectedUsuario.pessoa?.endereco?.cidade}
                                       onChange={(e) => setSelectedUsuario({
                                           ...selectedUsuario,
                                           pessoa: {
                                               ...selectedUsuario.pessoa,
                                               endereco: {...selectedUsuario.pessoa.endereco, cidade: e.target.value}
                                           }
                                       })}/>
                        </div>
                        <div className="field col-12 md:col-6">
                            <label htmlFor="estado">Estado</label>
                            <InputText id="estado" value={selectedUsuario.pessoa?.endereco?.estado}
                                       onChange={(e) => setSelectedUsuario({
                                           ...selectedUsuario,
                                           pessoa: {
                                               ...selectedUsuario.pessoa,
                                               endereco: {...selectedUsuario.pessoa.endereco, estado: e.target.value}
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
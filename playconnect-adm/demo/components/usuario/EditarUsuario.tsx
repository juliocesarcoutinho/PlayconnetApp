'use client';
import React, {useEffect, useRef, useState} from 'react';
import {Demo} from '../../../types';
import {Toast} from 'primereact/toast';
import {Dialog} from 'primereact/dialog';
import {InputText} from 'primereact/inputtext';
import {Button} from 'primereact/button';
import {RadioButton} from 'primereact/radiobutton';
import {Dropdown} from 'primereact/dropdown';
import {InputMask} from 'primereact/inputmask';
import UsuarioService from "../../services/usuario/UsuarioService";
import {RoleService} from "../../services/role/RoleService";

type EditarUsuarioProps = {
    setUsuarios: React.Dispatch<React.SetStateAction<Demo.Usuario[]>>;
    usuario: Demo.Usuario | null;
    isOpen: boolean;
    onHide: () => void;
    onUpdate?: () => void;
};

const EditarUsuario: React.FC<EditarUsuarioProps> = ({setUsuarios, usuario, isOpen, onHide, onUpdate}) => {
    const toast = useRef<Toast>(null);
    const [usuarioSelecionado, setUsuarioSelecionado] = useState<Demo.Usuario>({
        id: null,
        nome: '',
        email: '',
        telefone: '',
        ativo: true,
        dataCadastro: '',
        dataAtualizacao: '',
        roles: [],
    });
    const [loadingSave, setLoadingSave] = useState(false);
    const [dropdownItem, setDropdownItem] = useState<string | null>(null);
    const [dropdownItems, setDropdownItems] = useState<{ name: string; code: string }[]>([]);

    const [validationError, setValidationError] = useState({
        nome: false,
        email: false,
        telefone: false
    });

    const validarCamposObrigatorios = () => {
        const erros = {
            nome: !usuarioSelecionado.nome?.trim(),
            email: !usuarioSelecionado?.email?.trim(),
            telefone: !usuarioSelecionado?.telefone?.trim(),
        };

        setValidationError(erros);
        return Object.values(erros).some((campoVazio) => campoVazio);
    };

    const fetchRolesFromAPI = async () => {
        try {
            const fetchedRoles = await RoleService.getRoles('/roles');
            const dropdownOptions = fetchedRoles.map((role) => ({
                name: role.descricao,
                code: String(role.id),
            }));
            setDropdownItems(dropdownOptions);
        } catch (error) {
            console.error('Erro ao buscar roles da API:', error);
        }
    };

    useEffect(() => {
        if (usuario) {
            setUsuarioSelecionado(usuario);
            setDropdownItem(usuario.roles?.[0]?.id?.toString() || null);
        }
    }, [usuario]);

    useEffect(() => {
        fetchRolesFromAPI();
    }, []);

    const onStatusChange = (status: boolean) => {
        setUsuarioSelecionado((prevUsuario: any) => ({
            ...prevUsuario,
            ativo: status,
        }));
    };

    const onInputChange = (e: any, field: string) => {
        const val = e.target.value;

        setUsuarioSelecionado((prevUsuario: { [x: string]: unknown; }) => {
            if (!prevUsuario) return prevUsuario;

            const fields = field.split('.');
            if (fields.length === 2) {
                return {
                    ...prevUsuario,
                    [fields[0]]: {
                        ...(prevUsuario[fields[0] as keyof typeof prevUsuario] as unknown as Record<string, any>),
                        [fields[1]]: val
                    }
                };
            } else {
                return {...prevUsuario, [field]: val};
            }
        });
    };

    const editarUsuario = async () => {
        if (validarCamposObrigatorios()) {
            return;
        }

        setLoadingSave(true);
        try {
            if (usuarioSelecionado) {
                const usuarioAtualizado = {...usuarioSelecionado, roles: [{id: dropdownItem}]};

                // @ts-ignore
                const response = await UsuarioService.editUsuario(usuarioAtualizado);

                if (response.success) {
                    toast.current?.show({
                        severity: 'success',
                        summary: 'Sucesso',
                        detail: 'Usuário atualizado com sucesso',
                        life: 3000,
                    });
                    const updatedUsuarios = await UsuarioService.getUsuarios();
                    setUsuarios(updatedUsuarios);
                    onUpdate?.();
                    onHide();
                } else {
                    toast.current?.show({
                        severity: 'warn',
                        summary: 'Aviso',
                        detail: response.message,
                        life: 3000,
                    });
                }
            }
        } catch (error) {
            toast.current?.show({
                severity: 'error',
                summary: 'Erro',
                detail: 'Erro inesperado ao atualizar usuário',
                life: 3000,
            });
        } finally {
            setLoadingSave(false);
        }
    };

    const usuarioDialogFooter = (
        <>
            <Button
                label="Salvar"
                severity="info"
                icon="pi pi-check"
                onClick={editarUsuario}
                className="p-button-text"
                loading={loadingSave}
            />
            <Button label="Cancelar" severity="danger" icon="pi pi-times" onClick={onHide} className="p-button-text"/>
        </>
    );

    return (
        <>
            <Toast ref={toast} position="top-right"/>
            <Dialog visible={isOpen}
                    style={{width: '70%'}}
                    header="Detalhes do Usuário"
                    modal
                    className="p-fluid"
                    footer={usuarioDialogFooter}
                    onHide={onHide}>
                <div className="p-fluid formgrid grid">
                    <div className="field col-12 md:col-6">
                        <label htmlFor="idUsuario">Código do usuário</label>
                        <InputText id="idUsuario" value={String(usuarioSelecionado.id)} disabled/>
                    </div>

                    <div className="field col-12 md:col-6">
                        <label htmlFor="nome">Nome</label>
                        <InputText id="nome" value={usuarioSelecionado.nome}
                                   onChange={(e) => onInputChange(e, 'nome')}
                                   placeholder="Informe o nome"/>
                        {validationError.nome && <small className="p-error">O nome é obrigatório</small>}
                    </div>

                    <div className="field col-12 md:col-6">
                        <label htmlFor="email">Email</label>
                        <InputText id="email" value={usuarioSelecionado.email}
                                   onChange={(e) => onInputChange(e, 'email')}
                                   placeholder="Informe o e-mail"/>
                        {validationError.email && <small className="p-error">O e-mail é obrigatório</small>}
                    </div>

                    <div className="field col-12 md:col-6">
                        <label htmlFor="telefone">Telefone <span className="text-danger"></span></label>
                        <InputMask id="telefone" value={usuarioSelecionado.telefone}
                                   onChange={(e) => onInputChange(e, 'telefone')}
                                   mask="(99)9999-9999" placeholder="Informe o telefone"/>
                        {validationError.telefone && <small className="p-error">O telefone é obrigatório</small>}
                    </div>

                    <div className="field col-12 md:col-6">
                        <label htmlFor="roles">Função</label>
                        <Dropdown
                            id="roles"
                            value={dropdownItem}
                            options={dropdownItems}
                            onChange={(e) => setDropdownItem(e.value)}
                            optionLabel="name"
                            optionValue="code"
                            placeholder="Selecione a função"
                        />
                    </div>

                    <div className="field col-12 md:col-6">
                        <label>Status</label>
                        <div className="field-radiobutton">
                            <RadioButton
                                inputId="ativo"
                                checked={usuarioSelecionado.ativo}
                                onChange={() => onStatusChange(true)}
                                value={true}
                            />
                            <label htmlFor="ativo">Ativo</label>
                        </div>
                        <div className="field-radiobutton">
                            <RadioButton
                                inputId="inativo"
                                checked={!usuarioSelecionado.ativo}
                                onChange={() => onStatusChange(false)}
                                value={false}
                            />
                            <label htmlFor="inativo">Inativo</label>
                        </div>
                    </div>
                </div>
            </Dialog>
        </>
    );
};

export default EditarUsuario;

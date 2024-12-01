'use client';
import React, {useEffect, useRef, useState} from 'react';
import {InputText} from 'primereact/inputtext';
import {Button} from 'primereact/button';
import {CheckboxChangeEvent} from 'primereact/checkbox';
import {InputMask, InputMaskChangeEvent} from 'primereact/inputmask';
import {Toast} from 'primereact/toast';
import {ProgressSpinner} from 'primereact/progressspinner';
import {RoleService} from "../../../../demo/services/role/RoleService";
import {Demo} from "../../../../types";
import UsuarioService from "../../../../demo/services/usuario/UsuarioService";
import CadastroRoles from "../../../../demo/components/role/CadastroRoles";
import UsuarioDataTable from "../../../../demo/components/usuario/UsuarioDataTable";
import {Password} from "primereact/password";

const CadastroUsuario = () => {
    interface DropdownItem {
        name: string;
        code: string;
    }

    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [telefone, setTelefone] = useState<string>('');
    const [senha, setSenha] = useState('');
    const [dropdownItem, setDropdownItem] = useState<string | null>(null);
    const [ativo, setAtivo] = useState(true);
    const [inativo, setInativo] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [showExitButton, setShowExitButton] = useState(false);
    const [loading, setLoading] = useState(false);
    const [usuarios, setUsuarios] = useState<Demo.Usuario[]>([]);
    const toast = useRef<Toast>(null);
    const [dropdownItems, setDropdownItems] = useState<DropdownItem[]>([]);

    const [validationError, setValidationError] = useState({
        nome: false,
        email: false,
        telefone: false,
        senha: false,
        dropdownItem: false
    });

    const validarCamposObrigatorios = () => {
        const erros = {
            nome: !nome.trim(),
            email: !email?.trim(),
            telefone: !telefone.trim(),
            senha: !senha.trim(),
            dropdownItem: !dropdownItem?.trim()
        };

        setValidationError(erros);
        return Object.values(erros).some((campoVazio) => campoVazio);
    };

    const resetForm = () => {
        setNome('');
        setEmail('');
        setTelefone('');
        setSenha('');
        setDropdownItem(null);
        setAtivo(true);
        setInativo(false);
    };

    const fetchRolesFromAPI = async () => {
        try {
            const fetchedRoles = await RoleService.getRoles('/roles');
            const dropdownOptions = fetchedRoles.map((role) => ({
                name: role.descricao,
                code: String(role.id)
            }));
            setDropdownItems(dropdownOptions);
        } catch (error) {
            console.error('Erro ao buscar roles da API:', error);
        }
    };

    useEffect(() => {
        fetchRolesFromAPI();
    }, []);

    useEffect(() => {
        const fetchUsuarios = async () => {
            setLoading(true);
            const fetchedUsuarios = await UsuarioService.getUsuarios();
            // @ts-ignore
            setUsuarios(fetchedUsuarios);
            setLoading(false);
        };

        fetchUsuarios();
    }, []);

    const handleExitClick = () => {
        setShowForm(false);
        setShowExitButton(false);
    };

    const handleAtivoChange = (e: CheckboxChangeEvent) => {
        setAtivo(e.checked ?? false);
        if (e.checked) {
            setInativo(false);
        }
    };

    const handleInativoChange = (e: CheckboxChangeEvent) => {
        setInativo(e.checked ?? false);
        if (e.checked) {
            setAtivo(false);
        }
    };

    const SalvarUsuario = async () => {
        if (validarCamposObrigatorios()) {
            return;
        }

        setLoading(true);
        const usuario = {
            nome,
            email,
            senha,
            telefone,
            ativo,
            dataCadastro: new Date().toISOString(),
            dataAtualizacao: new Date().toISOString(),
            roles: dropdownItem ? [{
                id: Number(dropdownItem),
                nome: dropdownItems.find(item => item.code === dropdownItem)?.name || ''
            }] : []

        };

        try {
            // @ts-ignore
            const response = await UsuarioService.createUsuario(usuario);

            if (response.success) {
                toast.current?.show({
                    severity: 'success',
                    summary: 'Sucesso',
                    detail: 'Usuário criado com sucesso',
                    life: 3000
                });

                const updatedUsuarios = await UsuarioService.getUsuarios();
                // @ts-ignore
                setUsuarios(updatedUsuarios);
                resetForm();
            } else {
                toast.current?.show({
                    severity: 'warn',
                    summary: 'Aviso',
                    detail: response.message,
                    life: 3000
                });
            }
        } catch (error) {
            console.error('Erro ao criar usuário:', error);
            toast.current?.show({
                severity: 'error',
                summary: 'Erro',
                detail: 'Erro inesperado ao criar usuário',
                life: 3000
            });
        } finally {
            setLoading(false);
        }
    };

    const handleTelefoneChange = (e: InputMaskChangeEvent) => {
        setTelefone(e.value ?? '');
    };

    return (
        <div className="col-12">
            {loading && (
                <div className="loading-overlay">
                    <ProgressSpinner/>
                </div>
            )}
            <div className="card">
                <Toast ref={toast}/>
                <div className="card flex justify-content-start gap-2">
                    <Button
                        type="button"
                        severity="info"
                        label="Cadastrar Usuário"
                        icon="pi pi-user-plus"
                        onClick={() => {
                            setShowForm(true);
                            setShowExitButton(true);
                        }}
                    />
                    {showExitButton && (
                        <Button
                            type="button"
                            severity="danger"
                            label="Fechar Cadastro"
                            icon="pi pi-times"
                            onClick={handleExitClick}
                            className="ml-2"
                        />
                    )}
                </div>

                {showForm && (
                    <>
                        <h1>Cadastro de Usuários</h1>
                        <div className="py-2 p-fluid formgrid grid">
                            <div className="field col-12 md:col-6">
                                <label htmlFor="nome">Nome *</label>
                                <InputText id="nome" value={nome} onChange={(e) => setNome(e.target.value)} required
                                           placeholder="Digite o nome"
                                           className={validationError.nome ? 'p-invalid' : ''}/>
                                {validationError.nome && <small className="p-error">O nome é obrigatório</small>}
                            </div>

                            <div className="field col-12 md:col-6">
                                <label htmlFor="email">Email *</label>
                                <InputText id="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                                           className={validationError.email ? 'p-invalid' : ''}
                                           placeholder="Digite o email"/>
                                {validationError.email && <small className="p-error">O e-mail é obrigatório</small>}
                            </div>

                            <div className="field col-12 md:col-6">
                                <label htmlFor="telefone">Telefone *</label>
                                <InputMask id="telefone" value={telefone} onChange={handleTelefoneChange}
                                           className={validationError.telefone ? 'p-invalid' : ''}
                                           mask="(99) 99999-9999"
                                           required placeholder="Digite o telefone"/>
                                {validationError.telefone &&
                                    <small className="p-error">O telefone é obrigatório</small>}
                            </div>

                            <div className="field col-12 md:col-6">
                                <label htmlFor="senha">Senha *</label>
                                <Password id="senha" value={senha} onChange={(e) => setSenha(e.target.value)} required
                                          className={validationError.senha ? 'p-invalid' : ''}
                                          placeholder="Digite a senha"/>
                                {validationError.senha && <small className="p-error">A senha é obrigatória</small>}
                            </div>
                            <CadastroRoles/>

                            <div className="col-12">
                                <Button type="button" severity="success" label="Salvar Usuário" icon="pi pi-check"
                                        onClick={SalvarUsuario} loading={loading}/>
                            </div>
                        </div>
                    </>
                )}
                <UsuarioDataTable usuarios={usuarios} loading={false}/>
            </div>
        </div>
    );
};

export default CadastroUsuario;

"use client";
import React, {useEffect, useRef, useState} from 'react';
import {InputText} from 'primereact/inputtext';
import {Button} from 'primereact/button';
import {Dialog} from 'primereact/dialog';
import RolesDataTable from './RolesDataTable';
import {Dropdown} from 'primereact/dropdown';
import {Toast} from 'primereact/toast';
import {RoleService} from "@/demo/services/role/RoleService";

const CadastroRoles = () => {

    interface Role {
        id: number;
        descricao: string;
        tipoUsuario: string;
    }

    interface DropdownItem {
        name: string;
        code: string;
    }

    const [descricao, setDescricao] = useState('');
    const [visible, setVisible] = useState<boolean>(false);
    const [roles, setRoles] = useState<Role[]>([]);
    const [validationError, setValidationError] = useState(false);
    const [duplicateError, setDuplicateError] = useState(false);
    const [dropdownItems, setDropdownItems] = useState<DropdownItem[]>([]);
    const [dropdownItem, setDropdownItem] = useState<string | null>(null);
    const toast = useRef<Toast>(null);

    const fetchRolesFromAPI = async () => {
        try {
            const fetchedRoles = await RoleService.getRolesTipo('/roles/tipo-usuario');
            const dropdownOptions = fetchedRoles.map((role) => ({
                name: role,
                code: role
            }));
            setDropdownItems(dropdownOptions);
        } catch (error) {
            console.error('Erro ao buscar roles da API:', error);
        }
    };


    useEffect(() => {
        fetchRolesFromAPI();
    }, [])

    const salvarFuncao = async () => {
        const funcaoSelecionada = dropdownItems.find(item => item.code === dropdownItem);

        const role = {
            descricao,
            tipoUsuario: funcaoSelecionada ? funcaoSelecionada.name : null,
        };

        if (!descricao || !funcaoSelecionada) {
            toast.current?.show({
                severity: 'warn',
                summary: 'Atenção',
                detail: 'Preencha todos os campos obrigatórios.',
                life: 3000
            });
            return;
        }

        try {
            const response = await RoleService.createRoles(role);

            if (response && response.success) {
                toast.current?.show({
                    severity: 'success',
                    summary: 'Sucesso',
                    detail: 'Função criada com sucesso',
                    life: 3000
                });

                const fetchedRoles = await RoleService.getRoles('/roles');
                
                setRoles(fetchedRoles);
                resetForm();
            } else {
                toast.current?.show({
                    severity: 'warn',
                    summary: 'Aviso',
                    detail: response?.message || 'Erro ao criar função',
                    life: 3000
                });
            }
        } catch (error) {
            console.error('Erro inesperado ao criar função:', error);
            toast.current?.show({
                severity: 'error',
                summary: 'Erro',
                detail: 'Erro inesperado ao criar função',
                life: 3000
            });
        }
    };

    const resetForm = () => {
        setDescricao('');
        setDropdownItem(null);
    };

    return (
        <div className="field col-12 md:col-6 py-5">
            <Toast ref={toast}/>
            <Button type="button" severity="info" label="Cadastrar nova função"
                    onClick={() => {
                        setVisible(true);
                    }}/>
            <Dialog visible={visible} style={{width: '70%'}} header={"Cadastro de Função"} modal className="p-fluid"
                    onHide={() => {
                        setVisible(false);
                        setValidationError(false);
                        setDuplicateError(false);
                        setDescricao('');
                    }}>

                <div className="p-fluid formgrid grid">
                    <div className="field col-12 md:col-6 ">
                        <label htmlFor="nomeFuncao">Nome da função</label>
                        <InputText id="nomeFuncao" value={descricao}
                                   onChange={(e) => {
                                       setDescricao(e.target.value);
                                       setValidationError(false);
                                       setDuplicateError(false);
                                   }}
                                   required
                                   placeholder="Digite o nome"
                                   className={validationError && !descricao ? 'p-invalid' : duplicateError ? 'p-invalid' : ''}/>
                        {validationError && !descricao && (
                            <small className="p-error">O nome da função é obrigatório</small>
                        )}
                        {duplicateError && (
                            <small className="p-error">Uma função com este nome já existe.</small>
                        )}
                    </div>

                    <div className={`field col-12 md:col-6 ${!dropdownItem ? 'p-invalid' : ''}`}>
                        <label htmlFor="roles">Tipo <span className="text-danger"></span></label>
                        <Dropdown id="roles" value={dropdownItem} options={dropdownItems}
                                  onChange={(e) => setDropdownItem(e.value)} optionLabel="name"
                                  optionValue="code" placeholder="Selecione a função"/>
                    </div>


                </div>

                <div className="col-12 py-4">
                    <Button type="button" severity="info" label={"Salvar nova função"}
                            icon="pi pi-check" onClick={salvarFuncao}/>
                </div>

                <RolesDataTable roles={roles} loading={false}/>

            </Dialog>
        </div>
    );
};

export default CadastroRoles;

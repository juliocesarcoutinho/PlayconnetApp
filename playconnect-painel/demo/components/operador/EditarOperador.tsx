'use client';

import {InputText} from 'primereact/inputtext';
import {Password} from 'primereact/password';
import {Dialog} from 'primereact/dialog';
import React, {useEffect, useRef, useState} from 'react';
import {Button} from 'primereact/button';
import {Demo} from '../../../types';
import {Toast} from 'primereact/toast';
import UsuarioService from "@/demo/services/usuario/UsuarioService";

interface EditarOperadorProps {
    visible: boolean;
    onHide: () => void;
    operador: Demo.Usuario | null;
}

const EditarOperador: React.FC<EditarOperadorProps> = ({visible, onHide, operador}) => {
    const [usuario, setUsuario] = useState<Demo.Usuario | undefined>(operador || {nome: '', email: '', celular: ''});
    const [confirmEmail, setConfirmEmail] = useState('');
    const [confirmSenha, setConfirmSenha] = useState('');
    const [senha, setSenha] = useState('');
    const toast = useRef<Toast>(null);
    const [loadingSave, setLoadingSave] = useState(false);

    useEffect(() => {
        if (operador) {
            setUsuario(operador);
        }
    }, [operador]);

    const onInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, field: string) => {
        const val = (e.target && e.target.value) || '';
        setUsuario((prevUsuario: any) => {
            if (prevUsuario) {
                return {...prevUsuario, [field]: val};
            }
            return prevUsuario;
        });
    };

    const validarUsuario = (): boolean => {
        // Validação do e-mail
        if (confirmEmail) {
            if (!usuario?.email || usuario.email !== confirmEmail) {
                toast.current?.show({
                    severity: 'error',
                    summary: 'Erro',
                    detail: 'Os e-mails não coincidem',
                    life: 3000,
                });
                return false;
            }
        }

        // Validação da senha
        if (senha || confirmSenha) {
            if (!senha || !confirmSenha) {
                toast.current?.show({
                    severity: 'error',
                    summary: 'Erro',
                    detail: 'Os campos de senha são obrigatórios',
                    life: 3000,
                });
                return false;
            }

            if (senha !== confirmSenha) {
                toast.current?.show({
                    severity: 'error',
                    summary: 'Erro',
                    detail: 'As senhas não coincidem',
                    life: 3000,
                });
                return false;
            }
        }

        // Validação do usuário
        if (!usuario) {
            toast.current?.show({
                severity: 'error',
                summary: 'Erro',
                detail: 'Usuário inválido',
                life: 3000,
            });
            return false;
        }

        return true;
    };


    const salvarUsuario = async () => {
        if (!validarUsuario()) {
            return;
        }

        setLoadingSave(true);
        try {
            const updatedUsuario = {
                ...usuario,
                ...(confirmEmail ? {email: confirmEmail} : {}),
                ...(senha ? {senha: senha} : {}),
            };
            console.log('Tentando editar o usuário:', updatedUsuario);

            const response = await UsuarioService.editUsuario(updatedUsuario);
            console.log('Resposta da API:', response);

            if (response.success) {
                toast.current?.show({
                    severity: 'success',
                    summary: 'Sucesso',
                    detail: 'Operador atualizado com sucesso',
                    life: 3000,
                });
            }

        } catch (error: any) {
            console.log("Erro capturado:", error);

            if (error.response) {
                console.log("Erro resposta:", error.response);
                const errorData = error.response.data;

                // Certificando-se de que a resposta contém a mensagem de erro
                if (errorData?.message) {
                    toast.current?.show({
                        severity: 'error',
                        summary: 'Erro',
                        detail: errorData.message,
                        life: 5000,
                    });
                } else {
                    toast.current?.show({
                        severity: 'error',
                        summary: 'Erro',
                        detail: 'Erro inesperado ao atualizar cliente.',
                        life: 3000,
                    });
                }
            } else {
                console.log("Erro sem resposta da API:", error.message);
                toast.current?.show({
                    severity: 'error',
                    summary: 'Erro',
                    detail: 'Erro inesperado ao atualizar cliente.',
                    life: 3000,
                });
            }
        } finally {
            // Adicionando delay para garantir que o Toast seja exibido antes de fechar o diálogo
            setTimeout(() => {
                setLoadingSave(false);
                onHide();
            }, 3000); // Espera 3 segundos para fechar o diálogo
        }
    };


    const usuarioDialogFooter = (
        <React.Fragment>
            <Button label="Salvar" severity="info" icon="pi pi-check" className="p-button-text"
                    onClick={salvarUsuario}/>
            <Button label="Cancelar" severity="danger" icon="pi pi-times" className="p-button-text" onClick={onHide}/>
        </React.Fragment>
    );

    return (
        <div>
            <Toast ref={toast} position="top-right"/>
            <Dialog visible={visible} style={{width: '70%'}} header="Detalhes do Operador" modal
                    footer={usuarioDialogFooter} onHide={onHide}>
                {usuario && (
                    <div className="p-fluid formgrid grid">
                        <div className="field col-12 md:col-6">
                            <label htmlFor="nome">Nome</label>
                            <InputText id="nome" value={usuario.nome} onChange={(e) => onInputChange(e, 'nome')}/>
                        </div>

                        <div className="field col-12 md:col-6">
                            <label htmlFor="celular">Celular</label>
                            <InputText id="celular" value={usuario.celular}
                                       onChange={(e) => onInputChange(e, 'celular')}/>
                        </div>

                        <div className="field col-12 md:col-6">
                            <label htmlFor="email">Novo Email</label>
                            <InputText id="email" value={usuario.email} onChange={(e) => onInputChange(e, 'email')}/>
                        </div>

                        <div className="field col-12 md:col-6">
                            <label htmlFor="confirmEmail">Confirmar Email</label>
                            <InputText id="confirmEmail" value={confirmEmail}
                                       onChange={(e) => setConfirmEmail(e.target.value)}/>
                        </div>

                        <div className="field col-12 md:col-6">
                            <label htmlFor="senha">Nova Senha</label>
                            <Password id="senha" value={senha} onChange={(e) => setSenha(e.target.value)}
                                      feedback={false}/>
                        </div>

                        <div className="field col-12 md:col-6">
                            <label htmlFor="confirmSenha">Confirmar Senha</label>
                            <Password id="confirmSenha" value={confirmSenha}
                                      onChange={(e) => setConfirmSenha(e.target.value)} feedback={false}/>
                        </div>
                    </div>
                )}
            </Dialog>
        </div>
    );
};

export default EditarOperador;

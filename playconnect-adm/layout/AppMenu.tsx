/* eslint-disable @next/next/no-img-element */

import React, { useContext } from 'react';
import AppMenuitem from './AppMenuitem';
import { LayoutContext } from './context/layoutcontext';
import { MenuProvider } from './context/menucontext';
import { AppMenuItem } from '../types';

const AppMenu = () => {
    const { layoutConfig } = useContext(LayoutContext);

    const model: AppMenuItem[] = [
        {
            label: 'Home',
            items: [
                { label: 'Dashboard', icon: 'pi pi-fw pi-home', to: '/' }
            ]
        },
        {
            label: '',
            items: [
                { label: 'Chat', icon: 'pi pi-whatsapp', to: '/pages/chat' }
            ]
        },

        {
            label: '',
            items: [
                {label: 'Financeiro', icon: 'pi pi-fw pi-euro', to: '/pages/financeiro' }
            ]
        },

        {
            label: '',
            items: [
                {label: 'Paciente', icon: 'pi pi-fw pi-user', to: '/pages/pacientes' }
            ]
        },

        {
            label: '',
            icon: 'pi pi-fw pi-bookmark',
            items: [
                {
                    label: 'Cadastro',
                    icon: 'pi pi-fw pi-briefcase',
                    items: [
                        { label: 'Produto', icon: 'pi pi-fw pi-box', to: '/pages/cadastro/produto' },
                        { label: 'Serviço', icon: 'pi pi-fw pi-box', to: '/pages/cadastro/servico' },
                        { label: 'Cliente', icon: 'pi pi-fw pi-users', to: '/pages/cadastro/cliente' },
                        { label: 'Cadastrar Animal', icon: 'pi pi-star-fill', to: '/pages/cadastro/animal' },
                        { label: 'Fornecedor', icon: 'pi pi-fw pi-truck', to: '/pages/cadastro/fornecedor' },
                        { label: 'Usuário', icon: 'pi pi-fw pi-user', to: '/pages/cadastro/usuario' },
                    ]
                },
            ]
        },

        {
            label: '',
            items: [
                { label: 'Agendamento', icon: 'pi pi-fw pi-calendar-plus', to: '/pages/agendamentos' }
            ]
        },

        {
            label: '',
            icon: 'pi pi-fw pi-bookmark',
            items: [
                {
                    label: 'Exame',
                    icon: 'pi pi-fw pi-briefcase',
                    items: [
                        { label: 'Prontuário completo', icon: 'pi pi-fw pi-file-edit', to: '/pages/exame' },
                    ]
                },
            ]
        },

        {
            label: '',
            icon: 'pi pi-fw pi-bookmark',
            items: [
                {
                    label: 'Internação',
                    icon: 'pi pi-fw pi-briefcase',
                    items: [
                        { label: 'Prontuário completo', icon: 'pi pi-fw pi-file-edit', to: '/pages/internacao' },
                    ]
                },
            ]
        },

        {
            label: '',
            items: [
                {
                    label: 'Relatório',
                    icon: 'pi pi-fw pi-file-edit',
                    items: [
                        { label: 'Relatórios de produtos', icon: 'pi pi-fw pi-box', to: '/pages/relatorio/relatorioproduto' },
                        { label: 'Relatórios de clientes', icon: 'pi pi-fw pi-users', to: '/pages/relatorio/relatoriocliente' },
                        { label: 'Relatórios de animais', icon: 'pi pi-fw pi-star-fill', to: '/pages/relatorio/relatorioanimal' },
                        { label: 'Relatórios de fernecedores', icon: 'pi pi-fw pi-truck', to: '/pages/relatorio/relatoriofornecedor' },
                        { label: 'Relatórios de usuários', icon: 'pi pi-fw pi-user', to: '/pages/relatorio/relatoriousuario' },
                        { label: 'Relatórios de Internações', icon: 'pi pi-fw pi-user', to: '/pages/relatorio/relatoriointernacao' },
                    ]
                },
            ]
        },

        {
            label: '',
            items: [
                {label: 'NF-e', icon: 'pi pi-fw pi-copy', to: '/pages/nfe' }
            ]
        },
    ];
    return (
        <MenuProvider>
            <ul className="layout-menu">
                {model.map((item, i) => {
                    return !item?.seperator ? (
                        <AppMenuitem item={item} root={true} index={i} key={item.label || `menu-item-${i}`} />
                    ) : (
                        <li className="menu-separator" key={`separator-${i}`}></li>
                    );
                })}
                <img
                    className="w-full mt-3"
                    src={`/layout/images/logo-${layoutConfig.colorScheme !== 'light' ? 'white' : 'dark'}.svg`}
                    alt="logo"
                />
            </ul>
        </MenuProvider>
    );

};

export default AppMenu;

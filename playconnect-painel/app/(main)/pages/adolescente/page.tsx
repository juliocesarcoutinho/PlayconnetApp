"use client";
import React, {useEffect, useState} from 'react';
import {DataTable} from 'primereact/datatable';
import {Column} from 'primereact/column';
import {ProgressSpinner} from 'primereact/progressspinner';
import UsuarioService from "@/demo/services/usuario/UsuarioService";
import {InputText} from "primereact/inputtext";
import {FilterMatchMode} from "primereact/api";
import UsuarioPessoa = Demo.UsuarioPessoa;

const UsuarioPessoaDataTable = () => {
    const [usuarios, setUsuarios] = useState<(UsuarioPessoa)[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [filters, setFilters] = useState<any>({global: {value: '', matchMode: 'contains'}});
    const [globalFilterValue, setGlobalFilterValue] = useState('');

    useEffect(() => {
        const fetchUsuarios = async () => {
            setLoading(true);
            try {
                const fetchedUsuarios = await UsuarioService.getUsuarioPessoa();
                console.log(fetchedUsuarios);
                if (fetchedUsuarios) {
                    setUsuarios(Array.isArray(fetchedUsuarios) ? fetchedUsuarios : [fetchedUsuarios]);
                }
            } catch (error) {
                console.error('Erro ao buscar usuários:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchUsuarios();
    }, []);

    if (loading) {
        return <ProgressSpinner/>;
    }

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
                <h5 className="m-0">Listagem de Adolecentes</h5>
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
        <div className="card">
            <DataTable value={usuarios} responsiveLayout="scroll"
                       emptyMessage="Nenhum registro encontrado..."
                       loading={loading}
                       paginator
                       rows={5}
                       rowsPerPageOptions={[5, 10, 25]}
                       dataKey="id"
                       paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                       currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} usuários"
                       tableStyle={{minWidth: '50rem'}}
                       filters={filters}
                       header={header}
                       selectionMode="single">
                <Column field="id" header="Código" sortable/>
                <Column field="nome" header="Nome" sortable/>
                <Column field="email" header="Email" sortable/>
                <Column field="celular" header="Celular" sortable/>
                <Column field="pessoa?.endereco?.logradouro" header="Rua" sortable
                        body={(rowData) => rowData.pessoa?.endereco?.logradouro || 'N/A'}/>
                <Column field="pessoa?.endereco?.numero" header="Número" sortable
                        body={(rowData) => rowData.pessoa?.endereco?.numero || 'N/A'}/>
                <Column field="pessoa?.endereco?.cidade" header="Cidade" sortable
                        body={(rowData) => rowData.pessoa?.endereco?.cidade || 'N/A'}/>
            </DataTable>
        </div>
    );
};

export default UsuarioPessoaDataTable;
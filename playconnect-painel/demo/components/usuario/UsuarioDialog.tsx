import {Dialog} from 'primereact/dialog';
import {InputText} from 'primereact/inputtext';
import {InputNumber} from "primereact/inputnumber";

const UsuarioDialog = ({usuario, visible, onHide}: {
    usuario: Demo.Usuario | null,
    visible: boolean,
    onHide: () => void
}) => {
    return (
        <Dialog header="Detalhes do Usuário" visible={visible} style={{width: '50vw'}} onHide={onHide}>
            {usuario && (
                <div className="p-fluid">
                    <div className="field">
                        <label htmlFor="id">ID</label>
                        <InputNumber id="id" value={usuario.id} disabled/>
                    </div>
                    <div className="field">
                        <label htmlFor="nome">Nome</label>
                        <InputText id="nome" value={usuario.nome} disabled/>
                    </div>
                    <div className="field">
                        <label htmlFor="email">Email</label>
                        <InputText id="email" value={usuario.email} disabled/>
                    </div>
                    <div className="field">
                        <label htmlFor="celular">Celular</label>
                        <InputText id="celular" value={usuario.celular} disabled/>
                    </div>
                    <div className="field">
                        <label htmlFor="roles">Funções</label>
                        <InputText id="roles" value={usuario.roles.map(role => role.descricao).join(', ')} disabled/>
                    </div>
                    <div className="field">
                        <label htmlFor="status">Status</label>
                        <InputText id="status" value={usuario.ativo ? 'Ativo' : 'Inativo'} disabled/>
                    </div>
                </div>
            )}
        </Dialog>
    );
};

export default UsuarioDialog;
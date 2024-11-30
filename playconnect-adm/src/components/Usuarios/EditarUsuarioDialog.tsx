import React, {useEffect, useState} from "react";
import {Dialog} from "@headlessui/react";
import {Usuario} from "@/services/usuario/UsuarioService";
import toast from "react-hot-toast";

interface EditarUsuarioDialogProps {
    isOpen: boolean;
    onClose: () => void;
    usuario: Usuario | null;
    onSave: (usuario: Usuario) => void;
}

const EditarUsuarioDialog: React.FC<EditarUsuarioDialogProps> = ({isOpen, onClose, usuario, onSave}) => {
    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [celular, setCelular] = useState("");
    const [endereco, setEndereco] = useState({
        cep: "",
        logradouro: "",
        numero: "",
        complemento: "",
        bairro: "",
        cidade: "",
        estado: "",
    });
    const [roles, setRoles] = useState<{ id: number; descricao: string; tipoUsuario: string }[]>([]);

    useEffect(() => {
        if (usuario) {
            setNome(usuario.nome);
            setEmail(usuario.email);
            setCelular(usuario.celular || "");
            setEndereco(usuario.endereco || {
                cep: "",
                logradouro: "",
                numero: "",
                complemento: "",
                bairro: "",
                cidade: "",
                estado: "",
            });
            setRoles(usuario.roles || []);
        }
    }, [usuario]);

    const handleEnderecoChange = (field: keyof typeof endereco, value: string) => {
        setEndereco((prevEndereco) => ({...prevEndereco, [field]: value}));
    };

    const handleSave = () => {
        if (usuario) {
            const updatedUsuario = {...usuario, nome, email, celular, endereco, roles};
            onSave(updatedUsuario);
            onClose();
            toast.success("Usuário atualizado com sucesso!");
        }
    };

    return (
        <Dialog open={isOpen} onClose={onClose} className="fixed inset-0 z-10 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4">
                <div className="fixed inset-0 bg-black opacity-30"></div>
                <div className="relative bg-white rounded max-w-lg mx-auto p-6 shadow-lg">
                    <h2 className="text-lg font-semibold mb-4">Editar Usuário</h2>
                    <form className="space-y-4">
                        <div className="max-w-2xl mx-auto bg-white p-16">
                            <form>
                                <div className="grid gap-6 mb-6 lg:grid-cols-2">
                                    {/* Nome */}
                                    <div>
                                        <label htmlFor="nome"
                                               className="block mb-2 text-sm font-medium text-gray-900">Nome</label>
                                        <input
                                            type="text"
                                            id="nome"
                                            value={nome}
                                            onChange={(e) => setNome(e.target.value)}
                                            placeholder="Digite o nome"
                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                        />
                                    </div>
                                    {/* Email */}
                                    <div>
                                        <label htmlFor="email"
                                               className="block mb-2 text-sm font-medium text-gray-900">Email</label>
                                        <input
                                            type="email"
                                            id="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="Digite o email"
                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                        />
                                    </div>
                                    {/* Celular */}
                                    <div>
                                        <label htmlFor="celular"
                                               className="block mb-2 text-sm font-medium text-gray-900">Celular</label>
                                        <input
                                            type="text"
                                            id="celular"
                                            value={celular}
                                            onChange={(e) => setCelular(e.target.value)}
                                            placeholder="Digite o celular"
                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                        />
                                    </div>
                                </div>
                                <h3 className="text-lg font-medium text-gray-900 mb-4">Endereço</h3>
                                <div className="grid gap-6 mb-6 lg:grid-cols-2">
                                    {/* CEP */}
                                    <div>
                                        <label htmlFor="cep"
                                               className="block mb-2 text-sm font-medium text-gray-900">CEP</label>
                                        <input
                                            type="text"
                                            id="cep"
                                            value={endereco.cep}
                                            onChange={(e) => handleEnderecoChange("cep", e.target.value)}
                                            placeholder="Digite o CEP"
                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                        />
                                    </div>
                                    {/* Logradouro */}
                                    <div>
                                        <label htmlFor="logradouro"
                                               className="block mb-2 text-sm font-medium text-gray-900">Logradouro</label>
                                        <input
                                            type="text"
                                            id="logradouro"
                                            value={endereco.logradouro}
                                            onChange={(e) => handleEnderecoChange("logradouro", e.target.value)}
                                            placeholder="Digite o logradouro"
                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                        />
                                    </div>
                                    {/* Número */}
                                    <div>
                                        <label htmlFor="numero"
                                               className="block mb-2 text-sm font-medium text-gray-900">Número</label>
                                        <input
                                            type="text"
                                            id="numero"
                                            value={endereco.numero}
                                            onChange={(e) => handleEnderecoChange("numero", e.target.value)}
                                            placeholder="Digite o número"
                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                        />
                                    </div>
                                    {/* Complemento */}
                                    <div>
                                        <label htmlFor="complemento"
                                               className="block mb-2 text-sm font-medium text-gray-900">Complemento</label>
                                        <input
                                            type="text"
                                            id="complemento"
                                            value={endereco.complemento}
                                            onChange={(e) => handleEnderecoChange("complemento", e.target.value)}
                                            placeholder="Digite o complemento"
                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                        />
                                    </div>
                                    {/* Bairro */}
                                    <div>
                                        <label htmlFor="bairro"
                                               className="block mb-2 text-sm font-medium text-gray-900">Bairro</label>
                                        <input
                                            type="text"
                                            id="bairro"
                                            value={endereco.bairro}
                                            onChange={(e) => handleEnderecoChange("bairro", e.target.value)}
                                            placeholder="Digite o bairro"
                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                        />
                                    </div>
                                    {/* Cidade */}
                                    <div>
                                        <label htmlFor="cidade"
                                               className="block mb-2 text-sm font-medium text-gray-900">Cidade</label>
                                        <input
                                            type="text"
                                            id="cidade"
                                            value={endereco.cidade}
                                            onChange={(e) => handleEnderecoChange("cidade", e.target.value)}
                                            placeholder="Digite a cidade"
                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                        />
                                    </div>
                                    {/* Estado */}
                                    <div>
                                        <label htmlFor="estado"
                                               className="block mb-2 text-sm font-medium text-gray-900">Estado</label>
                                        <input
                                            type="text"
                                            id="estado"
                                            value={endereco.estado}
                                            onChange={(e) => handleEnderecoChange("estado", e.target.value)}
                                            placeholder="Digite o estado"
                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                        />
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={handleSave}
                                    className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
                                >
                                    Salvar
                                </button>
                            </form>
                        </div>

                    </form>
                </div>
            </div>
        </Dialog>
    );
};

export default EditarUsuarioDialog;

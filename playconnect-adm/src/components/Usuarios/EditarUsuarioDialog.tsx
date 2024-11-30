import React, {useEffect, useState} from "react";
import {Dialog} from "@headlessui/react";
import {Usuario, UsuarioService} from "@/services/usuario/UsuarioService";
import toast from "react-hot-toast";
import {EyeIcon} from "@heroicons/react/16/solid";
import classNames from "classnames";

interface EditarUsuarioDialogProps {
    isOpen: boolean;
    onClose: () => void;
    usuario: Usuario | null;
    onSave: (usuario: Usuario) => void;
}

const EditarUsuarioDialog: React.FC<EditarUsuarioDialogProps> = ({
                                                                     isOpen,
                                                                     onClose,
                                                                     usuario,
                                                                     onSave,
                                                                 }) => {
    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [celular, setCelular] = useState("");
    const [senha, setSenha] = useState("");
    const [senhaVisivel, setSenhaVisivel] = useState(false);
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
    const [apiErrorMessage, setApiErrorMessage] = useState("");
    const [validationErrors, setErrors] = useState({
        nome: false,
        email: false,
        celular: false,
        endereco: {
            cep: false,
            logradouro: false,
            numero: false,
        },
    });

    useEffect(() => {
        if (usuario) {
            setNome(usuario.nome);
            setEmail(usuario.email);
            setSenha(usuario.senha || "");
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

    const resetForm = () => {
        setNome("");
        setEmail("");
        setSenha("");
        setCelular("");
        setEndereco({
            cep: "",
            logradouro: "",
            numero: "",
            complemento: "",
            bairro: "",
            cidade: "",
            estado: "",
        });
        setRoles([]);
        setErrors({
            nome: false,
            email: false,
            celular: false,
            endereco: {
                cep: false,
                logradouro: false,
                numero: false,
            },
        });
        setApiErrorMessage("");
    };

    const validaCampos = () => {
        const errors = {
            nome: !nome.trim(),
            email: !email.trim(),
            celular: !celular.trim(),
            endereco: {
                cep: !endereco.cep.trim(),
                logradouro: !endereco.logradouro.trim(),
                numero: !endereco.numero.trim(),
            },
        };
        setErrors(errors);

        return Object.values(errors).some((error) =>
            typeof error === "boolean" ? error : Object.values(error).some((subError) => subError)
        );
    };

    const handleEnderecoChange = (field: keyof typeof endereco, value: string) => {
        setEndereco((prevEndereco) => ({...prevEndereco, [field]: value}));
    };

    const handleSave = async () => {
        if (validaCampos()) {
            toast.error("Por favor, corrija os erros nos campos.");
            return;
        }

        if (usuario) {
            const updatedUsuario = {...usuario, nome, email, celular, endereco, roles};
            try {
                const response = await UsuarioService.editUsuario(updatedUsuario);
                if (response.success) {
                    onSave(updatedUsuario);
                    onClose();
                    resetForm();
                    toast.success("Usuário atualizado com sucesso!");
                } else {
                    setApiErrorMessage(response.message || "Erro ao atualizar usuário.");
                }
            } catch (error) {
                console.error("Erro ao atualizar usuário:", error);
                setApiErrorMessage("Erro ao atualizar usuário. Tente novamente.");
            }
        }
    };

    const handleClose = () => {
        resetForm();
        onClose();
    };

    return (
        <Dialog open={isOpen} onClose={handleClose} className="fixed inset-0 z-10 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4">
                <div className="fixed inset-0 bg-black opacity-30"></div>
                <div className="relative bg-white rounded-lg max-w-4xl w-full mx-auto p-10 shadow-lg">
                    <h2 className="text-lg font-semibold mb-4">Editar Usuário</h2>
                    <form>
                        <div className="grid gap-6 mb-6 lg:grid-cols-2">
                            <div>
                                <label htmlFor="nome"
                                       className="block mb-2 text-sm font-medium text-gray-900">Nome</label>
                                <input
                                    type="text"
                                    id="nome"
                                    value={nome}
                                    onChange={(e) => setNome(e.target.value)}
                                    placeholder="Digite o nome"
                                    className={classNames(
                                        'bg-gray-50 border text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5',
                                        {
                                            'border-red-500': validationErrors.nome,
                                            'border-gray-300': !validationErrors.nome,
                                        }
                                    )}
                                />
                                {validationErrors.nome && (
                                    <p className="text-sm text-red-500 mt-1">O campo Nome é obrigatório.</p>
                                )}
                            </div>
                            <div>
                                <label htmlFor="email"
                                       className="block mb-2 text-sm font-medium text-gray-900">Email</label>
                                <input
                                    type="email"
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Digite o email"
                                    className={classNames(
                                        'bg-gray-50 border text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5',
                                        {
                                            'border-red-500': validationErrors.email,
                                            'border-gray-300': !validationErrors.email,
                                        }
                                    )}
                                />
                                {validationErrors.email && (
                                    <p className="text-sm text-red-500 mt-1">O campo Email é obrigatório.</p>
                                )}
                            </div>
                        </div>
                        <div className="grid gap-6 mb-6 lg:grid-cols-2">
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
                            <div>
                                <label htmlFor="senha"
                                       className="block mb-2 text-sm font-medium text-gray-900">Senha</label>
                                <div className="relative">
                                    <input
                                        type={senhaVisivel ? "text" : "password"}
                                        id="senha"
                                        value={senha}
                                        onChange={(e) => setSenha(e.target.value)}
                                        placeholder="Digite sua senha"
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 pr-10"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setSenhaVisivel(!senhaVisivel)}
                                        className="absolute inset-y-0 right-0 flex items-center pr-3"
                                    >
                                        <EyeIcon
                                            className={`w-5 h-5 ${senhaVisivel ? "text-blue-500" : "text-gray-500"}`}/>
                                    </button>
                                </div>
                            </div>
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Endereço</h3>
                        <div className="grid gap-6 mb-6 lg:grid-cols-3">
                            <div>
                                <label htmlFor="cep"
                                       className="block mb-2 text-sm font-medium text-gray-900">CEP</label>
                                <input
                                    type="text"
                                    id="cep"
                                    value={endereco.cep}
                                    onChange={(e) => handleEnderecoChange("cep", e.target.value)}
                                    placeholder="Digite o CEP"
                                    className={classNames(
                                        'bg-gray-50 border text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5',
                                        {
                                            'border-red-500': validationErrors.endereco.cep,
                                            'border-gray-300': !validationErrors.endereco.cep,
                                        }
                                    )}
                                />
                                {validationErrors.endereco.cep && (
                                    <p className="text-sm text-red-500 mt-1">O campo CEP é obrigatório.</p>
                                )}
                            </div>
                            <div className="lg:col-span-2">
                                <label htmlFor="logradouro"
                                       className="block mb-2 text-sm font-medium text-gray-900">Logradouro</label>
                                <input
                                    type="text"
                                    id="logradouro"
                                    value={endereco.logradouro}
                                    onChange={(e) => handleEnderecoChange("logradouro", e.target.value)}
                                    placeholder="Digite o logradouro"
                                    className={classNames(
                                        'bg-gray-50 border text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5',
                                        {
                                            'border-red-500': validationErrors.endereco.logradouro,
                                            'border-gray-300': !validationErrors.endereco.logradouro,
                                        }
                                    )}
                                />
                                {validationErrors.endereco.logradouro && (
                                    <p className="text-sm text-red-500 mt-1">O campo Logradouro é obrigatório.</p>
                                )}
                            </div>
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
                            <div className="lg:col-span-2">
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
                        </div>
                        <div className="flex flex-col sm:flex-row sm:justify-end gap-4 mt-6">
                            <button
                                type="button"
                                onClick={handleSave}
                                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
                            >
                                Salvar
                            </button>
                            <button
                                type="button"
                                onClick={handleClose}
                                className="text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
                            >
                                Cancelar
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </Dialog>
    );
};

export default EditarUsuarioDialog;
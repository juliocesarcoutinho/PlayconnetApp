"use client";
import {LoginService} from "@/services/login/LoginService";
import {useRouter} from "next/navigation"; // Importação corrigida
import React from "react";
import toast from "react-hot-toast";

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = React.useState("");
    const [senha, setSenha] = React.useState("");

    const login = async () => {
        try {
            const response = await LoginService.login(email, senha);
            if (response.success) {
                toast.success("Login realizado com sucesso!");
                router.push("pages/dashboard");
            } else {
                toast.error(response.message || "Erro ao realizar login.");
            }
        } catch {
            toast.error("Erro inesperado ao realizar login.");
        }
    };

    return (
        <div>
            <div
                data-dialog-backdrop="sign-in-modal"
                data-dialog-backdrop-close="true"
                className="inset-0 z-[999] grid h-screen w-screen place-items-center bg-black bg-opacity-60 backdrop-blur-sm transition-opacity duration-300"
            >
                <div
                    data-dialog="sign-in-modal"
                    className="relative mx-auto w-full max-w-[24rem] rounded-lg overflow-hidden shadow-sm"
                >
                    <div className="relative flex flex-col bg-white">
                        <div
                            className="relative m-2 items-center flex justify-center text-white h-24 rounded-md bg-slate-800">
                            <h3 className="text-2xl">Play Connect</h3>
                        </div>
                        <div className="flex flex-col gap-4 p-6">
                            <div className="w-full max-w-sm min-w-[200px]">
                                <label
                                    htmlFor="email"
                                    className="block mb-2 text-sm text-slate-600"
                                >
                                    Email
                                </label>
                                <input
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    type="email"
                                    className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                                    placeholder="Digite seu email"
                                />
                            </div>

                            <div className="w-full max-w-sm min-w-[200px]">
                                <label
                                    htmlFor="senha"
                                    className="block mb-2 text-sm text-slate-600"
                                >
                                    Senha
                                </label>
                                <input
                                    id="senha"
                                    value={senha}
                                    onChange={(e) => setSenha(e.target.value)}
                                    type="password"
                                    className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                                    placeholder="Digite sua senha"
                                />
                            </div>

                            <div className="inline-flex items-center mt-2">
                                <label
                                    className="flex items-center cursor-pointer relative"
                                    htmlFor="check-2"
                                >
                                    <input
                                        type="checkbox"
                                        className="peer h-5 w-5 cursor-pointer transition-all appearance-none rounded shadow hover:shadow-md border border-slate-300 checked:bg-slate-800 checked:border-slate-800"
                                        id="check-2"
                                        title="Lembre-me checkbox"
                                    />
                                    <span
                                        className="absolute text-white opacity-0 pointer-events-none peer-checked:opacity-100 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-3.5 w-3.5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        stroke="currentColor"
                        strokeWidth="1"
                        aria-label="Checked"
                    >
                      <title>Checked</title>
                      <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                      />
                    </svg>
                  </span>
                                </label>
                                <label
                                    className="cursor-pointer ml-2 text-slate-600 text-sm"
                                    htmlFor="check-2"
                                >
                                    Lembre - me
                                </label>
                            </div>
                        </div>
                        <div className="p-6 pt-0">
                            <button
                                onClick={login}
                                className="w-full rounded-md bg-slate-800 py-2 px-4 border border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                                type="button"
                            >
                                Entrar
                            </button>
                            <p className="flex justify-center mt-6 text-sm text-slate-600">
                                Não tem uma conta?
                                <a
                                    href="#signup"
                                    className="ml-1 text-sm font-semibold text-slate-700 underline"
                                >
                                    Crie aqui
                                </a>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

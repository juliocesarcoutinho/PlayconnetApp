"use client";

import SideBar from "@/components/sidebar/SideBar";
import Header from "@/components/header/page";
import Footer from "@/components/footer/Footer";
import React from "react";
import {FaUserFriends} from "react-icons/fa";

export default function UsuariosPage() {
    return (
        <div className="min-h-screen flex flex-col bg-gray-50/50">
            <SideBar/>
            <div className="flex flex-col flex-grow xl:ml-80">
                <Header/>
                <div className="flex-grow p-8">
                    <div className="flex flex-col items-center gap-4">
                        <FaUserFriends size={64} className="text-blue-gray-500"/>
                        <h1 className="text-2xl font-semibold text-blue-gray-900">Bem-vindo aos Usuários</h1>
                        <p className="text-blue-gray-500">
                            Aqui você pode gerenciar todos os usuários do sistema.
                        </p>
                        {/* Renderiza apenas o componente da tabela */}

                    </div>
                </div>
                <Footer/>
            </div>
        </div>
    );
}

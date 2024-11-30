"use client";
import SideBar from "@/components/sidebar/SideBar";
import Header from "@/components/header/page";
import React from "react";
import Footer from "@/components/footer/Footer";
import {BiBible} from "react-icons/bi";

export default function MensagensPage() {
    return (
        <div>
            <div className="min-h-screen flex flex-col bg-gray-50/50">
                <SideBar/>
                <div className="flex flex-col flex-grow xl:ml-80">
                    <Header/>
                    <div className="flex flex-grow items-center justify-center">
                        <div className="flex flex-col items-center gap-4">
                            <BiBible size={64} className="text-blue-gray-500"/>
                            <h1 className="text-2xl font-semibold text-blue-gray-900">Bem-vindo ao Mensagens</h1>
                            <p className="text-blue-gray-500">Aqui você pode gerenciar todas as mensagens do
                                sistema.</p>
                        </div>
                    </div>
                    <Footer/>
                </div>
            </div>
        </div>
    );
}
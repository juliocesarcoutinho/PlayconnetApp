"use client";
import React from "react";
import SideBar from "@/components/sidebar/SideBar";
import Header from "@/components/header/page";
import Footer from "@/components/footer/Footer";
import {FaPeopleGroup} from "react-icons/fa6";

export default function Dashboard() {
    return (
        <div className="min-h-screen flex flex-col bg-gray-50/50">
            <SideBar/>
            <div className="flex flex-col flex-grow xl:ml-80">
                <Header/>
                <div className="flex flex-grow items-center justify-center">
                    <div className="flex flex-col items-center gap-4">
                        <FaPeopleGroup size={64} className="text-blue-gray-500"/>
                        <h1 className="text-2xl font-semibold text-blue-gray-900">Bem-vindo ao Dashboard</h1>
                        <p className="text-blue-gray-500">Aqui você pode gerenciar todos os usuários do sistema.</p>
                    </div>
                </div>
                <Footer/>
            </div>
        </div>
    );
}
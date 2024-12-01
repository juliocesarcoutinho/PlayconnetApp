import {Metadata} from 'next';
import Layout from '../../layout/layout';
import React from 'react';
import '../globals.css'

interface AppLayoutProps {
    children: React.ReactNode;
}

export const metadata: Metadata = {
    title: 'Play Connect - Painel de Controle',
    description: 'Play Connect - Painel de Controle',
    robots: {index: false, follow: false},
    openGraph: {
        type: 'website',
        title: 'Pet System TopOne',
        description: 'Um sistema para clinicas veterinárias',
        ttl: 604800
    },
    icons: {
        icon: '/favicon.ico'
    }
};

export const viewport = {
    initialScale: 1,
    width: 'device-width'
};

export default function AppLayout({children}: AppLayoutProps) {
    return <Layout>{children}</Layout>;
}

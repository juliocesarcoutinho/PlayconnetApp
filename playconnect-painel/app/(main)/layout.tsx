import { Metadata } from 'next';
import Layout from '../../layout/layout';
import React from 'react';

interface AppLayoutProps {
    children: React.ReactNode;
}

export const metadata: Metadata = {
    title: 'Play Connect - Painel de controle',
    description: 'Um sistema para o play connect',
    robots: { index: false, follow: false },
    openGraph: {
        type: 'website',
        title: 'Play Connect - Painel de controle',
        description: 'Um sistema para o play connect',
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

export default function AppLayout({ children }: AppLayoutProps) {
    return <Layout>{children}</Layout>;
}

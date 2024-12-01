// app/layout.tsx ou app/page.tsx

import {PrimeReactProvider} from 'primereact/api';
import 'primereact/resources/primereact.css';
import 'primeflex/primeflex.css';
import 'primeicons/primeicons.css';
import '../styles/layout/layout.scss';
import '../styles/demo/Demos.scss';
import {LayoutProvider} from '../layout/context/layoutcontext';
import Head from "next/head";

export default function RootLayout({children}: { children: React.ReactNode }) {
    return (
        <html lang="pt-br">
        <Head>
            <link id="theme-css" href={`/themes/vela-orange/theme.css`} rel="stylesheet"/>
        </Head>
        <body>
        <PrimeReactProvider>
            <LayoutProvider>{children}</LayoutProvider>
        </PrimeReactProvider>
        </body>
        </html>
    );
}
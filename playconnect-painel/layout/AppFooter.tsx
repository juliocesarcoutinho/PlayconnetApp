/* eslint-disable @next/next/no-img-element */

import React, { useContext } from 'react';
import { LayoutContext } from './context/layoutcontext';

const AppFooter = () => {
    const { layoutConfig } = useContext(LayoutContext);

    return (
        <div className="layout-footer">
            <span className="font-medium ml-2">
                © Copyright 2024, Todos os direitos reservados Ibrec Church
            </span>
        </div>
    );
};

export default AppFooter;

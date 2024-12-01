import React, { useContext, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Ripple } from 'primereact/ripple';
import { classNames } from 'primereact/utils';
import { CSSTransition } from 'react-transition-group';
import { MenuContext } from './context/menucontext';
import { AppMenuItemProps } from '../types';

const AppMenuitem = (props: AppMenuItemProps) => {
    const pathname = usePathname();
    const { activeMenu, setActiveMenu } = useContext(MenuContext);
    const item = props.item;
    const key = props.parentKey ? props.parentKey + '-' + props.index : String(props.index);
    const isActiveRoute = item!.to && pathname === item!.to;
    const active = activeMenu === key || activeMenu.startsWith(key + '-');
    const submenuRef = useRef<HTMLUListElement>(null);

    useEffect(() => {
        // Atualiza o menu ativo sempre que a rota mudar
        if (item!.to && pathname === item!.to) {
            setActiveMenu(key);
        }
    }, [pathname]); // Observe apenas o `pathname`

    const itemClick = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        if (item!.disabled) {
            event.preventDefault();
            return;
        }

        if (item!.command) {
            item!.command({ originalEvent: event, item: item });
        }

        if (item!.items) {
            setActiveMenu(active ? (props.parentKey as string) : key);
        } else {
            setActiveMenu(key);
        }
    };

    const subMenu = item!.items && item!.visible !== false && (
        <CSSTransition
            timeout={{ enter: 1000, exit: 450 }}
            classNames="layout-submenu"
            in={props.root ? true : active}
            nodeRef={submenuRef}
        >
            <ul ref={submenuRef}>
                {item!.items.map((child, i) => (
                    <AppMenuitem item={child} index={i} className={child.badgeClass} parentKey={key} key={child.label} />
                ))}
            </ul>
        </CSSTransition>
    );

    return (
        <li className={classNames({ 'layout-root-menuitem': props.root, 'active-menuitem': active })} key={`${item!.label}-${props.index}`}>
            {props.root && item!.visible !== false && (
                <div className="layout-menuitem-root-text">{item!.label}</div>
            )}

            {(!item!.to || item!.items) && item!.visible !== false ? (
                <a
                    href={item!.url}
                    onClick={(e) => itemClick(e)}
                    className={classNames(item!.class, 'p-ripple')}
                    target={item!.target}
                    tabIndex={0}
                >
                    <i className={classNames('layout-menuitem-icon', item!.icon)}></i>
                    <span className="layout-menuitem-text">{item!.label}</span>
                    {item!.items && <i className="pi pi-fw pi-angle-down layout-submenu-toggler"></i>}
                    <Ripple />
                </a>
            ) : null}

            {item!.to && !item!.items && item!.visible !== false ? (
                <Link
                    href={item!.to}
                    replace={item!.replaceUrl}
                    target={item!.target}
                    onClick={(e) => itemClick(e)}
                    className={classNames(item!.class, 'p-ripple', { 'active-route': isActiveRoute })}
                    tabIndex={0}
                >
                    <i className={classNames('layout-menuitem-icon', item!.icon)}></i>
                    <span className="layout-menuitem-text">{item!.label}</span>
                    {item!.items && <i className="pi pi-fw pi-angle-down layout-submenu-toggler"></i>}
                    <Ripple />
                </Link>
            ) : null}

            {subMenu}
        </li>
    );
};

export default AppMenuitem;

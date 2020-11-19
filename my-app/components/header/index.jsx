import React from 'react';
import styles from './style.module.scss';
import { TabMenu } from 'primereact/tabmenu';
import { useRouter } from 'next/router';


const Header = ({isAdmin = false, url = '/events'}) => {

    const router = useRouter();

    const items = [
        { label: 'События', url: '/events' },
        { label: 'Панель администратора', url: '/admin' }
    ]

    if (isAdmin) {
        items.push(
            { label: 'Events', url: '/admin/events' },
            { label: 'Companions', url: '/admin/companions' },
            { label: 'Subjects', url: '/admin/subjects' }
        )
    }

    return (
        <header className={`p-p-3 p-shadow-1 ${styles.header}`}>
            <TabMenu
                model={items}
                activeItem={items.find(el => el.url === url)}
                onTabChange={(e) => router.push(e.value.url)}
            />
        </header>
    )
}

export default Header;
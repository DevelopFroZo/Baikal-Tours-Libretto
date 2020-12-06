import React, { useState } from 'react';
import styles from './style.module.scss';
import { TabMenu } from 'primereact/tabmenu';
import { useRouter } from 'next/router';
import { Button } from 'primereact/button';
import SignIn from '../SignIn';
import SignUp from '../SignUp';
import port from '../../helpers/port';

const Header = ({ url, user }) => {

    const router = useRouter();
    const items = [{ label: 'События', url: '/' }]
    const isAdmin = user?.payload?.role === 'admin';
    const isAuthorized = !('error' in user);

    const [visibleSigninDialog, setVisibleSigninDialog] = useState(false);
    const [visibleSignupDialog, setVisibleSignupDialog] = useState(false);

    if (isAdmin) {
        items.push(
            { label: 'Events', url: '/admin/events' },
            { label: 'Companions', url: '/admin/companions' },
            { label: 'Subjects', url: '/admin/subjects' }
        )
    }

    const logout = async () => {
        const singOutResponse = await fetch(`http://localhost:${port}/auth/signOut`, {
            method: 'GET',
            credentials: 'include',
            headers: {
                cookie: document.cookie
            }
        });

        router.push('/');
    }

    return (
        <header className={`p-p-3 p-shadow-1 ${styles.header} p-d-flex p-jc-between p-ai-center`}>

            <TabMenu
                model={items}
                activeItem={items.find(el => el.url === url)}
                onTabChange={(e) => router.push(e.value.url)}
            />

            <div className='p-d-flex p-ai-center'>
                {isAuthorized ?
                    <>
                        <Button
                            label='Личный кабинет'
                            icon='pi pi-home'
                            onClick={() => router.push('/profile')}
                        />
                        <Button
                            label='Выйти'
                            className='p-ml-3 p-button-danger'
                            onClick={logout}
                        />
                    </>
                    :
                    <>
                        <Button
                            label='Вход'
                            onClick={() => setVisibleSigninDialog(true)}
                        />
                        <Button
                            label='Регистрация'
                            className='p-ml-3'
                            onClick={() => setVisibleSignupDialog(true)}
                        />
                    </>
                }
            </div>

            <SignIn
                user={user}
                isVisible={visibleSigninDialog}
                setIsVisible={setVisibleSigninDialog}
            />

            <SignUp
                user={user}
                isVisible={visibleSignupDialog}
                setIsVisible={setVisibleSignupDialog}
            />

        </header>
    )
}

export default Header;
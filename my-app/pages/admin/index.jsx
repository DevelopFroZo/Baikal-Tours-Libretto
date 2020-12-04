import Container from '../../components/Container';
import Header from '../../components/header';
import styles from './style.module.scss';
import { Button } from 'primereact/button';
import { useState, useEffect } from 'react';

export default function Index() {
    const [user, setUser] = useState();

    useEffect(async () => {
        const userResponse = await fetch(`http://localhost:${port}/users/current`, {
            method: 'GET',
            credentials: 'include'
        });

        const user = await userResponse.json();
        setUser(user);
    }, [])

    return (
        <Container>
            <Header isAdmin={ user !== undefined && 'payload' in user && user.payload.role === 'admin' } url='/admin' />
            <Button
                icon='pi'
                label={isAdmin ? 'I\'m not Admin(' : 'I\'m Admin 😎'}
                className='p-mt-3 p-d-block'
                onClick={() => { isAdmin ? setIsAdmin(false) : setIsAdmin(true) }}
                className={styles.container}
            />
        </Container>
    )
}
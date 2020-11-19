import Container from '../../components/Container';
import Header from '../../components/header';
import styles from './style.module.scss';
import { Button } from 'primereact/button';
import { useState } from 'react';

export default function Index() {
    const [isAdmin, setIsAdmin] = useState(false);

    return (
        <Container>
            <Header isAdmin={isAdmin} url='/admin' />
            <Button
                    icon='pi'
                    label={isAdmin ? 'I\'m not Admin(' : 'I\'m Admin 😎'}
                    className='p-mt-3 p-d-block'
                    onClick={() => {isAdmin ? setIsAdmin(false) : setIsAdmin(true)} }
                    className={styles.container}
                />
        </Container>
    )
}
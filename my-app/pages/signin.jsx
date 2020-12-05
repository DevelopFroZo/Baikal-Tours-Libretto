import Container from '../components/Container';
import port from '../helpers/port';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function SignIn({user}) {
    const router = useRouter();

    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    let toast;

    useEffect(() => {
        if ('payload' in user) {
            router.push('/')
        }
    }, [])

    const signIn = async () => {
        const res = await fetch(`http://localhost:${port}/auth/signIn`, {
            credentials: 'include',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                login,
                password
            })
        });

        const user = await res.json();

        if ('error' in user) {
            toast.show({
                severity: 'error',
                summary: 'Error',
                detail: user.error.message,
                life: 30000
            })
            setError(user.error.message);
        }

        if ('payload' in user) {
            router.push('/');
        }
    }

    return (
        <Container>
            <div className="p-field p-md-4 p-pl-0">
                <span className="p-float-label">
                    <InputText className={error !== '' ? 'p-invalid' : ''} id="username" value={login} onChange={(e) => setLogin(e.target.value)} />
                    <label htmlFor="username">Username</label>
                </span>
            </div>
            <div className="p-field p-md-4 p-pl-0">
                <span className="p-float-label">
                    <InputText className={error !== '' ? 'p-invalid' : ''} id="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    <label htmlFor="password">Password</label>
                </span>
            </div>
            <div className='p-mt-3'>
                <Button label='Sign in' className='p-ml-3' onClick={signIn} />
            </div>
            <Toast ref={(el) => toast = el} position='bottom-left' />
        </Container>
    )
}

export async function getServerSideProps({ req: { headers: { cookie } } }) {
    const userResponse = await fetch(`http://localhost:${port}/users/current`, {
        method: 'GET',
        credentials: 'include',
        headers: {
            cookie
        }
    });

    const user = await userResponse.json();

    return {
        props: {
            user
        }
    }
}
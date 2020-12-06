import port from '../../helpers/port';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Dialog } from 'primereact/dialog';
import { Password } from 'primereact/password';

export default function SignIn({ user, isVisible, setIsVisible }) {
    const router = useRouter();

    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    let toast;

    useEffect(() => {
        if ('payload' in user) {
            setIsVisible(false)
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

        console.log(user)

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
            router.reload();
        }
    }

    return (
        <>
            <Dialog
                header='Вход'
                visible={isVisible}
                onHide={() => setIsVisible(false)}
                style={{ width: 500, overflow: 'hidden'}}
                className='dialog-overflow-hidden'

            >
                <div className='p-field p-md-4 p-mt-5 p-pl-0 p-mx-auto center-field'>
                    <span className="p-float-label">
                        <InputText
                            className={`${error && 'p-invalid'} p-d-block`}
                            id="username" value={login}
                            onChange={(e) => setLogin(e.target.value)}
                        />
                        <label htmlFor="username">Логин</label>
                    </span>
                </div>
                <div className="p-field p-md-4 p-pl-0 p-mx-auto center-field">
                    <span className="p-float-label">
                        <Password
                            className={error && 'p-invalid'}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            id="password"
                        />
                        <label htmlFor="password">Пароль</label>
                    </span>
                </div>
                <Button 
                    label='Вход' 
                    className='p-d-block p-mt-3 p-mx-auto'
                    style={{width: 192}}
                    onClick={signIn} 
                />
            </Dialog>
            <Toast ref={(el) => toast = el} position='bottom-left' />
        </>
    )
}
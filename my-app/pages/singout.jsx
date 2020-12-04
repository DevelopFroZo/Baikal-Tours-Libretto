import Container from '../components/Container';
import port from '../helpers/port';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function SingOut() {
    const router = useRouter();

    const [user, setUser] = useState();

    useEffect(async () => {
        const userResponse = await fetch(`http://localhost:${port}/users/current`, {
            method: 'GET',
            credentials: 'include'
        })

        const user = await userResponse.json()

        if ('payload' in user) {
            const singOutResponse = await fetch(`http://localhost:${port}/auth/singOut`, {
                method: 'GET',
                credentials: 'include'
            });
        }

        router.push( '/' );

        setUser(user);
    }, [])

    return (
        <Container>

        </Container>
    )
}
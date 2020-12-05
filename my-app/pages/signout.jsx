import Container from '../components/Container';
import port from '../helpers/port';
import { useEffect } from 'react';
import { useRouter } from 'next/router';

function SignOut() {
    const router = useRouter();

    useEffect(() => {
        router.push('/');
    }, [])

    return (
        <Container>

        </Container>
    )
}

export async function getServerSideProps({ req: { headers: { cookie } } }) {
    const singOutResponse = await fetch(`http://localhost:${port}/auth/signOut`, {
        method: 'GET',
        credentials: 'include',
        headers: {
            cookie
        }
    });

    return {
        props: {
        }
    }
}

export default SignOut;
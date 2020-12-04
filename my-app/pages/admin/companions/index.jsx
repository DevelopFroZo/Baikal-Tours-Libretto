import { DataTable } from "primereact/datatable";
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { useState, useEffect } from 'react';
import Container from '../../../components/Container';
import Header from '../../../components/header';
import port from '../../../helpers/port';
import { useRouter } from 'next/router';

function Companions({ companions }) {
    const [name, setName] = useState();
    const [comps, setComps] = useState(companions);
    const [user, setUser] = useState();

    const router = useRouter()

    useEffect(async () => {
        const userResponse = await fetch(`http://localhost:${port}/users/current`, {
            method: 'GET',
            credentials: 'include'
        })

        const user = await userResponse.json()

        if( user === undefined || 'error' in user || ( 'payload' in user && user.payload.role !== 'admin' ) ){
            router.push( '/' )
        }

        setUser(user);
    }, [])

    async function click() {
        const res = await fetch(`http://localhost:${port}/companions/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name
            })
        });

        const compRes = await fetch(`http://localhost:${port}/companions/`, {
            method: 'GET',
        });

        const jsn = await compRes.json();

        setComps(jsn.payload);
    }

    return (
        <Container>
            <Header isAdmin={user !== undefined && 'payload' in user && user.payload.role === 'admin'} url='/admin/companions' />
            <h1>Companions</h1>
            <div>
                <span className="p-float-label p-mt-4">
                    <InputText value={name} onChange={(e) => setName(e.target.value)} />
                    <label htmlFor="inputtext">Name</label>
                </span>
                <Button
                    icon='pi pi-plus'
                    label='Create new subject'
                    className='p-mt-3 p-d-block'
                    onClick={click}
                />
            </div>
            <div className='p-mt-5'>
                <DataTable value={comps}>
                    <Column field='id' header='ID' sortable></Column>
                    <Column field='name' header='Name' sortable></Column>
                </DataTable>
            </div>
        </Container>
    )
}

export async function getServerSideProps() {
    const res = await fetch(`http://localhost:${port}/companions`, {
        method: 'GET'
    })

    const { payload: companions } = await res.json()

    return {
        props: {
            companions
        }
    }
}

export default Companions;
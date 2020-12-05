import Container from '../../../components/Container';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import Header from '../../../components/header';
import port from '../../../helpers/port';
import { useRouter } from 'next/router';

function Subjects({ user, subjects }) {
    const [name, setName] = useState('');
    const [subs, setSubs] = useState(subjects);

    const router = useRouter();

    useEffect(() => {
        if (user === undefined || 'error' in user || ('payload' in user && user.payload.role !== 'admin')) {
            router.push('/')
        }
    }, [])

    const click = async () => {
        const res = await fetch(`http://localhost:${port}/subjects/`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name
            })
        })

        getSubs();
    }

    async function getSubs(){
        const subRes = await fetch(`http://localhost:${port}/subjects`, {
            method: "GET"
        })

        const jsn = await subRes.json();

        setSubs(jsn.payload);
    }

    async function deleteSubs(idx){
        const res = await fetch(`http://localhost:${port}/subjects/${idx.id}`, {
            method: 'DELETE',
            credentials: 'include'
        });

        const jsn = await res.json();

        getSubs();
    }

    function renderDeleteButton(idx) {
        return (
            <Button id='delete' icon='pi pi-times' onClick={(e) => deleteSubs(idx)} className="p-button-rounded p-button-text p-button-plain"/>
        );
    }

    return (
        <Container>
            <Header isAdmin={user !== undefined && 'payload' in user && user.payload.role === 'admin'} url='/admin/subjects' />
            <h1>Subjects</h1>
            <div>
                <span className="p-float-label p-mt-4">
                    <InputText id='name' value={name} onChange={(e) => {
                        console.log(e.target.value)
                        setName(e.target.value)
                    }} />
                    <label htmlFor="name">Name</label>
                </span>
                <Button
                    icon='pi pi-plus'
                    label='Create new subject'
                    className='p-mt-3 p-d-block'
                    onClick={click}
                />
            </div>
            <div className='p-mt-5'>
                <DataTable value={subs}>
                    <Column field='id' header='ID' sortable></Column>
                    <Column field='name' header='Name' sortable></Column>
                    <Column body={idx => {
                        return renderDeleteButton(idx);
                    }} bodyStyle={{ textAlign: 'center' }} headerStyle={{ width: '4rem' }}/>
                </DataTable>
            </div>
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

    const res = await fetch(`http://localhost:${port}/subjects`, {
        method: "GET"
    })

    const { payload: subjects } = await res.json()

    return {
        props: {
            user,
            subjects
        }
    }
}

export default Subjects;
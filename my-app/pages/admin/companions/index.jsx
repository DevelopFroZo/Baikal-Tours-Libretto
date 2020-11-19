import { DataTable } from "primereact/datatable";
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { useState } from 'react';
import Container from '../../../components/Container';
import Header from '../../../components/header';
import port from '../../../helpers/port';

function Companions({ companions }) {
    const [name, setName] = useState();

    async function click() {
        const res = await fetch(`http://localhost:${port}/subjects/`, {
            method: 'POST',
            body: {
                name
            }
        })
    }

    return (
        <Container>
            <Header isAdmin={true} url='/admin/companions' />
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
                <DataTable value={companions}>
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
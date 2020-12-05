import Container from '../../../components/Container';
import Header from '../../../components/header';
import port from '../../../helpers/port';
import EventEditor from '../../../components/EventEditor';
import moment from 'moment';
import { useState, useEffect } from 'react';
import { Button } from 'primereact/button';
import { useRouter } from 'next/router'
import styles from './style.module.scss';

function Event({ user, event, companions, subjects }) {
    const [name, setName] = useState(event.name);
    const [description, setDescription] = useState(event.description);
    const [dateStart, setDateStart] = useState(new Date(event.date_start));
    const [dateEnd, setDateEnd] = useState(new Date(event.date_end));
    const [cmpns, setCmpns] = useState(event.companions);
    const [location, setLocaton] = useState(event.location);
    const [sbjcts, setSbjcts] = useState(event.subjects);

    useEffect(() => {
        if (user === undefined || 'error' in user || ('payload' in user && user.payload.role !== 'admin')) {
            router.push('/')
        }
    }, [])

    const router = useRouter()

    function cancel() {
        router.push(`/admin/events`);
    }

    async function save() {
        const body = {
            name,
            description,
            date_start: moment(dateStart).valueOf(),
            date_end: moment(dateEnd).valueOf(),
            companions: cmpns.map(el => el.id),
            location,
            subjects: sbjcts.map(el => el.id),
            image_path: event.image_path
        };

        const res = await fetch(`http://localhost:${port}/events/${event.id}`, {
            method: 'PUT',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });

        const jsn = await res.json();

        if ('payload' in jsn) {
            router.push(`/admin/events`);
        }
    }

    console.log(event)

    async function onUpload(e) {
        console.log(e.files);

        const formData = new FormData();

        formData.append('image', e.files[0]);

        const imageResponse = await fetch(`http://localhost:${port}/events/${event.id}/image`,
            {
                method: 'POST',
                body: formData
            }
        )

        const jsn = await imageResponse.json()

        console.log(jsn)

    }


    return (
        <Container>
            <Header isAdmin={user !== undefined && 'payload' in user && user.payload.role === 'admin'} url='/admin/events' />
            <h1>Event {event.id} ({name}):</h1>
            <img src={`http://localhost:${port}/${event.image_path}`} className={styles.img} />
            <EventEditor
                name={name} ChangeName={setName}
                description={description} ChangeDescription={setDescription}
                dateStart={dateStart} ChangeDateStart={setDateStart}
                dateEnd={dateEnd} ChangeDateEnd={setDateEnd}
                companions={cmpns} ChangeCompanions={setCmpns} _companions={companions}
                location={location} ChangeLocation={setLocaton}
                subjects={sbjcts} ChangeSubjects={setSbjcts} _subjects={subjects}
            />
            <div className='p-mt-3'>
                <Button icon='pi pi-angle-left' label='Cancel' className='p-button-text p-button-secondary' onClick={cancel} />
                <Button icon='pi pi-check' label='Save changes' className='p-ml-3' onClick={save} />
            </div>
        </Container>
    )
}

export async function getServerSideProps({ query, req: { headers: { cookie } } }) {
    const id = query.id;

    const userResponse = await fetch(`http://localhost:${port}/users/current`, {
        method: 'GET',
        credentials: 'include',
        headers: {
            cookie
        }
    });

    const user = await userResponse.json();

    const eventRes = await fetch(`http://localhost:${port}/events/${id}`, {
        method: 'GET'
    });

    const cmpns = await fetch(`http://localhost:${port}/companions`, {
        method: 'GET'
    });

    const sbjcts = await fetch(`http://localhost:${port}/subjects`, {
        method: 'GET'
    });

    const { payload: event } = await eventRes.json()
    const { payload: companions } = await cmpns.json();
    const { payload: subjects } = await sbjcts.json();

    return {
        props: {
            user,
            event,
            companions,
            subjects
        }
    }
}

export default Event;
import Container from '../../../components/Container';
import Header from '../../../components/header';
import port from '../../../helpers/port';
import EventEditor from '../../../components/EventEditor';
import moment from 'moment';
import { useState } from 'react';
import { Button } from 'primereact/button';
import { useRouter } from 'next/router'
import styles from './style.module.scss';

function Event({ event, companions, subjects }) {
    const [name, setName] = useState(event.name);
    const [description, setDescription] = useState(event.description);
    const [dateStart, setDateStart] = useState(new Date(event.date_start));
    const [dateEnd, setDateEnd] = useState(new Date(event.date_end));
    const [cmpns, setCmpns] = useState(event.companions);
    const [location, setLocaton] = useState(event.location);
    const [sbjcts, setSbjcts] = useState(event.subjects);

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
        };

        const res = await fetch(`http://localhost:${port}/events/${event.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });

        router.push(`/admin/events`);
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
            <Header isAdmin={true} url='/admin/events' />
            <h1>Event {event.id} ({name}):</h1>
            <img src={`http://localhost:${port}/${event.image_path}`} className={styles.img}/>
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

export async function getServerSideProps({ query, req }) {
    const id = query.id;

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
            event,
            companions,
            subjects
        }
    }
}

export default Event;
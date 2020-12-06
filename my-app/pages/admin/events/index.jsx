import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import Container from '../../../components/Container';
import Header from '../../../components/header';
import EventEditor from '../../../components/EventEditor';
import styles from './style.module.scss';
import moment from 'moment';
import port from '../../../helpers/port';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router'

function Events({ user, eventsResponse, companions, subjects }) {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [dateStart, setDateStart] = useState(new Date());
    const [dateEnd, setDateEnd] = useState(new Date());
    const [cmpns, setCmpns] = useState([]);
    const [location, setLocaton] = useState('');
    const [sbjcts, setSbjcts] = useState([]);
    const [addEvent, setAddEvent] = useState(false);
    const [events, setEvents] = useState(eventsResponse);
    const [file, setFile] = useState();

    const router = useRouter()

    useEffect(() => {
        if (user === undefined || 'error' in user || ('payload' in user && user.payload.role !== 'admin')) {
            router.push('/')
        }
    }, [])

    async function click() {
        const body = {
            name,
            description,
            date_start: moment(dateStart).valueOf(),
            date_end: moment(dateEnd).valueOf(),
            companions: cmpns.map(el => el.id),
            location,
            subjects: sbjcts.map(el => el.id),
        };

        const res = await fetch(`http://localhost:${port}/events`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });

        const { payload: id } = await res.json();

        const formData = new FormData();

        formData.append('image', file);

        const imageResponse = await fetch(`http://localhost:${port}/events/${id}/image`,
            {
                method: 'POST',
                credentials: 'include',
                body: formData
            }
        )

        const jsn = await imageResponse.json()

        getEvents();
    }

    async function getEvents(){
        const eventsRes = await fetch(`http://localhost:${port}/events`, {
            method: 'GET'
        });

        let { payload: evnts } = await eventsRes.json();

        moment.locale('ru');

        evnts = evnts.map(el => {
            el.date_start = moment(el.date_start).format('LL');
            el.date_end = moment(el.date_end).format('LL');
            el.subjects = el.subjects.map(el1 => el1.name).join(', ');
            el.companions = el.companions.map(el1 => el1.name).join(', ');

            return el;
        });

        setEvents(evnts);
    }

    function onUpload(e) {
        setFile(e.files[0]);
    }

    function onRowEditInit(e) {
        router.push(`/admin/events/${e.data.id}`);
    }

    async function deleteEvent(idx){
        const res = await fetch(`http://localhost:${port}/events/${idx.id}`, {
            method: 'DELETE',
            credentials: 'include'
        });

        const jsn = await res.json();

        getEvents();
    }

    function renderDeleteButton(idx) {
        return (
            <Button id='delete' icon='pi pi-times' onClick={(e) => deleteEvent(idx)} className="p-button-rounded p-button-text p-button-plain"/>
        );
    }

    return (
        <Container>
            <Header
                user={user} 
                url='/admin/events' 
            />
            <h1>Events</h1>
            {addEvent ? <div>
                <Button icon='pi pi-minus' label='Add new event' className='p-mt-3 p-d-block' onClick={() => setAddEvent(false)} />
                <EventEditor
                    className={styles.eventEditor}
                    name={name} ChangeName={setName}
                    description={description} ChangeDescription={setDescription}
                    dateStart={dateStart} ChangeDateStart={setDateStart}
                    dateEnd={dateEnd} ChangeDateEnd={setDateEnd}
                    companions={cmpns} ChangeCompanions={setCmpns} _companions={companions}
                    location={location} ChangeLocation={setLocaton}
                    subjects={sbjcts} ChangeSubjects={setSbjcts} _subjects={subjects}
                    onUpload={onUpload}
                />
                <Button icon='pi pi-plus' label='Create new event' className='p-mt-3 p-d-block' onClick={click} />
            </div>
                :
                <Button icon='pi pi-plus' label='Add new event' className='p-mt-3 p-d-block' onClick={() => setAddEvent(true)} />
            }
            <div className='p-mt-5'>
                <DataTable value={events} resizableColumns columnResizeMode="fit" onRowEditInit={onRowEditInit}>
                    <Column field='id' header='ID' sortable className={`${styles.column} ${styles.column_id}`}></Column>
                    <Column field='name' header='Name' sortable className={styles.column}></Column>
                    <Column field='description' header='Description' className={`${styles.column} ${styles.column_description}`}></Column>
                    <Column field='date_start' header='Date start' sortable className={styles.column}></Column>
                    <Column field='date_end' header='Date end' sortable className={styles.column}></Column>
                    <Column field='companions' header='Companions' className={styles.column}></Column>
                    <Column field='location' header='Location' className={styles.column}></Column>
                    <Column field='subjects' header='Subjects' className={styles.column}></Column>
                    <Column rowEditor headerStyle={{ width: '3rem' }} bodyStyle={{ textAlign: 'center' }}></Column>
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

    const evnts = await fetch(`http://localhost:${port}/events`, {
        method: 'GET'
    });

    let { payload: events } = await evnts.json();

    const cmpns = await fetch(`http://localhost:${port}/companions`, {
        method: 'GET'
    });

    let { payload: companions } = await cmpns.json();

    const sbjcts = await fetch(`http://localhost:${port}/subjects`, {
        method: 'GET'
    });

    let { payload: subjects } = await sbjcts.json();

    moment.locale('ru');

    events = events.map(el => {
        el.date_start = moment(el.date_start).format('LL');
        el.date_end = moment(el.date_end).format('LL');
        el.subjects = el.subjects.map(el1 => el1.name).join(', ');
        el.companions = el.companions.map(el1 => el1.name).join(', ');
        el.del = 'sdf';

        return el;
    });

    return {
        props: {
            user,
            eventsResponse: events,
            companions,
            subjects
        }
    }
}

export default Events;
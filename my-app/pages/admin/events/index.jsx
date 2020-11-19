import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Calendar } from 'primereact/calendar';
import { MultiSelect } from 'primereact/multiselect';
import { Button } from 'primereact/button';
import Container from '../../../components/Container';
import Header from '../../../components/header';
import styles from './style.module.scss';
import moment from 'moment';
import port from '../../../helpers/port';
import { useState } from 'react';

function Events({ events, companions, subjects }) {
    const [name, setName] = useState();
    const [description, setDescription] = useState();
    const [dateStart, setDateStart] = useState();
    const [dateEnd, setDateEnd] = useState();
    const [cmpns, setCmpns] = useState();
    const [location, setLocaton] = useState();
    const [sbjcts, setSbjcts] = useState();
    const [addEvent, setAddEvent] = useState(false);

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

        console.log(body)
    }

    return (
        <Container>
            <Header isAdmin={true} url='/admin/events' />
            <h1>Events</h1>
            {addEvent ? <div>
                <Button icon='pi pi-minus' label='Add new event' className='p-mt-3 p-d-block' onClick={() => setAddEvent(false)} />
                <div className="p-field p-col-12 p-md-4 p-mt-4">
                    <span className="p-float-label">
                        <InputText value={name} onChange={(e) => setName(e.target.value)} />
                        <label htmlFor="inputtext">Name</label>
                    </span>
                </div>
                <div className="p-field p-col-12 p-md-4">
                    <span className="p-float-label">
                        <InputTextarea value={description} onChange={(e) => setDescription(e.target.value)} className={styles.description} />
                        <label htmlFor="textarea">Description</label>
                    </span>
                </div>
                <div className="p-field p-col-12 p-md-4">
                    <span className="p-float-label">
                        <Calendar value={dateStart} onChange={(e) => setDateStart(e.value)} />
                        <label htmlFor="calendar">Date start</label>
                    </span>
                </div>
                <div className="p-field p-col-12 p-md-4">
                    <span className="p-float-label">
                        <Calendar value={dateEnd} onChange={(e) => setDateEnd(e.value)} />
                        <label htmlFor="calendar">Date end</label>
                    </span>
                </div>
                <div className="p-field p-col-12 p-md-4">
                    <span className="p-float-label">
                        <MultiSelect id="multiselect" value={cmpns} onChange={(e) => setCmpns(e.value)} options={companions} optionLabel="name" className={styles.multi} />
                        <label htmlFor="multiselect">Companions</label>
                    </span>
                </div>
                <div className="p-field p-col-12 p-md-4">
                    <span className="p-float-label">
                        <InputText value={location} onChange={(e) => setLocaton(e.target.value)} />
                        <label htmlFor="inputtext">Loaction</label>
                    </span>
                </div>
                <div className="p-field p-col-12 p-md-4">
                    <span className="p-float-label">
                        <MultiSelect id="multiselect" value={sbjcts} onChange={(e) => setSbjcts(e.value)} options={subjects} optionLabel="name" className={styles.multi} />
                        <label htmlFor="multiselect">Subjects</label>
                    </span>
                </div>
                <Button icon='pi pi-plus' label='Create new event' className='p-mt-3 p-d-block' onClick={click} />
            </div>
                :
                <Button icon='pi pi-plus' label='Add new event' className='p-mt-3 p-d-block' onClick={() => setAddEvent(true)} />
            }
            <div className='p-mt-5'>
                <DataTable value={events} resizableColumns columnResizeMode="fit">
                    <Column field='id' header='ID' sortable className={`${styles.column} ${styles.column_id}`}></Column>
                    <Column field='name' header='Name' sortable className={styles.column}></Column>
                    <Column field='description' header='Description' className={`${styles.column} ${styles.column_description}`}></Column>
                    <Column field='date_start' header='Date start' sortable className={styles.column}></Column>
                    <Column field='date_end' header='Date end' sortable className={styles.column}></Column>
                    <Column field='companions' header='Companions' className={styles.column}></Column>
                    <Column field='location' header='Location' className={styles.column}></Column>
                    <Column field='subjects' header='Subjects' className={styles.column}></Column>
                </DataTable>
            </div>
        </Container>
    )
}

export async function getServerSideProps() {
    const evnts = await fetch(`http://localhost:${port}/events`, {
        method: 'GET'
    });

    let { payload: events } = await evnts.json();

    const cmpns = await fetch(`http://localhost:${port}/companions`, {
        method: 'GET'
    })

    let { payload: companions } = await cmpns.json();

    const sbjcts = await fetch(`http://localhost:${port}/subjects`, {
        method: 'GET'
    })

    let { payload: subjects } = await sbjcts.json()

    moment.locale('ru')

    events = events.map(el => {
        el.date_start = moment(el.date_start).format('LL');
        el.date_end = moment(el.date_end).format('LL');
        el.subjects = el.subjects.map(el1 => el1.name).join(', ');
        el.companions = el.companions.map(el1 => el1.name).join(', ');

        return el
    })

    return {
        props: {
            events,
            companions,
            subjects
        }
    }
}

export default Events;
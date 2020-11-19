import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import Container from '../../../components/Container';
import Header from '../../../components/header';
import styles from './style.module.scss';

function Events({ events }) {
    console.log(events)

    return (
        <Container>
            <Header isAdmin={true} url='/admin/events' />
            <h1>Events</h1>
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
    const res = await fetch('http://localhost:9045/events', {
        method: 'GET'
    });

    let { payload: events } = await res.json();

    events = events.map( el => {
        el.date_start = (new Date(el.date_start)).toString();
        el.date_end = (new Date(el.date_end)).toString();
        console.log(el.subjects, typeof el.subjects)
        el.subjects = el.subjects.map( el1 => el1.name ).join(', ');
        el.companions = el.companions.map( el1 => el1.name ).join(', ');

        return el
    } )

    return {
        props: {
            events
        }
    }
}

export default Events;
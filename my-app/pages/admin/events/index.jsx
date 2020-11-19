import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import Container from '../../../components/Container';
import Header from '../../../components/header';
import styles from './style.module.scss';
import moment from 'moment';
import port from '../../../helpers/port';

function Events({ events }) {
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
    const res = await fetch(`http://localhost:${port}/events`, {
        method: 'GET'
    });

    let { payload: events } = await res.json();

    moment.locale('ru')

    events = events.map( el => {
        el.date_start = moment(el.date_start).format('LL');
        el.date_end = moment(el.date_end).format('LL');
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
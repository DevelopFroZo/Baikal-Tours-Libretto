import React, { useState, useEffect } from 'react';
import Container from '../../components/Container';
import Header from '../../components/header';
import styles from './style.module.scss';
import moment from 'moment';
import { Button } from 'primereact/button';
import { useRouter } from 'next/router';
import port from '../../helpers/port';

const Event = ({ event }) => {

    const router = useRouter();
    moment.locale('ru')

    const [user, setUser] = useState();

    useEffect(async () => {
        const userResponse = await fetch(`http://localhost:${port}/users/current`, {
            method: 'GET',
            credentials: 'include'
        })

        const user = await userResponse.json()
        setUser(user);
    }, [])

    return (
        <Container>
            <Header url='/events' isAdmin={user !== undefined && 'payload' in user && user.payload.role === 'admin'} />

            <Button
                icon='pi pi-arrow-left'
                label='Вернуться'
                className='p-button-text p-button-secondary p-mt-5'
                onClick={() => router.push('/')}
            />
            <img
                alt={event.name}
                src={`http://localhost:${port}/${event.image_path}`}
                onError={(e) => e.target.src = '/img/imgError.png'}
                className={styles.image}
            />
            <h1>{event.name}</h1>
            <span className={styles.description}>{event.description}</span>
            <h2 className='p-mt-5 p-mb-3'>Информация</h2>
            <ul>
                <li>
                    <span><b>Дата начала: </b>{moment(event.date_start).format('LL')}</span>
                </li>
                <li>
                    <span><b>Дата окончания: </b>{moment(event.date_end).format('LL')}</span>
                </li>
                <li>
                    <span><b>Тематики: </b>{event.subjects.map(el => el.name).join(', ')}</span>
                </li>
                <li>
                    <span><b>С кем пойти: </b>{event.companions.map(el => el.name).join(', ')}</span>
                </li>
                <li>
                    <span><b>Местоположение: </b>{event.location}</span>
                </li>
            </ul>
        </Container>
    )
}

export async function getServerSideProps({ query }) {

    const eventId = query.id;
    const eventResponse = await fetch(`http://localhost:${port}/events/${eventId}`);
    const { payload: event } = await eventResponse.json();

    return {
        props: {
            event
        }
    }
}

export default Event;
import Container from '../components/Container'
import Header from '../components/header';
import styles from '../styles/Home.module.scss';
import EventCard from '../components/EventCard';
import port from '../helpers/port';
import { useEffect, useState } from 'react';

export default function Home({ events, user }) {

  return (
    <Container>
      <Header url='/' isAdmin={user !== undefined && 'payload' in user && user.payload.role === 'admin'} />

      <ul className='m-mt-5 eventsList'>
        {events.map((el, i) =>
          <li className={styles.eventsItem} key={i}>
            <EventCard event={el} />
          </li>
        )}

      </ul>

    </Container>
  )
}

export async function getServerSideProps({ req: { headers: { cookie } } }) {

  const eventsResponse = await fetch(`http://localhost:${port}/events`, {
    credentials: 'include'
  });

  const { payload: events } = await eventsResponse.json();

  const userResponse = await fetch(`http://localhost:${port}/users/current`, {
    method: 'GET',
    credentials: 'include',
    headers: {
      cookie
    }
  });

  const user = await userResponse.json();

  return {
    props: {
      events, 
      user
    }
  }
}
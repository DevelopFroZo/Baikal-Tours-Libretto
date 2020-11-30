import Container from '../components/Container'
import Header from '../components/header';
import styles from '../styles/Home.module.scss';
import EventCard from '../components/EventCard';
import port from '../helpers/port';

export default function Home({events}) {

  return (
    <Container>
      <Header url='/'/>

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

export async function getServerSideProps(context){

  const eventsResponse = await fetch(`http://localhost:${port}/events`);
  const {payload: events} = await eventsResponse.json();

  return {
    props: {
      events
    }
  }
}
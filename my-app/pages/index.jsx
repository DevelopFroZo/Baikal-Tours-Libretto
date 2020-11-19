import Container from '../components/Container'
import Header from '../components/header';
import styles from '../styles/Home.module.scss';
import { Card } from 'primereact/card';
import { useRouter } from 'next/router';
import { Button } from 'primereact/button';

export default function Home({events}) {

  console.log(events)

  const router = useRouter();

  return (
    <Container>
      <Header url='/events'/>

      <ul className={`m-mt-5 ${styles.eventsList}`}>
        {events.map((el, i) => 
          <li className={styles.eventsItem} key={i}>
            <Card 
              title={el.name}
              footer={(
                <span>
                  <Button 
                    label='Смотреть'
                    onClick={() => router.push(`/event?id=${el.id}`)}
                  />
                </span>
              )}
            >
              <p>
                {el.description}
              </p>
            </Card>
          </li>
        )}
        
      </ul>

    </Container>
  )
}

export async function getServerSideProps(context){

  const eventsResponse = await fetch('http://localhost:9064/events');
  const {payload: events} = await eventsResponse.json();

  return {
    props: {
      events
    }
  }
}
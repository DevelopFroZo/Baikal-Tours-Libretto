import Container from '../components/Container'
import Header from '../components/header';
import styles from '../styles/Home.module.scss';
import { Card } from 'primereact/card';
import { useRouter } from 'next/router';
import { Button } from 'primereact/button';

export default function Home() {

  const router = useRouter();

  return (
    <Container>
      <Header url='events'/>

      <ul className={`m-mt-5 ${styles.eventsList}`}>
        <li className={styles.eventsItem}>
          <Card 
            title='Крутое событие'
            footer={(
              <span>
                <Button 
                  label='Смотреть' 
                />
              </span>
            )}
          >
            <p>
              Крайне крутое событие для крайне крутых чуваков
            </p>
          </Card>
        </li>
      </ul>

    </Container>
  )
}

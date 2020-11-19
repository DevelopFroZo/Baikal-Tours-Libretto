import Container from '../components/Container'
import styles from '../styles/Home.module.css'
import { Button } from 'primereact/button';

export default function Home() {
  return (
    <Container>
      hello world
      <Button icon='pi pi-plus' label='Click me' className='p-mt-3 p-d-block'/>
    </Container>
  )
}

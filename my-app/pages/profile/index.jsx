import React, { useState } from 'react';
import Container from '../../components/Container';
import port from '../../helpers/port';
import Header from '../../components/header';
import EventCard from '../../components/EventCard';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { PickList } from 'primereact/picklist';

const Profile = ({ chainedEventsResponse, events }) => {

    const [ chainedEvents, setChainedEvents ] = useState(chainedEventsResponse);
    const [ dialogVisible, setDialogVisible ] = useState(false);
    const [ source, setSource ] =               useState([...events]);
    const [ target, setTarget ] =               useState([]);

    const changeTarget = (event) => {
        setSource(event.source);
        setTarget(event.target);
    }

    const clearPickList = () => {
        setSource([...events]);
        setTarget([]);
    }

    const saveChainedEvents = async () => {

        const newChainedEventsIds = target.map(el => el.id);
        const newChainedEventsResponse = await fetch(`http://localhost:${port}/chained-events`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                events: newChainedEventsIds
            })
        })
        const newChainedEventsId = await newChainedEventsResponse.json();
        
        setChainedEvents([...chainedEvents, {
            id: newChainedEventsId,
            events: target
        }])

        clearPickList();
        setDialogVisible();
    }

    return (
        <Container>
            <Header />
            
            <h1>Личный кабинет</h1>

            <div className='p-d-flex p-jc-between p-ai-center'>            
                <h2>Цепочки событий</h2>
                <Button 
                    label='Добавить цепочку' 
                    icon='pi pi-pencil' 
                    onClick={() => setDialogVisible(true)}
                />
            </div>

            { chainedEvents.length ?
                chainedEvents.map(({ events }, i) =>
                    <div key={i}>
                        <h3>Цепочка {i + 1}</h3>
                        <ul className='eventsList'>
                            {events.map(el => (
                                <li key={el.id}>
                                    <EventCard event={el}/>
                                </li>
                            ))}
                        </ul>
                    </div>
                )
            :
                <h3>Цепочки событий отсутствуют</h3>
            }

            <Dialog 
                header='Добавление цепочки' 
                visible={dialogVisible}
                onHide={() => setDialogVisible(false)}
                footer={(
                    <div className='p-d-flex p-jc-end container'>
                        <Button 
                            label='Отмена' 
                            className='p-button-secondary' 
                            onClick={() => {clearPickList(); setDialogVisible(false)}}
                        />
                        <Button 
                            label='Добавить' 
                            className='p-button-success p-ml-3'
                            onClick={saveChainedEvents}
                            disabled={!(target.length)}
                        /> 
                    </div>
                )}
            >
                <PickList 
                    source={source}
                    target={target}
                    itemTemplate={(item) => (<EventCard event={item} showImage={false}/>)}
                    sourceHeader='Все события'
                    targetHeader='Выбранные события'
                    onChange={changeTarget}
                    targetStyle={{height: 600}}
                    sourceStyle={{height: 600}}
                />
            </Dialog>

        </Container>
    )
}

export async function getServerSideProps() {

    const chainedEventsResponse =       await fetch(`http://localhost:${port}/chained-events`);
    const { payload: chainedEvents } =  await chainedEventsResponse.json();

    const eventsResponse =              await fetch(`http://localhost:${port}/events`);
    const { payload: events } =         await eventsResponse.json();

    return { props: { chainedEventsResponse: chainedEvents, events } }

}

export default Profile;
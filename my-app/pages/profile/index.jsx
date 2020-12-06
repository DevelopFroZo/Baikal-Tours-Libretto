import React, { useState } from 'react';
import Container from '../../components/Container';
import port from '../../helpers/port';
import Header from '../../components/header';
import EventCard from '../../components/EventCard';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { PickList } from 'primereact/picklist';

const Profile = ({ chainedEventsResponse, events, user }) => {

    const [ chainedEvents, setChainedEvents ] =             useState(chainedEventsResponse);
    const [ dialogVisible, setDialogVisible ] =             useState(false);
    const [ source, setSource ] =                           useState([...events]);
    const [ target, setTarget ] =                           useState([]);
    const [ activeChainedEvents, setActiveChainedEvents ] = useState(null);
    const [ deleteDialogVisible, setDeleteDialogVisible ] = useState(false);
    const [ activeDeleteId, setActiveDeleteId ] =           useState(null);

    const changeTarget = (event) => {
        setSource(event.source);
        setTarget(event.target);
        console.log(activeChainedEvents)
    }

    const clearPickList = () => {
        setSource([...events]);
        setTarget([]);
    }

    const hideDeleteDialog = () => {
        setDeleteDialogVisible(false); 
        setActiveDeleteId(null);
    }

    const startEditChainedEvents = (chainedData) => {
        setActiveChainedEvents(chainedData.id);
        setTarget(chainedData.events);
        setSource(events.filter(allEventsElement => 
                                !(chainedData.events.some(chainedEventsElement => 
                                allEventsElement.id === chainedEventsElement.id))));
        setDialogVisible(true)
        console.log(activeChainedEvents)
    }

    const saveChainedEvents = async () => {

        const newChainedEventsIds = target.map(el => el.id);
        const newChainedEventsResponse = await fetch(`http://localhost:${port}/chained-events`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                cookie: document.cookie
            },
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
        setDialogVisible(false);
    }

    const saveActiveChainedEvents = async () => {

        const activeChainedEventsIds = target.map(el => el.id);
        const newActiveChainedEventsResponse = await fetch(`http://localhost:${port}/chained-events/${activeChainedEvents}`, {
            method: 'PUT',
            credentials: 'include',
            headers: {
                cookie: document.cookie
            },
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                events: activeChainedEventsIds
            })
        })

        setChainedEvents(chainedEvents.map(el => el.id === activeChainedEvents ? {id: activeChainedEvents, events: target} : el))
        clearPickList();
        setDialogVisible(false);
        setActiveChainedEvents(null);
    }

    const deleteChainedEvents = async () => {
        const deleteChainedEventsResponse = await fetch(`http://localhost:${port}/chained-events/${activeDeleteId}`, {
            method: 'DELETE',
            credentials: 'include',
            headers: {
                cookie: document.cookie
            },
            headers: {
                'Content-Type': 'application/json'
            }
        })

        setChainedEvents(chainedEvents.filter(el => el.id !== activeDeleteId));
        setActiveDeleteId(null);
        setDeleteDialogVisible(false);
    }

    return (
        <Container>
            <Header 
                user={user}
            />
            
            <h1>Личный кабинет: {user.payload.login}</h1>

            <div className='p-d-flex p-jc-between p-ai-center'>            
                <h2>Цепочки событий</h2>
                <Button 
                    label='Добавить цепочку' 
                    icon='pi pi-plus' 
                    onClick={() => setDialogVisible(true)}
                />
            </div>

            { chainedEvents.length ?
                chainedEvents.map(( chainedData, i) =>
                    <div key={i}>
                        <div className='p-d-flex p-jc-between p-ai-center'>
                            <h3>Цепочка {i + 1}</h3>
                            <div>
                                <Button
                                    label='Редактировать'
                                    icon='pi pi-pencil'
                                    onClick={() => startEditChainedEvents(chainedData)}
                                />
                                <Button
                                    label='Удалить'
                                    icon='pi pi-trash'
                                    className='p-button-danger p-ml-3'
                                    onClick={() => { setDeleteDialogVisible(true); setActiveDeleteId(chainedData.id)}}
                                />
                            </div>
                        </div>
                        <ul className='eventsList'>
                            {chainedData.events.map(el => (
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
                header={activeChainedEvents !== null ? 'Добавление цепочки' : 'Редактирование цепочки'} 
                visible={dialogVisible}
                onHide={() => { setDialogVisible(false); setActiveChainedEvents(null) }}
                footer={(
                    <div className='p-d-flex p-jc-end container'>
                        <Button 
                            label='Отмена' 
                            className='p-button-secondary' 
                            onClick={() => {clearPickList(); setDialogVisible(false)}}
                        />
                        <Button 
                            label={activeChainedEvents === null ? 'Добавить' : 'Сохранить'} 
                            className='p-button-success p-ml-3'
                            onClick={activeChainedEvents ? saveActiveChainedEvents : saveChainedEvents }
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
            
            <Dialog
                header='Удаление'
                visible={deleteDialogVisible}
                onHide={hideDeleteDialog}
                footer={(
                    <div className='p-d-flex p-jc-end'>
                        <Button 
                            label='Да' 
                            className='p-button-danger'
                            onClick={deleteChainedEvents}
                        />
                        <Button 
                            label='Нет'
                            className='p-ml-3'
                            onClick={hideDeleteDialog}
                        /> 
                    </div>
                )}
                style={{width: 400}}
            >
                <h3>Вы действительно хотите удалить цепочку?</h3>
            </Dialog>

        </Container>
    )
}

export async function getServerSideProps({ req: { headers: { cookie } } }) {

    const userResponse = await fetch(`http://localhost:${port}/users/current`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          cookie
        }
    });
    const user = await userResponse.json();

    const chainedEventsResponse =       await fetch(`http://localhost:${port}/chained-events`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          cookie
        }
    });
    const { payload: chainedEvents } = await chainedEventsResponse.json();

    const eventsResponse =              await fetch(`http://localhost:${port}/events`);
    const { payload: events } =         await eventsResponse.json();

    return { props: { chainedEventsResponse: chainedEvents, events, user } }

}

export default Profile;
import React from 'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { useRouter } from 'next/router';

const EventCard = ({ event, showImage = true }) => {

    const router = useRouter();

    return (
        <Card
            title={event.name}
            header={(
                showImage && 
                <img 
                    alt={event.name} 
                    src={event.image_path} 
                    onError={(e) => e.target.src='/img/imgError.png'}
                    style={{width: '100%'}}
                />
            )}
            footer={(
                <span>
                    <Button
                        label='Смотреть'
                        onClick={() => router.push(`/event?id=${event.id}`)}
                    />
                </span>
            )}
        >
            <p>
                {event.description}
            </p>
        </Card>
    )
}

export default EventCard;
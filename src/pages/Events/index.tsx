import React, { useState, useEffect, useCallback } from 'react';
import DateTimePicker from 'react-datetime-picker';

import { useAuth } from '../../hook/auth';

import { Container } from './styles';

const Events: React.FC = () => {
  const { firebase } = useAuth();

  const [events, setEvents] = useState<any[]>([]);
  const [eventName, setEventName] = useState('');
  const [eventCapacity, setEventCapacity] = useState(0);
  const [eventDate, setEventDate] = useState(new Date());

  const handleCreate = useCallback(() => {
    firebase.database
      .collection('events')
      .add({ name: eventName, date: eventDate })
      .then(() => console.log(`added ${eventName} successfully`));
  }, [firebase, eventName]);

  const handleDelete = useCallback(
    id => {
      firebase.database
        .collection('events')
        .doc(id)
        .delete()
        .then(() => console.log(`deleted ${id} successfully`));
    },
    [firebase],
  );

  useEffect(() => {
    firebase.database
      .collection('events')
      .where('date', '>=', new Date())
      .get()
      .then(response => {
        if (!response.empty) {
          const list: any = [];
          response.forEach(re => {
            const fields = re.data();
            list.push({ id: re.id, ...fields });
          });
          setEvents(list);
          console.log(list);
        }
      });
  }, [firebase]);

  return (
    <Container>
      <div className="events-holder">
        {events.map(event => (
          <div key={event.id} className="event">
            <strong>{event.name}</strong>
            <p>{String(new Date(event.date.seconds * 1000))}</p>
            <button type="button" onClick={() => handleDelete(event.id)}>
              Del
            </button>
          </div>
        ))}
      </div>
      <div className="new-event">
        <input
          type="text"
          value={eventName}
          onChange={e => setEventName(e.target.value)}
        />
        <DateTimePicker
          onChange={(date: Date) => setEventDate(date)}
          value={eventDate}
        />
        <button type="button" onClick={handleCreate}>
          Create
        </button>
        {String(eventDate)}
      </div>
    </Container>
  );
};

export default Events;

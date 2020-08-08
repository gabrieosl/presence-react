/* eslint-disable import/no-duplicates */
/* eslint-disable no-restricted-globals */
import React, { useState, useEffect, useCallback } from 'react';
import { format } from 'date-fns';
import pt from 'date-fns/locale/pt';

import {
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  Grid,
  TextField,
} from '@material-ui/core';
import { useAuth } from '../../hook/auth';

import styles from './styles';

const Events: React.FC = () => {
  const { firebase } = useAuth();

  const [events, setEvents] = useState<any[]>([]);
  const [eventName, setEventName] = useState('');
  const [maxAttendees, setMaxAttendees] = useState<number | null>(null);
  const [eventDate, setEventDate] = useState(new Date());
  const classes = styles();

  const handleCreate = useCallback(() => {
    firebase.database
      .collection('events')
      .add({
        name: eventName,
        date: eventDate,
        maxAttendees,
        confirmedCount: 0,
      })
      .then(() => location.reload());
  }, [firebase, eventName, eventDate, maxAttendees]);

  const handleDelete = useCallback(
    id => {
      firebase.database
        .collection('events')
        .doc(id)
        .delete()
        .then(() => location.reload());
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
    <Grid
      container
      className={classes.container}
      justify="space-around"
      alignItems="stretch"
    >
      <Grid container item alignItems="center" justify="center">
        <TableContainer className={classes.table}>
          <TableHead>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell width="50%">Título</TableCell>
              <TableCell>Max. Participantes</TableCell>
              <TableCell>Confirmados</TableCell>
              <TableCell>Data/Hora</TableCell>
              <TableCell>Deletar</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {events.map((event, index) => (
              <TableRow key={event.id}>
                <TableCell>{index}</TableCell>
                <TableCell>{event.name}</TableCell>
                <TableCell>{event.maxAttendees}</TableCell>
                <TableCell>{event.confirmedCount}</TableCell>
                <TableCell>
                  {format(
                    new Date(event.date.seconds * 1000),
                    "dd'/'MM'/'yyyy' - 'HH':'mm",
                    { locale: pt },
                  )}
                </TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => handleDelete(event.id)}
                  >
                    DEL
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </TableContainer>
      </Grid>
      <Grid
        container
        item
        direction="column"
        alignItems="center"
        justify="center"
      >
        <Grid item>
          <TextField
            required
            id="standard-required"
            label="Título"
            defaultValue="Hello World"
            variant="outlined"
            value={eventName}
            onChange={e => setEventName(e.target.value)}
            className={classes.input}
          />
          <TextField
            required
            id="standard-required"
            label="Máx. participantes"
            type="number"
            defaultValue=""
            variant="outlined"
            value={maxAttendees}
            onChange={e => setMaxAttendees(Number(e.target.value))}
            className={classes.input}
          />
          <TextField
            id="datetime-local"
            label="Data/Hora"
            type="datetime-local"
            InputLabelProps={{
              shrink: true,
            }}
            value={eventDate.toISOString()}
            onChange={e => setEventDate(new Date(e.target.value))}
            className={classes.input}
          />
        </Grid>
        <Grid item>
          <Button variant="contained" color="primary" onClick={handleCreate}>
            Criar
          </Button>
        </Grid>
        {`Criar evento "${eventName}" para até ${maxAttendees} pessoas as ${format(
          eventDate,
          "dd'/'MM'/'yyyy' - 'HH':'mm",
          { locale: pt },
        )}`}
      </Grid>
    </Grid>
  );
};

export default Events;

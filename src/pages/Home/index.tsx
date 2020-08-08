/* eslint-disable import/no-duplicates */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import pt from 'date-fns/locale/pt';
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Button,
  FormControl,
  Select,
  InputLabel,
  MenuItem,
  TextField,
  Grid,
  Paper,
} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';

import { useAuth } from '../../hook/auth';

import SignIn from '../../components/Signin';
import Confirm from '../../components/Confirm';

import styles from './styles';

interface EventData {
  id: string;
  date: any;
  name: string;
}

const Home: React.FC = () => {
  const { firebase, user, setNewName } = useAuth();
  const [events, setEvents] = useState<EventData[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [requestId, setRequestId] = useState<string | null>(null);
  const classes = styles();

  const handleConfirmPresence = useCallback(async () => {
    if (user.displayName !== name) setNewName(name);
    const response = await firebase.database
      .collection(`events/${selectedEvent}/requested`)
      .add({ userId: user.uid, userName: name, created_at: new Date() });
    setRequestId(response.id);
  }, [user, name, setNewName, firebase, selectedEvent]);

  const handleReset = useCallback(() => {
    setSelectedEvent(null);
    setName('');
    setRequestId(null);
  }, []);

  useEffect(() => {
    setName(user.displayName || '');
  }, [user]);

  useEffect(() => {
    firebase.database
      .collection('events')
      .where('date', '>=', new Date())
      .get()
      .then(response => {
        if (!response.empty) {
          const list: any = [];
          response.forEach(re => list.push({ id: re.id, ...re.data() }));
          console.log(list);
          setEvents(list);
        }
      });
  }, [firebase]);

  return (
    <>
      <AppBar position="static">
        <Toolbar className={classes.toolbar}>
          <IconButton edge="start" color="inherit" aria-label="menu">
            <MenuIcon />
          </IconButton>
          <Link to="/events">
            <Typography variant="h6">Eventos</Typography>
          </Link>
        </Toolbar>
      </AppBar>
      <Grid
        container
        className={classes.gridContainer}
        direction="row"
        justify="space-between"
        alignItems="stretch"
      >
        <Grid
          container
          item
          xs={12}
          sm={12}
          md={5}
          lg={4}
          xl={3}
          direction="column"
          justify="center"
          alignItems="stretch"
        >
          <Paper className={classes.paper}>
            <Grid container direction="column" alignItems="stretch">
              {!requestId ? (
                <>
                  <FormControl variant="filled">
                    <InputLabel id="event-selector-label">
                      Selecione um evento
                    </InputLabel>
                    <Select
                      labelId="event-selector-label"
                      id="event-selector"
                      value={selectedEvent}
                      onChange={(e: any) => setSelectedEvent(e.target.value)}
                    >
                      {events.map(event => (
                        <MenuItem value={event.id}>
                          {`${event.name} - ${format(
                            new Date(event.date.seconds * 1000),
                            "dd'/'MM'/'yyyy' - 'HH':'mm",
                            { locale: pt },
                          )}`}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  {!user.uid && selectedEvent && <SignIn />}

                  {user.uid && selectedEvent && (
                    <>
                      <TextField
                        id="name-input"
                        label="Nome"
                        value={name}
                        onChange={e => setName(e.target.value)}
                      />
                      <Button
                        variant="contained"
                        color="primary"
                        disabled={!(user.uid && selectedEvent)}
                        onClick={handleConfirmPresence}
                      >
                        Confirmar presença
                      </Button>
                    </>
                  )}
                </>
              ) : (
                <Confirm
                  requestId={requestId}
                  eventId={String(selectedEvent)}
                />
              )}
            </Grid>
          </Paper>
          <Button
            variant="text"
            color="default"
            onClick={handleReset}
            className={classes.restart}
          >
            Reiniciar
          </Button>
        </Grid>
        <Grid
          container
          item
          xs={12}
          sm={12}
          md={7}
          lg={8}
          xl={9}
          className={classes.sider}
          direction="column"
          justify="center"
          alignItems="stretch"
        >
          <Grid
            item
            container
            className={classes.siderFront}
            direction="column"
            justify="center"
            alignItems="center"
          >
            <Typography variant="h4">1- Selecione um evento.</Typography>
            <Typography variant="h4">2- Se identifique.</Typography>
            <Typography variant="h4">3- Confirme presença.</Typography>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

export default Home;

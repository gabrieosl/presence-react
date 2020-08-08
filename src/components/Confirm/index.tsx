import React, { useState, useEffect, useMemo } from 'react';
import 'react-phone-number-input/style.css';
import { Typography, Grid } from '@material-ui/core';

import { useAuth } from '../../hook/auth';

interface Props {
  eventId: string;
  requestId: string;
}

const Result: React.FC<Props> = ({ eventId, requestId }) => {
  const { firebase } = useAuth();
  const [response, setResponse] = useState<string | null | undefined>(null);

  const responseText = useMemo(() => {
    if (response === 'WAIT')
      return 'Presença NÃO confirmada. Tente novamente no dia do evento.';
    if (response === 'FULL') return 'Presença NÃO confirmada. Evento cheio.';
    if (response === 'reconfirmed')
      return 'Presença já CONFIRMADA anteriormente.';
    if (response === 'confirmed') return 'Presença CONFIRMADA.';
    return 'Aguarde...';
  }, [response]);

  useEffect(() => {
    const doc = firebase.database
      .collection(`events/${eventId}/requested`)
      .doc(requestId);

    doc.onSnapshot(
      docSnapshot => {
        setResponse(docSnapshot.get('response'));
        console.log(`Received doc snapshot: ${docSnapshot}`);
      },
      err => {
        console.log(`Encountered error: ${err}`);
      },
    );

    return () => {
      const unsub = firebase.database
        .collection(`events/${eventId}/requested`)
        .doc(requestId)
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        .onSnapshot(() => {});

      unsub();
    };
  }, [eventId, firebase, requestId]);

  // const classes = styles();

  return (
    <Grid container item direction="column" alignItems="stretch">
      <Typography variant="h5">{responseText}</Typography>
    </Grid>
  );
};

export default Result;

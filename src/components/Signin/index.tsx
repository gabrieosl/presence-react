import React, { useState, useMemo } from 'react';
import PhoneInput, { isValidPhoneNumber } from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import { Typography, Button, Grid, TextField } from '@material-ui/core';

import MuiPhoneInput from '../PhoneInput';

import { useAuth } from '../../hook/auth';

import styles from './styles';

const Signin: React.FC = () => {
  const { verificationId, sendCodeToSignIn, verifyCode } = useAuth();

  const classes = styles();

  const [phoneNumber, setPhoneNumber] = useState('');
  const [validationCode, setValidationCode] = useState('');

  const isValid = useMemo(
    () => (isValidPhoneNumber(phoneNumber) ? undefined : 'Formato inválido'),
    [phoneNumber],
  );

  return (
    <Grid
      container
      direction="column"
      alignItems="stretch"
      className={classes.container}
    >
      <Grid container direction="column" alignItems="stretch">
        {!verificationId ? (
          <>
            <Typography variant="subtitle2">Identifique-se</Typography>
            <PhoneInput
              value={phoneNumber}
              onChange={setPhoneNumber}
              defaultCountry="BR"
              showCountrySelect
              inputComponent={MuiPhoneInput}
              error={isValid}
            />
            <Button
              variant="contained"
              color="primary"
              disabled={!!isValid}
              className={classes.button}
              onClick={() => sendCodeToSignIn(phoneNumber)}
            >
              Continuar
            </Button>
            <div id="recaptcha-container" />
          </>
        ) : (
          <>
            <Typography variant="subtitle2">
              Entre o código enviado para {phoneNumber}
            </Typography>
            <TextField
              label="Codigo de validação"
              value={validationCode}
              onChange={e => setValidationCode(e.target.value)}
              variant="filled"
            />
            <Button
              variant="contained"
              color="primary"
              disabled={validationCode.length < 4}
              className={classes.button}
              onClick={() => verifyCode(validationCode)}
            >
              Continuar
            </Button>
          </>
        )}
      </Grid>
    </Grid>
  );
};

export default Signin;

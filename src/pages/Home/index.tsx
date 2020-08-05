import React, { useState, useEffect, useMemo } from 'react';
import PhoneInput, { isValidPhoneNumber } from 'react-phone-number-input';
import 'react-phone-number-input/style.css';

import { useAuth } from '../../hook/auth';

import { Container } from './styles';

const Home: React.FC = () => {
  const {
    firebase,
    user,
    verificationId,
    sendCodeToSignIn,
    verifyCode,
  } = useAuth();
  const [events, setEvents] = useState<any[]>([]);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [validationCode, setValidationCode] = useState('');

  const isValid = useMemo(() => isValidPhoneNumber(phoneNumber), [phoneNumber]);

  const lala = useMemo(() => console.log(events), [events]);

  useEffect(() => {
    firebase.database
      .collection('events')
      .get()
      .then(response => {
        if (!response.empty) {
          const list: any = [];
          response.forEach(re => list.push({ id: re.id, ...re.data() }));
          console.log(list);
          setEvents(list);
        }
      });
  }, []);

  return (
    <Container>
      {/* {JSON.stringify(user)} */}
      {/* {`verif id: ${verificationId}`} */}
      <PhoneInput
        // placeholder="Enter phone number"
        value={phoneNumber}
        onChange={setPhoneNumber}
        defaultCountry="BR"
        showCountrySelect
      />

      {isValid ? <h1>valid</h1> : <h6>not valid</h6>}

      <button type="button" onClick={() => sendCodeToSignIn(phoneNumber)}>
        Signin
      </button>
      <input
        type="text"
        value={validationCode}
        placeholder="Codigo de validação"
        onChange={e => setValidationCode(e.target.value)}
      />
      <div id="recaptcha-container" />
      <button type="button" onClick={() => verifyCode(validationCode)}>
        validate
      </button>
      <h2>leeeen {events.length}</h2>
    </Container>
  );
};

export default Home;

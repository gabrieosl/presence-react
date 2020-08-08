/* eslint-disable lines-between-class-members */
/* eslint-disable import/no-duplicates */
import app from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

const config = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_DATABASE_URL,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_APP_API,
};

class Firebase {
  public auth: app.auth.Auth;
  public database: app.firestore.Firestore;

  constructor() {
    app.initializeApp(config);
    this.auth = app.auth();
    this.database = app.firestore();
    // this.auth.settings.appVerificationDisabledForTesting = true;
  }

  // Auth API
  public signInWithEmailAndPassword(email: string, password: string) {
    this.auth.signInWithEmailAndPassword(email, password);
  }

  public async getVerificationIdForPhoneNumber(phoneNumber: string) {
    const applicationVerifier = new app.auth.RecaptchaVerifier(
      'recaptcha-container',
    );

    const confirmationResult = await this.auth.signInWithPhoneNumber(
      phoneNumber,
      applicationVerifier,
    );

    return confirmationResult.verificationId;
  }

  public async verifyCode(verificationId: string, code: string) {
    const credential = app.auth.PhoneAuthProvider.credential(
      verificationId,
      code,
    );
    return this.auth.signInWithCredential(credential);
  }

  public signOut() {
    this.auth.signOut();
  }
}

export default new Firebase();

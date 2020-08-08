import React, { useState, createContext, useCallback, useContext } from 'react';

import firebaseApp from '../Firebase';

interface AuthState {
  uid?: string | undefined | null;
  displayName?: string | undefined | null;
}

interface ContextData {
  firebase: typeof firebaseApp;
  user: AuthState;
  verificationId: string | null;
  sendCodeToSignIn(phoneNumber: string): Promise<void>;
  verifyCode(code: string): void;
  setNewName(newName: string): Promise<void>;
}

const AuthContext = createContext<ContextData>({} as ContextData);

export const AuthProvider: React.FC = ({ children }) => {
  const [firebase] = useState(firebaseApp);
  const [user, setUser] = useState<AuthState>({});
  const [verificationId, setVerificationId] = useState<string | null>(null);

  const sendCodeToSignIn = useCallback(
    async (phoneNumber: string) => {
      const generatedVerificationId = await firebase.getVerificationIdForPhoneNumber(
        phoneNumber,
      );
      if (generatedVerificationId) setVerificationId(generatedVerificationId);
    },
    [firebase],
  );

  const verifyCode = useCallback(
    async (code: string) => {
      if (!verificationId) return;
      const { user: firebaseUser } = await firebase.verifyCode(
        verificationId,
        code,
      );
      setUser({
        uid: firebaseUser?.uid,
        displayName: firebaseUser?.displayName,
      });
    },
    [firebase, verificationId],
  );

  const setNewName = useCallback(
    async (newName: string) => {
      await firebase.auth.currentUser?.updateProfile({ displayName: newName });
      setUser(prev => ({ ...prev, displayName: newName }));
    },
    [firebase],
  );

  return (
    <AuthContext.Provider
      value={{
        firebase,
        user,
        verificationId,
        sendCodeToSignIn,
        verifyCode,
        setNewName,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): ContextData {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useWorkflow must be used within AuthProvider');
  }

  return context;
}

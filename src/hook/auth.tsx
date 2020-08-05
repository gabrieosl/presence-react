import React, { useState, createContext, useCallback, useContext } from 'react';
import app from 'firebase/app';

import firebaseApp from '../Firebase';

interface AuthState {
  credential?: string;
  user?: any;
}

interface ContextData {
  firebase: typeof firebaseApp;
  user: AuthState;
  verificationId: string | null;
  sendCodeToSignIn(phoneNumber: string): Promise<void>;
  verifyCode(code: string): void;
}

const AuthContext = createContext<ContextData>({} as ContextData);

export const AuthProvider: React.FC = ({ children }) => {
  const [firebase] = useState(firebaseApp);
  const [user, setUser] = useState<AuthState>({});
  const [verificationId, setVerificationId] = useState<string | null>(null);

  const sendCodeToSignIn = useCallback(async (phoneNumber: string) => {
    const generatedVerificationId = await firebase.getVerificationIdForPhoneNumber(
      phoneNumber,
    );
    if (generatedVerificationId) setVerificationId(generatedVerificationId);
  }, []);

  const verifyCode = useCallback(
    async (code: string) => {
      if (!verificationId) return;
      const { credential, user } = await firebase.verifyCode(
        verificationId,
        code,
      );
      setUser({ credential: credential?.providerId, user });
    },
    [verificationId],
  );

  const signOut = useCallback(() => {
    setUser({});
  }, []);

  return (
    <AuthContext.Provider
      value={{ firebase, user, verificationId, sendCodeToSignIn, verifyCode }}
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

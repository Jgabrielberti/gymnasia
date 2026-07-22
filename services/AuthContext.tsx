import { createContext } from 'react';
import { RegisterUserData } from "@/repositories/UserRepository";

export const AuthContext = createContext({
  isAuthenticated: false,
  loading: false,
  performBiometricLogin: async () => {},
  registerUser: async (data: RegisterUserData) => {}
});
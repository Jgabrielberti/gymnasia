import React, { useState } from 'react';
import * as LocalAuthentication from "expo-local-authentication";
import { AuthContext } from "./AuthContext";
import { UserRepository, RegisterUserData } from "@/src/repositories/UserRepository";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);

  async function performBiometricLogin() {
    setLoading(true);

    try {
      const resultado = await LocalAuthentication.authenticateAsync({
        promptMessage: "Autentique-se para entrar",
        fallbackLabel: "Usar senha do celular",
      });

      if (resultado.success) {
        setAuthenticated(true);
      } else {
        alert("Falha na autenticação. Tente novamente.");
      }
    } catch (error) {
      alert("Erro ao buscar biometria.");
    } finally {
      setLoading(false);
    }
  }

  async function registerUser(data: RegisterUserData) {
    setLoading(true);
    try {
      await UserRepository.create(data);
      setAuthenticated(true);
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, loading, performBiometricLogin, registerUser }}>
      {children}
    </AuthContext.Provider>
  );
}
import { createContext, ReactNode, useEffect, useState } from "react";
import { api } from '../services/api';

type User = {
  id: string;
  name: string;
  login: string;
  avatar_url: string;

};

type AuthContextData = {
  user: User | null;
  signInUrl: string;
  signOut: () => void;
};

export const authContext = createContext({} as AuthContextData);

type AuthProvider = {
  children: ReactNode;
}

type AuthResponse = {
  token: string;
  user: {
    id: string;
    avatar_url: string;
    name: string;
    login: string;
  }
}


export function AuthProvider(props: AuthProvider) {
  const [user, setUser] = useState<User | null>(null);

  const signInUrl = `https://github.com/login/auth/authorize?scope=user&client_id=4edd8d951ce62737ca98`;

  async function signIn(gitHubCode: string) {
    const response = await api.post<AuthResponse>('authenticate', {
      code: gitHubCode,
    });

    const { token, user } = response.data;

    api.defaults.headers.common.authorization = `Bearer ${token}`;

    localStorage.setItem('@doWhile:token', token);

    setUser(user);
  };

  function signOut() {
    setUser(null);

    localStorage.removeItem('@doWhile:token');
  }

  useEffect(() => {
    const token = localStorage.getItem('@doWhile:token');

    if (token) {
      api.defaults.headers.common.authorization = `Bearer ${token}`;

      api.get<User>('profile').then((response) => {
        setUser(response.data);
      })
    }
  }, []);

  useEffect(() => {
    const url = window.location.href;

    const hasGitHubCode = url.includes('?code=');

    if (hasGitHubCode) {
      const [urlWithOutCode, gitHubCode] = url.split('?code=');

      window.history.pushState({}, '', urlWithOutCode);

      signIn(gitHubCode)
    }
  }, []);


  return (
    <authContext.Provider value={{ signInUrl, user, signOut }}>
      {props.children}
    </authContext.Provider>
  );
}
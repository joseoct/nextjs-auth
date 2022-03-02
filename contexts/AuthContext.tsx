import { useRouter } from 'next/router';
import { createContext, ReactNode, useEffect, useState } from 'react'; import { api } from '../services/api';
import { setCookie, parseCookies } from 'nookies';

type User = {
  email: string;
  permissions: string[];
  roles: string[];
}

type SignInCredentials = {
  email: string;
  password: string;
};

type AuthContextData = {
  signIn(credentials: SignInCredentials): Promise<void>;
  user: User;
  isAuthenticated: boolean;
};

type AuthProviderProps = {
  children: ReactNode;
};

export const AuthContext = createContext({} as AuthContextData);

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User>(null);
  const isAuthenticated = !!user;

  useEffect(() => {
    const { 'nextauth.token': token  } = parseCookies();

    if (token) {
      api.get('/me').then(response => {
        const { email, permissions, roles } = response.data;

        setUser({ email, permissions, roles });
      });
    }
  }, [])

  const router = useRouter();

  async function signIn({ email, password }: SignInCredentials) {
    try {
      const response = await api.post('sessions', {
        email,
        password,
      });

      const { token, refreshToken, permissions, roles } = response.data;

      setCookie(undefined, 'nextauth.token', token, {
        maxAge: 60 * 60 * 24 * 7, // 30 days
        path: '/',
      })

      setCookie(undefined, 'nextauth.refreshToken', token, {
        maxAge: 60 * 60 * 24 * 7, // 30 days
        path: '/',
      })

      setUser({
        email,
        permissions,
        roles,
      })

      api.defaults.headers['Authroization'] = `Bearer ${token}`;

      router.push('/dashboard');
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <AuthContext.Provider value={{ signIn, isAuthenticated, user }}>
      {children}
    </AuthContext.Provider>
  );
}
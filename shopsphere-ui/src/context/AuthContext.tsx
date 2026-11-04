
import {
    createContext,
    useContext,
    useState
} from 'react';

import type { ReactNode } from 'react';

import type {
    AuthResponse,
    LoginFormData
} from '../types/Auth';

import { loginUser } from '../services/authService';

type AuthUser = Omit<AuthResponse, 'accessToken'>;

interface AuthSession {
    user: AuthUser;
    accessToken: string;
}

interface AuthContextType {
    user: AuthUser | null;
    accessToken: string | null;
    isAuthenticated: boolean;
    login: (data: LoginFormData) => Promise<AuthUser>;
    logout: () => void;
}

interface AuthProviderProps {
    children: ReactNode;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = 'shopsphere_auth';

function getInitialSession(): AuthSession | null {
    try {
        const storedSession = sessionStorage.getItem(STORAGE_KEY);

        if (!storedSession) {
            return null;
        }

        const parsed: unknown = JSON.parse(storedSession);

        if (
            typeof parsed !== 'object' ||
            parsed === null ||
            !('user' in parsed) ||
            !('accessToken' in parsed) ||
            typeof parsed.accessToken !== 'string' ||
            typeof parsed.user !== 'object' ||
            parsed.user === null
        ) {
            sessionStorage.removeItem(STORAGE_KEY);
            return null;
        }

        return parsed as AuthSession;

    } catch {
        sessionStorage.removeItem(STORAGE_KEY);
        return null;
    }
}

export function AuthProvider({ children }: AuthProviderProps) {

    const [session, setSession] = useState<AuthSession | null>(
        getInitialSession
    );

    const login = async (data: LoginFormData): Promise<AuthUser> => {

        const response = await loginUser(data);

        const { accessToken, ...user } = response;

        const newSession: AuthSession = {
            user,
            accessToken
        };

        sessionStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(newSession)
        );

        setSession(newSession);

        return user;
    };

    const logout = (): void => {
        sessionStorage.removeItem(STORAGE_KEY);
        setSession(null);
    };

    const contextValue: AuthContextType = {
        user: session?.user ?? null,
        accessToken: session?.accessToken ?? null,
        isAuthenticated: session !== null,
        login,
        logout
    };

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth(): AuthContextType {

    const context = useContext(AuthContext);

    if (!context) {
        throw new Error(
            'useAuth must be used within an AuthProvider'
        );
    }

    return context;
}

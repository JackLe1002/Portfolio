import React, { createContext, useReducer, ReactNode, Dispatch, useEffect } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from "../../types"; // Adjust the import path as necessary

export interface AuthState {
    user: User | null;
}

export interface AuthAction {
    type: "LOGIN" | "LOGOUT";
    payload?: { [key: string]: any } | null;
}

export const AuthContext = createContext<{ state: AuthState; dispatch: Dispatch<AuthAction> } | undefined>(undefined);

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
    switch (action.type) {
        case "LOGIN":
            return { user: action.payload?.user || null };
        case "LOGOUT":
            return { user: null };
        default:
            return state;
    }
};

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [state, dispatch] = useReducer(authReducer, {
        user: null,
    });

    useEffect(() => {
        // Load the user session from AsyncStorage when the provider mounts
        const loadUserSession = async () => {
            const session = await AsyncStorage.getItem("user");
            if (session) {
                const user = JSON.parse(session);
                dispatch({ type: "LOGIN", payload: { user } });
            }
        };

        loadUserSession();
    }, []);

    // Listen for state changes to store the user session
    useEffect(() => {
        // Store the user session in AsyncStorage whenever it changes
        const updateUserSession = async () => {
            if (state.user) {
                await AsyncStorage.setItem("user", JSON.stringify(state.user));
            } else {
                await AsyncStorage.removeItem("user");
            }
        };

        updateUserSession();
    }, [state.user]);

    return (
        <AuthContext.Provider value={{ state, dispatch }}>
            {children}
        </AuthContext.Provider>
    );
};

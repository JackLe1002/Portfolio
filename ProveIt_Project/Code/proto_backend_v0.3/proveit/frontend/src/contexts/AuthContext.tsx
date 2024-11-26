import React, { createContext, useReducer, ReactNode, Dispatch } from "react";

export interface AuthState {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    user: { [key: string]: any } | null;
}

export interface AuthAction {
    type: "LOGIN" | "LOGOUT";
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    payload?: { [key: string]: any } | null;
}

export const AuthContext = createContext<{ state: AuthState; dispatch: Dispatch<AuthAction> } | undefined>(undefined);

const authReducer = (state: AuthState,  action: AuthAction): AuthState => {
    switch (action.type) {
        case "LOGIN":
            return { user: action.payload || null }; // Provide a default value of null if action.payload is undefined
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

    return (
        <AuthContext.Provider value={{ state, dispatch }}>
            {children}
        </AuthContext.Provider>
    );
};


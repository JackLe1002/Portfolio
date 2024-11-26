import { useState } from "react";
import { useAuthContext } from "./useAuthContext";
import { useNavigate } from "react-router-dom";
import { User } from "../types";
export function useLogin() {
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const { dispatch } = useAuthContext();
    const navigate = useNavigate();

    const login = async (email: string, password: string) => {
        setIsLoading(true);
        setError("");

        const serverAddress = window.config.SERVER_URL;

        const LOGIN_LINK = serverAddress + "/login";

        // API call
        const response = await fetch(LOGIN_LINK, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
        });

        console.log(response);
        const json = await response.json();

        // Handle BAD/GOOD response
        if (response.status === 200) {
            setIsLoading(false);
            console.log("Login success");
            const user: User = json.user;
            localStorage.setItem("user", JSON.stringify(user));
            dispatch({ type: "LOGIN", payload: { user } });

            if (user.phoneVerified && user.role?.role) {
                navigate("/dashboard");
            } else if (user.phoneVerified) {
                navigate("/setrole");
            } else {
                navigate("/verifyphone");
            }
        } else {
            console.log("Login failure");
            setIsLoading(false);
            setError(json.message);
        }
    };

    return { login, isLoading, error };
}

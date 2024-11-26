import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "./useAuthContext";

const SIGNUP_LINK = window.config.SERVER_URL + "/signup";
const INVITED_SIGNUP_LINK = window.config.SERVER_URL + "/signup/invited";

export function useSignUp() {
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();
    const { dispatch } = useAuthContext();

    const signup = async (
        firstName: string,
        lastName: string,
        email: string,
        password: string,
    ) => {
        setIsLoading(true);
        setError(null);

        const response = await fetch(SIGNUP_LINK, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                user: { firstName, lastName, email, password },
            }),
        });
        const json = await response.json();
        console.log(json);
        // Handle BAD/GOOD response
        if (!json.isSuccess) {
            setIsLoading(false);
            setError(json.message);
        } else {
            localStorage.setItem(
                "LoginClusterMessage",
                "A confirmation link was sent to your email. Please check your inbox, click the link, and return to this page to complete your account creation",
            );
            setIsLoading(false);
            navigate("/Login");
        }
    };

    const invitedSignup = async (
        email: string,
        password: string,
        roleName: string,
    ) => {
        setIsLoading(true);
        setError(null);

        const response = await fetch(INVITED_SIGNUP_LINK, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                user: { email, password },
                roleName,
            }),
        });

        if (response.ok) {
            const responseJson = await response.json();
            if (responseJson.isSuccess) {
                setIsLoading(false);
                dispatch({
                    type: "LOGIN",
                    payload: { user: responseJson.data },
                }); //update authContext with new user data
                if (roleName == "service_provider") {
                    navigate("/onboarding/serviceprovider");
                } else {
                    navigate("/onboarding/tenant");
                }
            } else {
                setIsLoading(false);
                setError(responseJson.message);
            }
        } else {
            setIsLoading(false);
            setError(response.statusText);
        }
    };

    return { signup, invitedSignup, isLoading, error, setError };
}

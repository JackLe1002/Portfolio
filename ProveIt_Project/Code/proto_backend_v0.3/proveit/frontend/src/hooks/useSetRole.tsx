import { useState } from "react";
import { useAuthContext } from "./useAuthContext";
import { useNavigate } from "react-router-dom";

const VERIFY_OTP_API = "https://apiqa.hometrumpeter.com/user/set-role";

export function useSetRole() {
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const { state } = useAuthContext();
    const { user } = state;
    const navigate = useNavigate();
    const { dispatch } = useAuthContext();

    const setRole = async (roleName: string) => {
        setIsLoading(true);
        setError(null);

        // API call
        const response = await fetch(VERIFY_OTP_API, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                xck: import.meta.env.VITE_HT_API_KEY,
                Authorization: "Bearer " + user.token,
            },
            body: JSON.stringify({ roleName, refreshToken: user.refreshToken }),
        });
        const json = await response.json();

        // Handle BAD/GOOD response
        if (response.ok && json.isSuccess) {
            setIsLoading(false);
            //re-save the user to authContext with the token returned from the api call.
            const userUpdatedTokenAndRole = user;
            userUpdatedTokenAndRole.token = json.data.token;
            userUpdatedTokenAndRole.data.roleName = roleName;
            dispatch({ type: "LOGIN", payload: userUpdatedTokenAndRole }); //need to save new token to the auth context.
            navigate("/dashboard");
        } else if (response.ok) {
            setIsLoading(false);
            localStorage.setItem("setRoleResponse", JSON.stringify(json));
            setError(json.message);
        } else {
            setIsLoading(false);
            setError(json.error);
            console.error(json.error);
        }

        return json;
    };

    return { setRole, isLoading, error };
}

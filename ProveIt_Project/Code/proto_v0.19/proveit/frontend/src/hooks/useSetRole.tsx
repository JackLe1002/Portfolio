import { useState } from "react";
import { useAuthContext } from "./useAuthContext";
import { useNavigate } from "react-router-dom";
import { User } from "../types";

const VERIFY_OTP_API = window.config.SERVER_URL + "/set-role";

function getRoleId(roleName: string) {
    switch (roleName) {
        case "manager":
            return "21360403-e8c1-9ae2-11ec-a8bc125fac1b";
        case "owner":
            return "61381180-e6c3-11ec-9ae7-b8bc264eea1c";
        default:
            throw new Error("Role ID not found!");
    }
}

export function useSetRole() {
    const [error, setError] = useState<null | string>(null);
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
            },
            body: JSON.stringify({
                roleName,
                refreshToken: user?.refreshToken,
                Authorization: "Bearer " + user?.token,
            }),
        });
        const json = await response.json();

        if (response.ok && json.isSuccess) {
            setIsLoading(false);

            if (user) {
                //if the role is set successfully, we need to update the user's token and role
                const userUpdatedTokenAndRole: User = user;
                const roleId = getRoleId(roleName);
                userUpdatedTokenAndRole!.token = json.data.token;
                userUpdatedTokenAndRole!.role = { role: roleName, id: roleId };

                //re-save the user to authContext with the new token.
                localStorage.setItem(
                    "user",
                    JSON.stringify(userUpdatedTokenAndRole),
                );
                dispatch({
                    type: "LOGIN",
                    payload: { user: userUpdatedTokenAndRole },
                });

                navigate("/dashboard");
            } else {
                setError(
                    "Could not retrieve user from AuthContext. Please Log in again!",
                );
            }
        } else if (response.ok) {
            //if the response is ok, but the operation is not a success, display an error
            setIsLoading(false);
            setError(json.message);
        } else {
            //if the response is not okay, display an error
            setIsLoading(false);
            setError(json.error);
        }

        return json;
    };

    return { setRole, isLoading, error };
}

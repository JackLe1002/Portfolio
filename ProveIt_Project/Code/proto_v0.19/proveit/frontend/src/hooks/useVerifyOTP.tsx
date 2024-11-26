import { useState } from "react";
import { useAuthContext } from "./useAuthContext";
import { useNavigate } from "react-router-dom";

const VERIFY_OTP_API = window.config.SERVER_URL + "/contactverify";

export function useVerifyOTP() {
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const { dispatch } = useAuthContext();
    const { state } = useAuthContext();
    const { user } = state;
    const navigate = useNavigate();

    const verifyOTP = async (otp: string) => {
        setIsLoading(true);
        setError(null);

        // API call
        const response = await fetch(VERIFY_OTP_API, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                otp,
                email:
                    user?.email ?? "Could not retrieve email from authContext",
                phone: localStorage.getItem("userPhone"),
                type: "phone",
                Authorization:
                    "Bearer " + user?.token ??
                    "Could not retrieve authorization from authContext",
            }),
        });
        const json = await response.json();
        console.log(json);
        // Handle BAD/GOOD response
        if (response.ok && json.isSuccess) {
            setIsLoading(false);
            //update that phone has been verified in auth context
            const userUpdatedPhone = user;
            userUpdatedPhone!.phoneVerified = true;
            dispatch({ type: "LOGIN", payload: { user: userUpdatedPhone } });
            localStorage.setItem("user", JSON.stringify(userUpdatedPhone));
            if (user?.role) {
                navigate("/dashboard");
            } else {
                navigate("/setrole");
            }
        } else if (response.ok) {
            setIsLoading(false);
            setError(json.message);
            console.error(json.message);
        } else {
            setIsLoading(false);
            setError(json.error);
            console.error(json.error);
        }
        return json;
    };

    return { verifyOTP, isLoading, error };
}

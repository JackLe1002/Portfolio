import { useState } from "react";
import { useAuthContext } from "./useAuthContext";
import { useNavigate } from "react-router-dom";

const VERIFY_OTP_API = "https://apiqa.hometrumpeter.com/contact/verify";

export function useVerifyOTP() {
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const { dispatch }: any = useAuthContext();
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
                xck: import.meta.env.VITE_HT_API_KEY,
                Authorization: "Bearer " + user.token,
            },
            body: JSON.stringify({
                otp,
                email: user.data.user.email,
                phone: localStorage.getItem("userPhone"),
                type: "phone",
            }),
        });
        const json = await response.json();
        console.log(json);
        // Handle BAD/GOOD response
        if (response.ok && json.isSuccess) {
            setIsLoading(false);
            //update that phone has been verified in auth context
            const userUpdatedPhone = user;
            userUpdatedPhone.data.user.phoneVerified = true;
            dispatch({ type: "LOGIN", payload: userUpdatedPhone });
            navigate("/dashboard");
        } else if (response.ok) {
            setIsLoading(false);
            localStorage.setItem("verifyOTPResponse", JSON.stringify(json));
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

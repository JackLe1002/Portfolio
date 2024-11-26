import { useState } from "react";
import { useAuthContext } from "./useAuthContext";
import { useNavigate } from "react-router-dom";

const SEND_CONTACT_API = window.config.SERVER_URL + "/contactsend";

export function useVerifyPhone() {
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const { state } = useAuthContext();
    const { user } = state;
    const navigate = useNavigate();

    const verifyPhone = async (phone: string) => {
        setIsLoading(true);
        setError(null);

        //basic input validation
        if (phone.length < 17) {
            setError("Please enter a valid phone number");
            setIsLoading(false);
            return;
        }

        console.log(user);
        // API call
        const response = await fetch(SEND_CONTACT_API, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                phone,
                type: "phone",
                Authorization: "Bearer " + user?.token,
            }),
        });

        setIsLoading(true);
        const json = await response.json();

        // Handle BAD/GOOD response
        if (response.ok && json.isSuccess) {
            setIsLoading(false);
            localStorage.setItem("userPhone", phone); // save user data to local storage
            navigate("/verifyotp");
        } else if (response.ok) {
            setIsLoading(false);
            setError(json.message);
        } else {
            setIsLoading(false);
            setError(json.error);
            console.error(json.error);
        }
        return json;
    };

    return { verifyPhone, isLoading, error };
}

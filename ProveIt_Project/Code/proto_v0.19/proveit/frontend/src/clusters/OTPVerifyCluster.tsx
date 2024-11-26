import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import React, { useState } from "react";
import { useVerifyOTP } from "../hooks/useVerifyOTP";
import ErrorMessageContainer from "../components/ErrorMessageContainer";
type FormControlElement = HTMLInputElement | HTMLTextAreaElement;

export function OTPVerifyCluster() {
    const [otp, setOtp] = useState("");
    const { verifyOTP, isLoading, error } = useVerifyOTP();

    const handleSubmit = async (e: React.SyntheticEvent) => {
        e.preventDefault();
        verifyOTP(otp);
    };

    function handleOTPChange(e: React.ChangeEvent<FormControlElement>) {
        const targetValue = e.target.value;
        let foundNonNumericChar = false;
        let i = 0;
        while (i < targetValue.length && !foundNonNumericChar) {
            if (Number.isNaN(parseInt(targetValue.charAt(i)))) {
                e.target.value = otp;
                foundNonNumericChar = true;
            }
            i++;
        }

        if (!foundNonNumericChar) {
            setOtp(e.target.value);
        }
    }

    return (
        <>
            <div className="info-message">
                A four-digit one-time passcode has been sent to your phone by
                SMS. Please enter the code to verify your phone number.
            </div>
            <Form className="otp-input-cluster" onSubmit={handleSubmit}>
                <Form.Control
                    className="otp-input-control"
                    type="text"
                    maxLength={4}
                    onChange={(e) => {
                        handleOTPChange(e);
                    }}
                />
                {isLoading ? (
                    <div className="spinner-container">
                        <div className="spinner"></div>
                    </div>
                ) : (
                    <Button
                        type="submit"
                        className="otp-input-control standard-button"
                    >
                        Verify
                    </Button>
                )}
            </Form>

            {error && <ErrorMessageContainer message={error} />}
        </>
    );
}

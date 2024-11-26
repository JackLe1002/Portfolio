import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import React, { useState } from "react";
import { useVerifyPhone } from "../hooks/useVerifyPhone";
import ErrorMessageContainer from "../components/ErrorMessageContainer";
type FormControlElement = HTMLInputElement | HTMLTextAreaElement;

export function PhoneInputCluster() {
    const [phone, setPhone] = useState("");
    const { verifyPhone, error, isLoading } = useVerifyPhone();

    const handleSubmit = async (e: React.SyntheticEvent) => {
        e.preventDefault();
        await verifyPhone(phone);
    };

    function handlePhoneChange(e: React.ChangeEvent<FormControlElement>) {
        //reject non-numeric inputs and inputs above length limit
        const newInputChar: string = e.target.value.charAt(
            e.target.value.length - 1,
        );
        if (
            e.target.value.length > 17 ||
            Number.isNaN(parseInt(newInputChar))
        ) {
            e.target.value = e.target.value.substring(
                0,
                e.target.value.length - 1,
            );
        }

        if (phone.length < e.target.value.length) {
            switch (e.target.value.length) {
                case 1:
                    e.target.value = "+" + e.target.value;
                    break;
                case 3:
                    e.target.value =
                        e.target.value.substring(0, 2) +
                        " (" +
                        e.target.value.substring(2);
                    break;
                case 4:
                    e.target.value =
                        e.target.value.substring(0, 3) +
                        "(" +
                        e.target.value.substring(3);
                    break;
                case 7:
                    e.target.value = e.target.value + ") ";
                    break;
                case 8:
                    e.target.value =
                        e.target.value.substring(0, 7) +
                        ") " +
                        e.target.value.substring(7);
                    break;
                case 9:
                    e.target.value =
                        e.target.value.substring(0, 8) +
                        " " +
                        e.target.value.substring(8);
                    break;
                case 12:
                    e.target.value = e.target.value + "-";
                    break;
                case 13:
                    e.target.value =
                        e.target.value.substring(0, 12) +
                        "-" +
                        e.target.value.charAt(12);
                    break;
            }
        }
        setPhone(e.target.value);
    }

    return (
        <>
            <div className="welcome-message">
                Welcome to HomeTrumpeter, NewUser!
                <br />
                Please enter your phone number to finalize your account
            </div>
            <Form className="PhoneInputCluster" onSubmit={handleSubmit}>
                <Form.Control
                    type="phone"
                    placeholder="phone"
                    id="phone-input"
                    onChange={(e) => handlePhoneChange(e)}
                />
                {/*Buttons*/}
                {isLoading ? (
                    <div className="spinner-container">
                        <div className="spinner"></div>
                    </div>
                ) : (
                    <Button type="submit" className="verify-phone-button">
                        Verify phone
                    </Button>
                )}
            </Form>

            {error && <ErrorMessageContainer message={error} />}
        </>
    );
}

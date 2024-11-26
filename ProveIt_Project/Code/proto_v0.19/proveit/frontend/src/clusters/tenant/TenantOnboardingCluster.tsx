import { Form, Button } from "react-bootstrap";
import { useState } from "react";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useNavigate } from "react-router-dom";
import { FormControlElement } from "../../types";
import ErrorMessageContainer from "../../components/ErrorMessageContainer";
import Spinner from "../../components/Spinner";

import "../../styles/components/onboardTenant.css";

export default function TenantOnboardingCluster() {
    const [monthlyIncome, setMonthlyIncome] = useState("");
    const [workDetail, setWorkDetail] = useState("");
    const [numFamily, setNumFamily] = useState("");
    const [hasPets, setHasPets] = useState<boolean | undefined>(undefined);
    const [isSmoker, setIsSmoker] = useState<boolean | undefined>(undefined);

    const user = useAuthContext().state.user;
    const { dispatch } = useAuthContext();

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const navigate = useNavigate();

    const handleInputChange = (
        e: React.ChangeEvent<FormControlElement>,
        setter: React.Dispatch<React.SetStateAction<string>>,
    ) => {
        setter(e.target.value);
    };

    const handleSubmit = async (e: React.SyntheticEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        //frontend validation
        if (!user?.id) {
            setError("Could not retrieve userId from AuthContext!");
            setIsLoading(false);
            return;
        }

        if (
            !workDetail ||
            !monthlyIncome ||
            numFamily === "" ||
            hasPets === undefined ||
            isSmoker === undefined
        ) {
            setError("All fields must be filled out!");
            setIsLoading(false);
            return;
        }

        if (
            isNaN(parseInt(numFamily)) ||
            parseInt(numFamily) < 0 ||
            parseInt(numFamily) > 19
        ) {
            setError("Invalid number of family members!");
            setIsLoading(false);
            return;
        }

        if (
            isNaN(parseInt(monthlyIncome)) ||
            parseInt(monthlyIncome) > 1000000 ||
            parseInt(monthlyIncome) < 0
        ) {
            setError("Invalid monthly income!");
            setIsLoading(false);
            return;
        }

        const requestBody = {
            id: user?.id,
            userId: user?.id,
            workDetail: workDetail,
            earning: monthlyIncome,
            familyMembers: parseInt(numFamily),
            pets: hasPets,
            smoke: isSmoker,
            isAutoSearchAllowed: true,
            isRegFeePaid: true,
            questions: {},
            registrationFee: 0,
            questionStatus: 0,
        };

        const response = await fetch(
            window.config.SERVER_URL + "/survey/tenant",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(requestBody),
            },
        );

        if (response.ok) {
            const responseJson = await response.json();
            if (responseJson.isSuccess) {
                setIsLoading(false);
                dispatch({
                    type: "LOGIN",
                    payload: { user: responseJson.data },
                });
                localStorage.setItem(
                    "LoginClusterMessage",
                    "Your account has been created! You can now use your email and password to login to HomeTrumpeter",
                );
                navigate("/login");
            } else {
                setIsLoading(false);
                setError(responseJson.message);
            }
        } else {
            setIsLoading(false);
            setError(response.statusText);
        }
    };

    return (
        <div id="onboard-tenant-form-container">
            <Form className="onboard-tenant">
                <Form.Group controlId="monthly-income" className="form-group">
                    <Form.Label>What is your monthly income?</Form.Label>

                    <Form.Control
                        placeholder="Monthly Income"
                        type="number"
                        value={monthlyIncome}
                        onChange={(e) => handleInputChange(e, setMonthlyIncome)}
                    />
                </Form.Group>

                <Form.Group controlId="work-detail" className="form-group">
                    <Form.Label>What is your occupation?</Form.Label>

                    <Form.Control
                        placeholder="Occupation"
                        value={workDetail}
                        onChange={(e) => handleInputChange(e, setWorkDetail)}
                    />
                </Form.Group>

                <Form.Group controlId="num-family" className="form-group">
                    <Form.Label>
                        How many family members will be living with you?
                    </Form.Label>

                    <Form.Control
                        type="number"
                        placeholder="# Family members"
                        value={numFamily ?? ""}
                        max={10}
                        onChange={(e) => handleInputChange(e, setNumFamily)}
                    />
                </Form.Group>

                <Form.Group
                    controlId="has-pets"
                    className="form-group radio-group"
                >
                    <Form.Label>Do you have any pets?</Form.Label>

                    <Form.Check
                        type="radio"
                        name="has-pets"
                        onClick={() => setHasPets(true)}
                        label="Yes"
                    />

                    <Form.Check
                        type="radio"
                        name="has-pets"
                        onClick={() => setHasPets(false)}
                        label="No"
                    />
                </Form.Group>

                <Form.Group
                    controlId="is-smoker"
                    className="form-group radio-group"
                >
                    <Form.Label>Do you smoke?</Form.Label>

                    <Form.Check
                        type="radio"
                        name="is-smoker"
                        onClick={() => setIsSmoker(true)}
                        label="Yes"
                    />

                    <Form.Check
                        type="radio"
                        name="is-smoker"
                        onClick={() => setIsSmoker(false)}
                        label="No"
                    />
                </Form.Group>

                {isLoading ? (
                    <Spinner />
                ) : (
                    <Button
                        type="submit"
                        className="submit-button"
                        onClick={(e) => handleSubmit(e)}
                    >
                        Continue
                    </Button>
                )}
            </Form>

            {error && <ErrorMessageContainer message={error} />}
        </div>
    );
}

/**
 * Login Cluster includes the input box, buttons
 *
 * Sends: A payload to the HT signup API endpoint
 * Receives: Token containing signup status (success/fail)
 */
import React, { useEffect, useState } from "react";
import { useSignUp } from "../hooks/useSignup";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import ErrorMessageContainer from "../components/ErrorMessageContainer";
import { FormGroup } from "../components/Forms";
import Spinner from "../components/Spinner";
import { Dropdown } from "react-bootstrap";
import "../styles/components/signupCluster.css";
import { useSearchParams } from "react-router-dom";

/**
 * Handles signup buttons, input boxes
 * @returns Void
 */

interface SignUpTypeProps {
    signupType: string;
}
export function SignUpCluster(props: SignUpTypeProps) {
    const [firstName, setFirstName] = useState(""); // User first name - always retrieve from localStorage if possible
    const [lastName, setLastName] = useState(""); //// User last name - always retrieve from localStorage if possible
    const [email, setEmail] = useState(""); // User email - always retrieve from localStorage if possible
    const [password, setPassword] = useState(""); // User password
    const [confirmPassword, setConfirmPassword] = useState(""); // User confirm password
    const { signup, invitedSignup, error, isLoading, setError } = useSignUp();
    const [frontendError, setFrontendError] = useState("");
    const [roleName, setRoleName] = useState("");
    const [roleDisplayName, setRoleDisplayName] = useState("");

    const [searchParams] = useSearchParams();

    useEffect(() => {
        const email = searchParams.get("email");
        const role = searchParams.get("role");
        if (email) {
            setEmail(decodeURIComponent(email));
        }
        if (role) {
            handleRoleSelect(role);
        }
    }, [searchParams]);

    // Handle signup button
    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement>,
        setter: React.Dispatch<React.SetStateAction<string>>,
    ) => {
        setter(e.target.value);
    };

    //handle role dropdown selection
    const handleRoleSelect = (selectedRoleName: string) => {
        setRoleName(selectedRoleName);
        if (selectedRoleName == "tenant") {
            setRoleDisplayName("Tenant");
        } else if (selectedRoleName == "service_provider") {
            setRoleDisplayName("Service Provider");
        }
    };

    const isPasswordStrong = (password: string): boolean => {
        const passwordRegex = /^(?=.*[A-Z])(?=.*[@$!%*?&]).{8,14}$/;
        return passwordRegex.test(password);
    };

    const clearErrors = () => {
        setError(null);
        setFrontendError("");
    };

    const handleSubmit = async (e: React.SyntheticEvent) => {
        e.preventDefault();
        clearErrors();

        if (
            props.signupType == "manager" &&
            (!firstName || !lastName || !email || !password || !confirmPassword)
        ) {
            setFrontendError("All fields must be filled out.");
            return;
        }

        if (
            props.signupType == "invited" &&
            (!email || !password || !confirmPassword || !roleName)
        ) {
            console.log("Failing invited field check");
            setFrontendError("All fields must be filled out.");
            return;
        }

        if (password !== confirmPassword) {
            setFrontendError("Password and Confirm Password do not match.");
            return;
        }

        if (!isPasswordStrong(password)) {
            setFrontendError(
                "Password must be 8-14 characters long with 1 special character and 1 uppercase letter.",
            );
            return;
        }

        if (props.signupType == "invited") {
            await invitedSignup(email, password, roleName);
        } else {
            await signup(firstName, lastName, email, password);
        }

        // Store user email, first name and last name in local storage
        if (!error) {
            localStorage.setItem("user-email", email);
            localStorage.setItem("user-first-name", firstName);
            localStorage.setItem("user-last-name", lastName);
        } else {
            localStorage.removeItem("user-email");
            localStorage.removeItem("user-first-name");
            localStorage.removeItem("user-last-name");
        }
    };

    return (
        <Form className="signup-cluster" onSubmit={handleSubmit}>
            {props.signupType == "invited" && (
                <Form.Group>
                    <Dropdown>
                        <Dropdown.Toggle className="role-dropdown">
                            {roleDisplayName
                                ? roleDisplayName
                                : "Select your role"}
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                            <Dropdown.Item
                                onClick={() => handleRoleSelect("tenant")}
                            >
                                Tenant
                            </Dropdown.Item>

                            <Dropdown.Item
                                onClick={() =>
                                    handleRoleSelect("service_provider")
                                }
                            >
                                Service Provider
                            </Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </Form.Group>
            )}

            {props.signupType == "manager" && (
                <FormGroup
                    label="First Name"
                    value={firstName}
                    onChange={(e) => handleInputChange(e, setFirstName)}
                />
            )}
            {props.signupType == "manager" && (
                <FormGroup
                    label="Last Name"
                    value={lastName}
                    onChange={(e) => handleInputChange(e, setLastName)}
                />
            )}
            <FormGroup
                label="Email address"
                type="email"
                value={email}
                onChange={(e) => handleInputChange(e, setEmail)}
            />
            <FormGroup
                label="Password"
                type="password"
                value={password}
                onChange={(e) => handleInputChange(e, setPassword)}
            />
            <FormGroup
                label="Confirm Password"
                type="password"
                value={confirmPassword}
                onChange={(e) => handleInputChange(e, setConfirmPassword)}
            />

            {error && <ErrorMessageContainer message={error} />}
            {frontendError && <ErrorMessageContainer message={frontendError} />}

            {isLoading ? (
                <Spinner />
            ) : (
                <div className="sign-up-button-container">
                    <Button
                        type="submit"
                        className="sign-up-button standard-button"
                    >
                        Sign Up
                    </Button>
                </div>
            )}
        </Form>
    );
}

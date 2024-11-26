/**
 * Login Cluster includes the input box, buttons, checkboxes
 *
 * Sends: A payload to the HT login API endpoint
 * Receives: Token containing login status (success/fail)
 */
import React, { useState } from "react";
import { useLogin } from "../hooks/useLogin";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import ErrorMessageContainer from "../components/ErrorMessageContainer";
import "../styles/pages/loginpage.css";
import { FormGroup } from "../components/Forms";
import Spinner from "../components/Spinner";
import { useNavigate } from "react-router-dom";

/**
 * Handles login buttons, input boxes, and remember-me button
 * @returns Void
 */
export function LoginCluster() {
    const [email, setEmail] = useState(
        localStorage.getItem("user-email") || "",
    ); // User email - always retrieve from localStorage if possible
    const [password, setPassword] = useState(""); // User password
    const [remember, setRemember] = useState(false); // Remember-me button state
    const [formSubmitted, setFormSubmitted] = useState(false);
    const { login, error, isLoading } = useLogin();
    const navigate = useNavigate();

    //get message from previous page, if any
    const loginMessage: string | null = localStorage.getItem(
        "LoginClusterMessage",
    );

    // Handle login button
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        //clear login message and error
        localStorage.removeItem("LoginClusterMessage");
        setFormSubmitted(true); // Mark the form as submitted
        if (email && password) {
            await login(email, password);
            console.log("Error" + error);
            if (remember && !error) {
                localStorage.setItem("user-email", email);
            } else {
                localStorage.removeItem("user-email");
            }
        }
    };

    // Handle remember-me checkbox
    const handleToggleRemember = () => {
        setRemember(!remember);
    };

    return (
        <Form
            className={`login-cluster ${formSubmitted ? "form-submitted" : ""}`}
            onSubmit={(e) => {
                handleSubmit(e);
            }}
        >
            {/* Message to user from previous page */}
            {loginMessage && (
                <p className="login-page-message">{loginMessage}</p>
            )}

            <FormGroup
                label="Email address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={formSubmitted && !email ? "no-info-error" : ""}
            />

            {/* Password input */}
            <FormGroup
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={formSubmitted && !password ? "no-info-error" : ""}
            />

            <div className="remember-forgot-container">
                <Form.Check
                    type="checkbox"
                    id="autoSizingCheck"
                    className="mb-2"
                    label="Remember me"
                    onChange={handleToggleRemember}
                />
                <a
                    className="navigate-link"
                    onClick={() => navigate("/forgot-password")}
                >
                    Forgot password?
                </a>
            </div>

            {isLoading ? (
                <Spinner />
            ) : (
                <div className="login-button-container">
                    <Button type="submit" className="login-button">
                        Login
                    </Button>
                    <Button
                        type="button"
                        className="login-button"
                        href="./signup"
                    >
                        Create Account
                    </Button>
                </div>
            )}

            {error && <ErrorMessageContainer message={error} />}
        </Form>
    );
}

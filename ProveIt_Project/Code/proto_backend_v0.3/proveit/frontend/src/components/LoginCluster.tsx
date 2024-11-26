/**
 * Login Cluster includes the input box, buttons, checkboxes
 *
 * Sends: A payload to the HT login API endpoint
 * Receives: Token containing login status (success/fail)
 */
import { useState } from "react";
import { useLogin } from "../hooks/useLogin";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

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
    // Handle login button
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setFormSubmitted(true); // Mark the form as submitted
        if (email && password) {
            await login(email, password);
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
            onSubmit={handleSubmit}
        >
            {/* Email input */}
            <Form.Group className={`mb-3`} controlId="formGroupEmail">
                <Form.Label>Email address</Form.Label>
                <Form.Control
                    className={`${
                        formSubmitted && !password ? "no-info-error" : ""
                    }`}
                    type="email"
                    placeholder="Enter email"
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                />
            </Form.Group>

            {/* Password input */}
            <Form.Group className={`mb-3`} controlId="formGroupPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control
                    className={`${
                        formSubmitted && !password ? "no-info-error" : ""
                    }`}
                    type="password"
                    placeholder="Password"
                    onChange={(e) => setPassword(e.target.value)}
                />
            </Form.Group>

            {/* Remember me */}
            <div className="remember-forgot-container">
                <Form.Check
                    type="checkbox"
                    id="autoSizingCheck"
                    className="mb-2"
                    label="Remember me"
                    onChange={handleToggleRemember}
                />
                <a href="https://youtu.be/dQw4w9WgXcQ?si=xCkLFrt7q1dP8Bk2">
                    Forgot password?
                </a>
            </div>

            {/* Buttons */}
            {isLoading ? (
                <div className="spinner-container">
                    <div className="spinner"></div>
                </div>
            ) : (
                <div className="login-button-container">
                    <Button type="submit" className="login-button">
                        Login
                    </Button>
                    <Button type="button" className="login-button" href="./signup">
                        Create Account
                    </Button>
                </div>
            )}

        </Form>
    );
}

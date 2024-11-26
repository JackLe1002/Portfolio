/**
 * Login Cluster includes the input box, buttons
 *
 * Sends: A payload to the HT signup API endpoint
 * Receives: Token containing signup status (success/fail)
 */
import { useState } from "react";
import { useSignUp } from "../hooks/useSignup";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

/**
 * Handles signup buttons, input boxes
 * @returns Void
 */
export function SignUpCluster() {
    const [firstName, setFirstName] = useState(""); // User first name - always retrieve from localStorage if possible
    const [lastName, setLastName] = useState(""); //// User last name - always retrieve from localStorage if possible
    const [email, setEmail] = useState(""); // User email - always retrieve from localStorage if possible
    const [password, setPassword] = useState(""); // User password
    const [confirmPassword, setConfirmPassword] = useState(""); // User confirm password
    const { signup, error, isLoading, setError} = useSignUp();
    const [displayError, setDisplayError] = useState("");

    // Handle signup button
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, setter: React.Dispatch<React.SetStateAction<string>>) => {
        setter(e.target.value);
    };

    const isPasswordStrong = (password: string): boolean => {
        const passwordRegex = /^(?=.*[A-Z])(?=.*[@$!%*?&]).{8,14}$/;
        return passwordRegex.test(password);
    };

    const clearErrors = () => {
        setError(null);
    };

    const handleSubmit = async (e: React.SyntheticEvent) => {
        e.preventDefault();
        clearErrors();

        if (!firstName || !lastName || !email || !password || !confirmPassword) {
            setDisplayError('All fields must be filled out.');
            return;
        }

        if (password !== confirmPassword) {
            setDisplayError('Password and Confirm Password do not match.');
            return;
        }

        if (!isPasswordStrong(password)) {
            setDisplayError('Password must be 8-14 characters long with 1 special character and 1 uppercase letter.');
            return;
        }

        await signup(lastName, firstName, email, password); // Call API endpoint

        // Store user email, first name and last name in local storage
        if (!error) {
            localStorage.setItem("user-email", email);
            localStorage.setItem("user-first-name", firstName);
            localStorage.setItem("user-last-name", lastName);
        } else {
            setDisplayError(error);
            localStorage.removeItem("user-email");
            localStorage.removeItem("user-first-name");
            localStorage.removeItem("user-last-name");
        }
    };

    return (
        <Form className="signup-cluster" onSubmit={handleSubmit}>
            <FormGroup label="First Name" value={firstName} onChange={(e) => handleInputChange(e, setFirstName)} />
            <FormGroup label="Last Name" value={lastName} onChange={(e) => handleInputChange(e, setLastName)} />
            <FormGroup label="Email address" type="email" value={email} onChange={(e) => handleInputChange(e, setEmail)} />
            <FormGroup label="Password" type="password" value={password} onChange={(e) => handleInputChange(e, setPassword)} />
            <FormGroup label="Confirm Password" type="password" value={confirmPassword} onChange={(e) => handleInputChange(e, setConfirmPassword)} />
            {displayError && <div className="error">{displayError}</div>}
            {isLoading ? (
                <div className="spinner-container"> {/* Create a container for the spinner */}
                    <div className="spinner"></div> {/* Insert the spinner here */}
                </div>
            ) : (
                <div className="sign-up-button-container">
                    <Button type="submit" className="sign-up-button standard-button">
                        Sign Up
                    </Button>
                </div>
            )}
        </Form>
    );
}

interface FormGroupProps {
    label: string;
    type?: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

function FormGroup({ label, type = 'text', value, onChange }: FormGroupProps) {
    return (
        <Form.Group className="mb-3" controlId={`formGroup${label.replace(/\s+/g, '')}`}>
            <Form.Label>{label}</Form.Label>
            <Form.Control type={type} placeholder={`Enter ${label}`} value={value} onChange={onChange} />
        </Form.Group>
    );
}

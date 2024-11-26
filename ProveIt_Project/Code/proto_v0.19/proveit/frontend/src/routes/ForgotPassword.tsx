import htLogo from "../assets/ht-logo.svg";
import { Button, Form } from "react-bootstrap";
import "../styles/pages/forgotPassword.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import ErrorMessageContainer from "../components/ErrorMessageContainer";
import Spinner from "../components/Spinner";
import Modal from "react-bootstrap/Modal";

export function ForgotPassword() {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [email, setEmail] = useState<string | null>(null);

    const navigate = useNavigate();

    const [showMessageModal, setShowMessageModal] = useState(false);
    const [modalMessage, setModalMessage] = useState("");
    const handleShowMessageModal = (message: string) => {
        setModalMessage(message);
        setShowMessageModal(true);
    };

    const handleSubmit = async () => {
        setIsLoading(true);
        setError(null);

        const response = await fetch(
            window.config.SERVER_URL + "/forgotpassword",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email }),
            },
        );
        if (!response.ok) {
            setError(response.statusText);
            setIsLoading(false);
            return;
        }

        const responseJson = await response.json();
        if (responseJson.isSuccess) {
            handleShowMessageModal(responseJson.message);
            setIsLoading(false);
            navigate("/login");
        } else {
            setIsLoading(false);
            setError(responseJson.message);
        }
    };

    const ModalContent = (
        <Modal
            show={showMessageModal}
            onHide={() => setShowMessageModal(false)}
        >
            <Modal.Header closeButton>
                <Modal.Title>Error</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>{modalMessage}</p>
            </Modal.Body>
            <Modal.Footer>
                <Button
                    variant="secondary"
                    onClick={() => setShowMessageModal(false)}
                >
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );

    return (
        <div className="login-container">
            <img src={htLogo} className="main-logo" />

            <h1>Forgot password?</h1>

            <p>Enter your email below to reset your password</p>

            <Form>
                <Form.Control
                    className="mb-4"
                    onChange={(e) => setEmail(e.target.value)}
                />

                {isLoading ? (
                    <Spinner />
                ) : (
                    <Button className="submit-button" onClick={handleSubmit}>
                        Reset Password
                    </Button>
                )}
            </Form>

            {error && <ErrorMessageContainer message={error} />}
            {ModalContent}
        </div>
    );
}

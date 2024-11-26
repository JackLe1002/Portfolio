import { Button, Form, Stack } from "react-bootstrap";
import htLogo from "../assets/ht-logo.svg";
import { useAuthContext } from "../hooks/useAuthContext";
import { useState } from "react";
import Spinner from "../components/Spinner";
import ErrorMessageContainer from "../components/ErrorMessageContainer";
import { useNavigate } from "react-router";
import Modal from "react-bootstrap/Modal";

export function ApplyPublic() {
    const user = useAuthContext().state.user;
    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [consent, setConsent] = useState<boolean>(false);

    const APPLY_PUBLIC_LINK = window.config.SERVER_URL + "/apply-public";

    const [showMessageModal, setShowMessageModal] = useState(false);
    const [modalMessage, setModalMessage] = useState("");
    const handleShowMessageModal = (message: string) => {
        setModalMessage(message);
        setShowMessageModal(true);
    };

    const handleApplyForPublic = () => {
        if (!consent) {
            setError(
                "You must consent to the background check to apply for public status.",
            );
        } else if (!user?.spDetail) {
            setError("Error retrieving user details from authContext");
        } else {
            setIsLoading(true);
            console.log("Applying for public status...");

            const backgroundCheckBody = {
                userId: user?.id,
                firstName: user?.firstName,
                lastName: user?.lastName,
                email: user?.email,
            };

            const newSpDetail = user?.spDetail;
            newSpDetail.isAppliedForPublic = true;

            const applyPublicBody = {
                bgCheck: backgroundCheckBody,
                spDetail: newSpDetail,
            };

            const headers = new Headers();
            headers.append("Content-Type", "application/json");
            headers.append("Authorization", `Bearer ${user.token}`);

            fetch(APPLY_PUBLIC_LINK, {
                method: "POST",
                headers: headers,
                body: JSON.stringify(applyPublicBody),
            })
                .then((response) => {
                    setIsLoading(false);
                    if (!response.ok) {
                        setError("Network response was not ok");
                    }
                    return response.json();
                })
                .then((responseJson) => {
                    if (responseJson.isSuccess) {
                        handleShowMessageModal(
                            responseJson.message ??
                                "Successfully applied for public status",
                        );
                    } else {
                        setError(responseJson.message ?? "An error occured");
                    }
                });
        }
    };

    const handleConsentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setConsent(e.target.checked);
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
                    onClick={() => {
                        setShowMessageModal(false);
                        navigate("/dashboard");
                    }}
                >
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );

    return (
        <div className="login-container">
            <img src={htLogo} className="main-logo" />
            <h1 className="mb-4">Apply for public status</h1>

            <div style={{ width: "90%", maxWidth: "600px" }}>
                <Stack gap={3}>
                    <p>
                        Public service provider status allows you to advertise
                        your services and respond to service requests from all
                        HomeTrumpeter users.
                    </p>

                    <p>
                        To become a public service provider, you will be
                        required to complete a background check with our
                        verification partners{" "}
                        <a href="https://certn.co/">Certn</a>.
                    </p>

                    <p>
                        Once your background check is approved, you will be able
                        to recieve service requests from all HomeTrumpeter users
                        within your range of operation.
                    </p>

                    <Form.Check
                        className={!consent && error ? "no-info-error" : ""}
                        label="I consent to my email, first name, and last name being sent to certn for the purpose of
                            initiating the background check"
                        onChange={(e) => {
                            handleConsentChange(e);
                        }}
                    />

                    {isLoading ? (
                        <Spinner />
                    ) : (
                        <Button
                            // disabled={!consent}
                            className="standard-button"
                            onClick={handleApplyForPublic}
                        >
                            Apply for Public Status
                        </Button>
                    )}

                    {error && <ErrorMessageContainer message={error} />}
                </Stack>
            </div>
            {ModalContent}
        </div>
    );
}

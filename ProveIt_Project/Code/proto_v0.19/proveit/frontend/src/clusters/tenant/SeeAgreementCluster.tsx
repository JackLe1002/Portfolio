import { useEffect } from "react";

import { useLogout } from "../../hooks/useLogout";
import { useState } from "react";
import { useAuthContext } from "../../hooks/useAuthContext";
import { Link, useNavigate } from "react-router-dom";
import { Agreement } from "../../types";
import Offcanvas from "react-bootstrap/Offcanvas";
import Nav from "react-bootstrap/Nav";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";

import "../../styles/pages/tenantAgreement.css";

/**
 *
 * @returns Void
 */
export function SeeAgreementCluster() {
    const { logout } = useLogout();
    const [isLoading, setIsLoading] = useState(false);
    const [agreement, setAgreement] = useState<Agreement | null>(null);

    const { state } = useAuthContext();
    const { user } = state;
    const navigate = useNavigate();
    const [isOffcanvasOpen, setIsOffcanvasOpen] = useState(false);
    const toggleOffcanvas = () => {
        setIsOffcanvasOpen(!isOffcanvasOpen);
    };

    useEffect(() => {
        setIsLoading(true);
        if (user && agreement == null) {
            fetch(window.config.SERVER_URL + "/agreement/tenant-see", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + user?.token,
                },
                body: JSON.stringify({ id: user.id }),
            })
                .then((response) => {
                    if (!response.ok) {
                        throw new Error("Network response was not ok");
                    }
                    return response.json();
                })
                .then((data) => {
                    setIsLoading(false);
                    setAgreement(data);
                })
                .catch((error) => {
                    console.error("Error fetching data: " + error);
                });
        }
    }, [user, user?.token, agreement, isLoading]);

    const handleApproveAgreement = () => {
        if (user) {
            setIsLoading(true);
            const queryParams = new URLSearchParams({
                userId: user.id,
            }).toString();

            fetch(
                `${window.config.SERVER_URL}/agreement/approve?${queryParams}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${user?.token}`,
                    },
                },
            ).finally(() => {
                setIsLoading(false);
            });
        }
        navigate("/dashboard");
    };

    console.log(isLoading);
    return (
        <div className="container">
            <div className="header">
                <h1
                    className="dashboard-title"
                    onClick={() => navigate("/dashboard")}
                >
                    Dashboard Tenant
                </h1>
                <button
                    className="menu-toggle-button"
                    onClick={toggleOffcanvas}
                >
                    ☰
                </button>
            </div>

            {/* Nav Panel */}
            <Offcanvas
                show={isOffcanvasOpen}
                onHide={toggleOffcanvas}
                placement="end"
            >
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title>View Agreement</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    <div className="nav-container">
                        <Nav.Link onClick={() => navigate("/dashboard")}>
                            Dashboard
                        </Nav.Link>
                    </div>
                    <button className="logout-button" onClick={logout}>
                        Log out
                    </button>
                </Offcanvas.Body>
            </Offcanvas>

            <div className="main_agreement">
                {agreement?.status != "not found" ? (
                    <Form>
                        <Form.Group as={Row} controlId="rent">
                            <Form.Label column sm="5">
                                Rent
                            </Form.Label>
                            <Col sm="5">
                                <Form.Control
                                    type="text"
                                    value={agreement?.rent}
                                    plaintext
                                    readOnly
                                />
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row} controlId="securityDeposit">
                            <Form.Label column sm="5">
                                Security Deposit
                            </Form.Label>
                            <Col sm="5">
                                <Form.Control
                                    type="text"
                                    value={agreement?.advancePayment}
                                    plaintext
                                    readOnly
                                />
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row} controlId="lateFee">
                            <Form.Label column sm="5">
                                Late Fee
                            </Form.Label>
                            <Col sm="5">
                                <Form.Control
                                    type="number"
                                    value={agreement?.lateFee}
                                    plaintext
                                    readOnly
                                />
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row} controlId="rentDueDate">
                            <Form.Label column sm="5">
                                Rent Due Date
                            </Form.Label>
                            <Col sm="5">
                                <Form.Control
                                    type="number"
                                    value={agreement?.rentDueDate}
                                    plaintext
                                    readOnly
                                />
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row} controlId="startDate">
                            <Form.Label column sm="5">
                                Start Date
                            </Form.Label>
                            <Col sm="5">
                                <Form.Control
                                    type="string"
                                    value={agreement?.startDate}
                                    plaintext
                                    readOnly
                                />
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row} controlId="endDate">
                            <Form.Label column sm="5">
                                End Date
                            </Form.Label>
                            <Col sm="5">
                                <Form.Control
                                    type="string"
                                    value={agreement?.endDate}
                                    plaintext
                                    readOnly
                                />
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row} controlId="status">
                            <Form.Label column sm="5">
                                Status
                            </Form.Label>
                            <Col sm="5">
                                <Form.Control
                                    type="string"
                                    value={agreement?.status}
                                    plaintext
                                    readOnly
                                />
                            </Col>
                        </Form.Group>
                        {agreement?.status === "submitted" ? (
                            <Button
                                variant="primary"
                                type="submit"
                                className="submitButton"
                                onClick={handleApproveAgreement}
                            >
                                I Agree
                            </Button>
                        ) : (
                            <p>Agreement is already approved</p>
                        )}
                        <Link to="/dashboard" className="goBackLink">
                            <Button
                                variant="outline-primary"
                                size="sm"
                                className="goBackButton"
                            >
                                <span>Go Back</span>
                            </Button>
                        </Link>
                    </Form>
                ) : (
                    <h1>Agreement haven't been submitted yet!</h1>
                )}
            </div>

            {/* Footer */}
            <footer className="agreement-footer">
                <div className="footer-content">
                    <p>
                        © {new Date().getFullYear()} HomeTrumpeter. All rights
                        reserved.
                    </p>
                    <div className="footer-links">
                        <a onClick={() => navigate("/privacy")}>
                            Privacy Policy
                        </a>
                        <a onClick={() => navigate("/tos")}>Terms of Service</a>
                        <a onClick={() => navigate("/contact")}>Contact Us</a>
                    </div>
                </div>
            </footer>
        </div>
    );
}

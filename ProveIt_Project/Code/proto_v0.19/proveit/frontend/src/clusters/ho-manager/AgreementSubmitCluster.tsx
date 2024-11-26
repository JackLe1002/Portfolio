import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { Link, useNavigate } from "react-router-dom";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useSearchParams } from "react-router-dom";
import DatePicker from "react-datepicker";
import Modal from "react-bootstrap/Modal";
import "react-datepicker/dist/react-datepicker.css";
import "../../styles/pages/addProperty.css";

export function AgreementSubmitCluster() {
    const { state } = useAuthContext();
    const { user } = state;
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const [integrationFee, setIntegrationFee] = useState<string>("");
    const [rent, setRent] = useState<string>("");
    const [htFee, setHtFee] = useState<string>("");
    const [managerFee, setManagerFee] = useState<string>("");
    const [advancePayment, setAdvancePayment] = useState<string>("");
    const [rentDueDate, setRentDueDate] = useState<string>("");
    const [startDate, setStartDate] = useState<Date>(new Date());
    const [endDate, setEndDate] = useState<Date>(new Date());
    const [lateFee, setLateFee] = useState<string>("");

    const TENANT_ID = searchParams.get("id");

    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [SuccessModalMessage, setSuccessModalMessage] = useState("");
    const handleShowSuccessModal = (errorMessage: string) => {
        setSuccessModalMessage(errorMessage);
        setShowSuccessModal(true);
    };
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [errorModalMessage, setErrorModalMessage] = useState("");
    const handleShowErrorModal = (errorMessage: string) => {
        setErrorModalMessage(errorMessage);
        setShowErrorModal(true);
    };

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement>,
        setter: React.Dispatch<React.SetStateAction<string>>,
    ) => {
        e.preventDefault();
        setter(e.target.value);
    };

    const handleDateInput = (
        e: React.ChangeEvent<HTMLInputElement>,
        setter: React.Dispatch<React.SetStateAction<string>>,
    ) => {
        const inputValue = e.target.value;

        if (
            inputValue === "" ||
            (parseInt(inputValue) >= 1 && parseInt(inputValue) <= 29)
        ) {
            setter(inputValue);
        } else {
            // Display error message or handle invalid input here
            console.error("Number must be in range 1 to 29");
        }
    };

    const handleSubmit = (e: React.MouseEvent) => {
        e.preventDefault();
        const submitJSON = {
            rent: rent,
            integrationFee: integrationFee,
            htFee: htFee,
            managerFee: managerFee,
            advancePayment: advancePayment,
            rentDueDate: rentDueDate,
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString(),
            lateFee: lateFee,
        };

        const queryParams = new URLSearchParams({
            userId: TENANT_ID !== null ? TENANT_ID : "",
        }).toString();

        fetch(`${window.config.SERVER_URL}/agreement/submit?${queryParams}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${user?.token}`,
            },
            body: JSON.stringify(submitJSON),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                return response.json();
            })
            .then((responseJson) => {
                if (responseJson.isSuccess) {
                    handleShowSuccessModal(responseJson.message);
                } else if (!responseJson.isSuccess) {
                    handleShowErrorModal(responseJson.message);
                }
            })
            .catch((error) => console.error("Error updating data:", error));
    };

    const SuccessModalContent = (
        <Modal
            show={showSuccessModal}
            onHide={() => setShowSuccessModal(false)}
        >
            <Modal.Header closeButton>
                <Modal.Title>Error</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>{SuccessModalMessage}</p>
            </Modal.Body>
            <Modal.Footer>
                <Button
                    variant="secondary"
                    onClick={() => {
                        setShowSuccessModal(false);
                        navigate("/ho/tenants");
                    }}
                >
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );

    const errorModalContent = (
        <Modal show={showErrorModal} onHide={() => setShowErrorModal(false)}>
            <Modal.Header closeButton>
                <Modal.Title>Error</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>{errorModalMessage}</p>
            </Modal.Body>
            <Modal.Footer>
                <Button
                    variant="secondary"
                    onClick={() => setShowErrorModal(false)}
                >
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );

    return (
        <div className=" main_addProperty">
            <div className="forms">
                <Form>
                    <Form.Group controlId="rentAmount">
                        <Form.Label>Rent</Form.Label>
                        <Form.Control
                            type="number"
                            placeholder="Enter rent"
                            value={rent}
                            onChange={(
                                e: React.ChangeEvent<HTMLInputElement>,
                            ) => handleInputChange(e, setRent)}
                        />
                    </Form.Group>

                    <Form.Group controlId="integrationFee">
                        <Form.Label>Integration Fee</Form.Label>
                        <Form.Control
                            type="number"
                            placeholder="Enter intergration fee"
                            value={integrationFee}
                            onChange={(
                                e: React.ChangeEvent<HTMLInputElement>,
                            ) => handleInputChange(e, setIntegrationFee)}
                        />
                    </Form.Group>

                    <Form.Group controlId="htFee">
                        <Form.Label>ht Fee</Form.Label>
                        <Form.Control
                            type="number"
                            placeholder="Enter ht fee"
                            value={htFee}
                            onChange={(
                                e: React.ChangeEvent<HTMLInputElement>,
                            ) => handleInputChange(e, setHtFee)}
                        />
                    </Form.Group>

                    <Form.Group controlId="managerFee">
                        <Form.Label>Manager Fee</Form.Label>
                        <Form.Control
                            type="number"
                            placeholder="Enter manager fee"
                            value={managerFee}
                            onChange={(
                                e: React.ChangeEvent<HTMLInputElement>,
                            ) => handleInputChange(e, setManagerFee)}
                        />
                    </Form.Group>

                    <Form.Group controlId="advancePayment">
                        <Form.Label>Advance Payment</Form.Label>
                        <Form.Control
                            type="number"
                            placeholder="Enter advance payment"
                            value={advancePayment}
                            onChange={(
                                e: React.ChangeEvent<HTMLInputElement>,
                            ) => handleInputChange(e, setAdvancePayment)}
                        />
                    </Form.Group>

                    <Form.Group controlId="rentDueDate">
                        <Form.Label>Rent Due Date</Form.Label>
                        <Form.Control
                            type="number"
                            placeholder="Enter rent due date"
                            value={rentDueDate}
                            onChange={(
                                e: React.ChangeEvent<HTMLInputElement>,
                            ) => handleDateInput(e, setRentDueDate)}
                        />
                    </Form.Group>

                    <Form.Group controlId="lateFee">
                        <Form.Label>Late Fee</Form.Label>
                        <Form.Control
                            type="number"
                            placeholder="Enter late fee"
                            value={lateFee}
                            onChange={(
                                e: React.ChangeEvent<HTMLInputElement>,
                            ) => handleInputChange(e, setLateFee)}
                        />
                    </Form.Group>

                    <Form.Group controlId="startDate">
                        <Form.Label>Start Date</Form.Label>
                        <DatePicker
                            selected={startDate}
                            onChange={(date: Date) => setStartDate(date)}
                            dateFormat="yyyy/MM/dd/"
                            placeholderText="Enter Start Date"
                        />
                    </Form.Group>

                    <Form.Group controlId="endDate">
                        <Form.Label>Start Date</Form.Label>
                        <DatePicker
                            selected={endDate}
                            onChange={(date: Date) => setEndDate(date)}
                            dateFormat="yyyy/MM/dd/"
                            placeholderText="Enter Start Date"
                        />
                    </Form.Group>

                    <Button
                        variant="primary"
                        type="submit"
                        className="submitButton"
                        onClick={(e: React.MouseEvent) => handleSubmit(e)}
                    >
                        Submit
                    </Button>
                    <Link to="/ho/tenants" className="goBackLink">
                        <Button
                            variant="outline-primary"
                            size="sm"
                            className="goBackButton"
                        >
                            <span>Go Back</span>
                        </Button>
                    </Link>
                </Form>
            </div>
            {errorModalContent}
            {SuccessModalContent}
        </div>
    );
}

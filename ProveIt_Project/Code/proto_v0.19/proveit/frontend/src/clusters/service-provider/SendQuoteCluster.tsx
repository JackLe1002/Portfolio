import { useCallback, useState } from "react";
import { useAuthContext } from "../../hooks/useAuthContext";
import { ServiceRequestSP } from "../../types";
import { Link, useNavigate } from "react-router-dom";
//import ErrorMessageContainer from "../../components/ErrorMessageContainer";
import Form from "react-bootstrap/Form";
import DatePicker from "react-datepicker";
import { FormControl, Button, Modal } from "react-bootstrap";
import "../../styles/components/sendQuote.css";

const INVITED_SIGNUP_LINK = window.config.SERVER_URL + "/send-proposal";

export type Proposal = {
    id: string;
    detail: string;
    quotePrice: string;
    quoteType: string;
    estimatedHours: string;
    startDate: string;
    endDate: string;
};

export function SendQuoteCluster(ticketObj: { ticket: ServiceRequestSP }) {
    const user = useAuthContext().state.user;
    const navigate = useNavigate();
    const ticket = ticketObj.ticket;

    //const [error, setError] = useState<string | null>(null);

    const [quotePrice, setQuotePrice] = useState<string>("0");
    const [quoteType, setQuoteType] = useState<string>("hourly");
    const [estimatedHours, setEstimatedHours] = useState<string>("0");
    const [startDate, setStartDate] = useState<Date>(new Date());
    const [endDate, setEndDate] = useState<Date>(new Date());

    const [showErrorModal, setShowErrorModal] = useState(false);
    const [errorModalMessage, setErrorModalMessage] = useState("");
    const handleShowErrorModal = (errorMessage: string) => {
        setErrorModalMessage(errorMessage);
        setShowErrorModal(true);
    };

    const postData = useCallback(
        async (url: string, body: Proposal) => {
            const headers = new Headers();
            headers.append("Content-Type", "application/json");

            if (user) {
                headers.append("Authorization", `Bearer ${user.token}`);
            }
            const requestOptions = {
                method: "POST",
                headers: headers,
                body: JSON.stringify(body),
            };

            try {
                const response = await fetch(url, requestOptions);
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                return response.json();
            } catch (error) {
                console.error("Error:", error);
                handleShowErrorModal("An error occured");
                throw error;
            }
        },
        [user],
    );

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement>,
        setter: React.Dispatch<React.SetStateAction<string>>,
    ) => {
        e.preventDefault();
        setter(e.target.value);
    };

    const handleSubmit = () => {
        try {
            if (
                ticket == null ||
                quotePrice == null ||
                quoteType == null ||
                estimatedHours == null ||
                startDate == null ||
                endDate == null
            ) {
                throw new Error("Empty fields");
            }
            const body: Proposal = {
                id: ticket.id.toString(),
                detail: ticket.serviceRequest.detail.toString(),
                quotePrice: quotePrice.toString(),
                quoteType: quoteType.toString(),
                estimatedHours: estimatedHours.toString(),
                startDate: startDate.toISOString(),
                endDate: endDate.toISOString(),
            };
            console.log("RUN");

            postData(INVITED_SIGNUP_LINK, body).then((response) => {
                if (response.isSuccess) {
                    console.log("SUCCESS POST SP QUOTE");
                    console.log(response.data);
                    navigate("/dashboard");
                } else {
                    handleShowErrorModal(response.message);
                }
            });
        } catch (error) {
            handleShowErrorModal("Please fill all fields");
        }
    };

    return (
        <div id="send-form-container">
            {/*error && <ErrorMessageContainer message={error}/>*/}
            <Form className="send-quote">
            <Form.Group>
                <Form.Label>Quote Price</Form.Label>
                <FormControl
                    type="number"
                    placeholder="Enter quote price"
                    value={quotePrice}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        handleInputChange(e, setQuotePrice)
                    }
                />
            </Form.Group>
            <p style={{ textAlign: "left" }}>Quote Type</p>
            <Form style={{ textAlign: "center" }}>
                <Form.Check
                    inline
                    type="radio"
                    id="hourly-radio-button"
                    name="group1"
                    label="Hourly"
                    onChange={() => {
                        setQuoteType("hourly");
                    }}
                    defaultChecked
                />
                <Form.Check
                    inline
                    type="radio"
                    id="fixed-radio-button"
                    name="group1"
                    label="Fixed"
                    onChange={() => {
                        setQuoteType("fixed");
                    }}
                />
            </Form>
            <br></br>
            <Form.Group>
                <Form.Label>Estimated Hours</Form.Label>
                <Form.Control
                    type="number"
                    placeholder="Enter estimated hours"
                    value={estimatedHours}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        handleInputChange(e, setEstimatedHours)
                    }
                />
            </Form.Group>
            <p>Start Date</p>  
            <DatePicker
                selected={startDate}
                onChange={(date: Date) => setStartDate(date)}
                className="date-select"
            />
            <p>End Date</p>
            <DatePicker
                selected={endDate}
                onChange={(date: Date) => setEndDate(date)}
                className="date-select"
            />
            <br></br>
            <button className="submit-button" onClick={() => handleSubmit()}>
                Submit Quote
            </button>
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

            <Modal
                show={showErrorModal}
                onHide={() => setShowErrorModal(false)}
            >
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
        </div>
    );
}

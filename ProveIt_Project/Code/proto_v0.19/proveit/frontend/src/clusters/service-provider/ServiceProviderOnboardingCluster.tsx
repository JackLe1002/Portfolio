import { useAuthContext } from "../../hooks/useAuthContext";
import { useCallback, useState, useEffect } from "react";
import { City, State, Zip } from "../../types";
import { Button, Form } from "react-bootstrap";
import SearchableDropdown from "../../components/DropDownList";
import { useNavigate } from "react-router-dom";
import Modal from "react-bootstrap/Modal";
import "../../styles/components/onboardServiceProvider.css";
import Spinner from "../../components/Spinner";
import ErrorMessageContainer from "../../components/ErrorMessageContainer";

export function ServiceProviderOnboardingCluster() {
    const user = useAuthContext().state.user;

    const [states, setStates] = useState<State[]>([]);
    const [selectedState, setSelectedState] = useState<State | null>(null);

    const [citiesInState, setCitiesInState] = useState<City[]>([]);
    const [selectedCity, setSelectedCity] = useState<City | null>(null);

    const [zipsInCity, setZipsInCity] = useState<Zip[]>([]);
    const [selectedZip, setSelectedZip] = useState<Zip | null>(null);

    const [distanceCovered, setDistanceCovered] = useState<number>(0);
    const [perHourRate, setPerHourRate] = useState<number>(0);
    const [company, setCompany] = useState<string | null>(null);
    const [address, setAddress] = useState<string | null>(null);

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [showMessageModal, setShowMessageModal] = useState(false);
    const [modalMessage, setModalMessage] = useState("");
    const handleShowMessageModal = (message: string) => {
        setModalMessage(message);
        setShowMessageModal(true);
    };

    const navigate = useNavigate();

    const fetchData = useCallback(
        async (url: string, method = "GET") => {
            const headers = new Headers();
            headers.append("Content-Type", "application/json");

            if (user) {
                headers.append("Authorization", `Bearer ${user.token}`);
            }
            const requestOptions = {
                method: method,
                headers: headers,
            };

            try {
                const response = await fetch(url, requestOptions);
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                return response.json();
            } catch (error) {
                console.error("Error:", error);
                throw error;
            }
        },
        [user],
    );

    useEffect(() => {
        const url = window.config.SERVER_URL + "/state";
        fetchData(url)
            .then((data) => setStates(data))
            .catch((error) => console.error("Error fetching data:", error));
    }, [fetchData]);

    const handleStateSelect = (selectedState: State) => {
        setSelectedState(selectedState);
        setSelectedCity(null);
        setSelectedZip(null);
        sessionStorage.setItem(
            "addPropertySelectedState",
            JSON.stringify(selectedState),
        );

        //Send a POST request to the API with the selected option
        const url =
            window.config.SERVER_URL +
            "/city?" +
            new URLSearchParams({ stateId: selectedState.id });
        fetchData(url)
            .then((data) => setCitiesInState(data))
            .catch((error) => console.error("Error fetching data:", error));
        console.log("Selected state");
        console.log(selectedState);
    };

    const handleCitySelect = (selectedCity: City) => {
        setSelectedCity(selectedCity);
        setSelectedZip(null);
        sessionStorage.setItem(
            "addPropertySelectedCity",
            JSON.stringify(selectedCity),
        );

        const url =
            window.config.SERVER_URL +
            "/zip?" +
            new URLSearchParams({ cityId: selectedCity.cityId });
        fetchData(url)
            .then((data) => setZipsInCity(data))
            .catch((error) => console.error("Error fetching data:", error));
    };

    const handleZipSelect = (selectedZipObj: Zip) => {
        setSelectedZip(selectedZipObj);
        sessionStorage.setItem(
            "addPropertySelectedZip",
            JSON.stringify(selectedZipObj),
        );
    };

    const handleSubmit = async () => {
        setError(null);
        setIsLoading(true);

        //validate the address given by the provider
        const addressValidateBody = {
            cityId: selectedCity?.cityId,
            stateId: selectedState?.id,
            zipcodeId: selectedZip?.zipId,
            streetAddress: address,
        };
        const addressValidateResponse = await fetch(
            window.config.SERVER_URL + "/address/validate",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(addressValidateBody),
            },
        );

        const addressValidateJson = await addressValidateResponse.json();
        let latitude, longitude;
        if (addressValidateJson.isSuccess) {
            latitude = addressValidateJson.data.latitude;
            longitude = addressValidateJson.data.longitude;
        } else {
            setError(
                "Failed to validate address. Please enter a valid address",
            );
            setIsLoading(false);
            return;
        }

        const spDetailBody = {
            userId: user?.id,
            company: company,
            cityId: selectedCity?.cityId,
            stateId: selectedState?.id,
            countyId: selectedCity?.countyId,
            zipcodeId: selectedZip?.zipId,
            distanceCovered: distanceCovered,
            address: address,
            latitude: latitude,
            longitude: longitude,
            perHourRate: perHourRate,
        };

        console.log("Posting service provider details...");
        console.log(spDetailBody);

        const response = await fetch(
            window.config.SERVER_URL + "/invited/sp-detail",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(spDetailBody),
            },
        );

        const responseJson = await response.json();
        if (responseJson.isSuccess) {
            handleShowMessageModal(
                "Your account creation is complete. You may now log in.",
            );
            navigate("/login");
        } else {
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
        <div id="onboard-sp-form-container">
            <Form className="onboard-sp">
                <Form.Group className="mb-2" controlId="serviceProviderCompany">
                    <Form.Label>What is your company's name?</Form.Label>

                    <Form.Control
                        placeholder="Company Name"
                        onChange={(e) => {
                            setCompany(e.target.value);
                        }}
                    />
                </Form.Group>

                <Form.Group className="mb-2" controlId="serviceProviderRate">
                    <Form.Label>What is your hourly rate? (USD/hr)</Form.Label>

                    <Form.Control
                        placeholder="Hourly Rate"
                        type="number"
                        min={0}
                        max={10000}
                        onChange={(e) => {
                            setPerHourRate(parseInt(e.target.value));
                        }}
                    />
                </Form.Group>

                <Form.Group className="mb-2" controlId="serviceProviderState">
                    <Form.Label>What state do you operate in?</Form.Label>

                    <SearchableDropdown
                        items={states}
                        onSelect={handleStateSelect}
                        placeholder={
                            selectedState
                                ? selectedState.name
                                : "Select a State"
                        }
                        labelKey="name"
                    />
                </Form.Group>

                <Form.Group className="mb-2" controlId="serviceProviderCity">
                    <Form.Label>
                        In which city is your company located?
                    </Form.Label>

                    <SearchableDropdown
                        items={citiesInState}
                        onSelect={handleCitySelect}
                        placeholder={
                            selectedCity ? selectedCity.name : "Select a City"
                        }
                        labelKey="name"
                    />
                </Form.Group>

                <Form.Group className="mb-2" controlId="serviceProviderZip">
                    <Form.Label>What is your company's zip code?</Form.Label>

                    <SearchableDropdown
                        items={zipsInCity}
                        onSelect={handleZipSelect}
                        placeholder={
                            selectedZip ? selectedZip.code : "Enter a ZIP"
                        }
                        labelKey="code"
                    />
                </Form.Group>

                <Form.Group className="mb-3" controlId="serviceProviderAddress">
                    <Form.Label>What is your company's address?</Form.Label>

                    <Form.Control
                        placeholder="Address"
                        onChange={(e) => setAddress(e.target.value)}
                    />
                </Form.Group>

                <Form.Group className="mb-3" controlId="serviceProviderRadius">
                    <Form.Label>
                        What is your radius of operation? (Miles)
                    </Form.Label>

                    <Form.Control
                        type="number"
                        max={1000}
                        min={0}
                        placeholder="Radius (Miles)"
                        onChange={(e) => {
                            setDistanceCovered(parseInt(e.target.value));
                        }}
                    />
                </Form.Group>

                <div className="d-grid">
                    {isLoading ? (
                        <Spinner />
                    ) : (
                        <Button
                            variant="primary"
                            size="lg"
                            className="submit-button"
                            onClick={handleSubmit}
                        >
                            Submit
                        </Button>
                    )}
                </div>

                {error && <ErrorMessageContainer message={error} />}
                {ModalContent}
            </Form>
        </div>
    );
}

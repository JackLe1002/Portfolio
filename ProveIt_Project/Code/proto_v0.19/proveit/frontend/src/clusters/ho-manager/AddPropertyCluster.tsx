import React, { useCallback, useEffect, useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { Link, useNavigate } from "react-router-dom";
import { useAuthContext } from "../../hooks/useAuthContext";
import { City, PropertyJSON, PropertyType, State, Zip } from "../../types";
import SearchableDropdown from "../../components/DropDownList";
import Modal from "react-bootstrap/Modal";
import "../../styles/pages/addProperty.css";

export function AddPropertyCluster() {
    const { state } = useAuthContext();
    const { user } = state;
    const navigate = useNavigate();

    const [states, setStates] = useState<State[]>([]);
    const [selectedState, setSelectedState] = useState<State | null>(null);

    const [citiesInState, setCitiesInState] = useState<City[]>([]);
    const [selectedCity, setSelectedCity] = useState<City | null>(null);

    const [zipsInCity, setZipsInCity] = useState<Zip[]>([]);
    const [selectedZip, setSelectedZip] = useState<Zip | null>(null);

    const [propertyTypes, setPropertyTypes] = useState<PropertyType[]>([]);
    const [selectedPropertyType, setSelectedPropertyType] =
        useState<PropertyType | null>(null);

    const [propertyName, setPropertyName] = useState<string>("");
    const [address, setAddress] = useState<string>("");
    const [rentAmount, setRentAmount] = useState<string>("");

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement>,
        setter: React.Dispatch<React.SetStateAction<string>>,
    ) => {
        e.preventDefault();
        setter(e.target.value);
    };

    const handleShowModal = () => setShowModal(true);
    const [showModal, setShowModal] = useState(false);

    const [showErrorModal, setShowErrorModal] = useState(false);
    const [errorModalMessage, setErrorModalMessage] = useState("");
    const handleShowErrorModal = (errorMessage: string) => {
        setErrorModalMessage(errorMessage);
        setShowErrorModal(true);
    };

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

        const url = window.config.SERVER_URL + "/propertytypes";
        fetchData(url)
            .then((data) => setPropertyTypes(data))
            .catch((error) => console.error("Error fetching data:", error));
    };

    const handlePropertyTypeSelect = (selectedPropertyType: PropertyType) => {
        setSelectedPropertyType(selectedPropertyType);
        sessionStorage.setItem(
            "addPropertySelectedType",
            JSON.stringify(selectedPropertyType),
        );
    };

    const handleSubmit = (e: React.MouseEvent) => {
        e.preventDefault();
        const createPropertyJSON: PropertyJSON = {
            countyId: selectedCity?.countyId,
            cityId: selectedCity?.cityId,
            stateId: selectedState!.id,
            zipcodeId: selectedZip?.zipId,
            userId: user?.id,
            propertyTypeId: selectedPropertyType!.propertyTypeId,
            ownerId: user?.id,
            name: propertyName,
            streetAddress: address,
            rent: rentAmount,
            isPrimary: true,
            canTenantInitiate: true,
            status: "active",
            registrationFee: 0,
        };

        //Post the property object to the server.
        fetch(window.config.SERVER_URL + "/addproperty", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + user?.token,
            },
            body: JSON.stringify(createPropertyJSON),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                return response.json();
            })
            .then((responseJson) => {
                if (responseJson.isSuccess) {
                    handleShowModal();
                } else if (!responseJson.isSuccess) {
                    handleShowErrorModal(responseJson.message);
                }
            })
            .catch((error) => console.error("Error updating data:", error));
    };

    // JSX for the modal
    const modalContentSuccess = (
        <Modal show={showModal} onHide={() => setShowModal(false)}>
            <Modal.Header closeButton>
                <Modal.Title>You've added a Property!</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>{`You've added "${address}" to your account.`}</p>
            </Modal.Body>
            <Modal.Footer>
                <Button
                    variant="secondary"
                    onClick={() => {
                        setShowModal(false);
                        navigate("/dashboard");
                    }}
                >
                    Return to dashboard
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
        <div className="main_addProperty">
            {/* Dropdown to select the US state */}
            <SearchableDropdown
                items={states}
                onSelect={handleStateSelect}
                placeholder={
                    selectedState ? selectedState.name : "Select a State"
                }
                labelKey="name"
            />

            {/*Dropdown to select city within the selected state*/}
            {selectedState && (
                <SearchableDropdown
                    items={citiesInState}
                    onSelect={handleCitySelect}
                    placeholder={
                        selectedCity ? selectedCity.name : "Select a City"
                    }
                    labelKey="name"
                />
            )}

            {/*Dropdown to select the ZIP code*/}
            {selectedCity && (
                <SearchableDropdown
                    items={zipsInCity}
                    onSelect={handleZipSelect}
                    placeholder={selectedZip ? selectedZip.code : "Enter a ZIP"}
                    labelKey="code"
                />
            )}

            {/*Dropdown to select the property type*/}
            {selectedZip && (
                <SearchableDropdown
                    items={propertyTypes}
                    onSelect={handlePropertyTypeSelect}
                    placeholder={
                        selectedPropertyType
                            ? selectedPropertyType.name
                            : "Select a Property Type"
                    }
                    labelKey="name"
                />
            )}

            <div className="forms">
                <Form>
                    <Form.Group controlId="propertyName">
                        <Form.Label>Property Name</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter property name"
                            value={propertyName}
                            onChange={(
                                e: React.ChangeEvent<HTMLInputElement>,
                            ) => handleInputChange(e, setPropertyName)}
                        />
                    </Form.Group>

                    <Form.Group controlId="address">
                        <Form.Label>Address</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter address"
                            value={address}
                            onChange={(
                                e: React.ChangeEvent<HTMLInputElement>,
                            ) => handleInputChange(e, setAddress)}
                        />
                    </Form.Group>

                    <Form.Group controlId="rentAmount">
                        <Form.Label>Rent Amount</Form.Label>
                        <Form.Control
                            type="number"
                            placeholder="Enter rent amount"
                            value={rentAmount}
                            onChange={(
                                e: React.ChangeEvent<HTMLInputElement>,
                            ) => handleInputChange(e, setRentAmount)}
                        />
                    </Form.Group>

                    <Button
                        variant="primary"
                        type="submit"
                        className="submit-button"
                        onClick={(e: React.MouseEvent) => handleSubmit(e)}
                    >
                        Submit
                    </Button>
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
            </div>
            {errorModalContent}
            {modalContentSuccess}
        </div>
    );
}

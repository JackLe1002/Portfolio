import { Button, Form } from "react-bootstrap";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useState, useEffect, useCallback } from "react";
import {
    GeneralServiceType,
    Property,
    SpecificServiceType,
    Timeline,
    ServiceProvider,
} from "../../types";
import SearchableDropdown from "../../components/DropDownList";
import ErrorMessageContainer from "../../components/ErrorMessageContainer";
import Spinner from "../../components/Spinner";
import { useNavigate } from "react-router-dom";
import Modal from "react-bootstrap/Modal";

import "../../styles/components/createServiceRequest.css";

export function RequestHOServiceCluster() {
    const user = useAuthContext().state.user;
    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const [properties, setProperties] = useState<Property[]>([]);
    const [property, setProperty] = useState<Property | null>(null);

    const [generalServiceTypes, setGeneralServiceTypes] = useState<
        GeneralServiceType[]
    >([]);
    const [selectedGenType, setSelectedGenType] =
        useState<GeneralServiceType | null>(null);

    const [specificServices, setSpecificServices] = useState<
        SpecificServiceType[]
    >([]);
    const [selectedSpecService, setSelectedSpecService] =
        useState<SpecificServiceType | null>(null);

    const [timelines, setTimelines] = useState<Timeline[]>([]);
    const [selectedTimeline, setSelectedTimeline] = useState<Timeline | null>(
        null,
    );

    const [serviceProviders, setServiceProviders] = useState<ServiceProvider[]>(
        [],
    );
    const [selectedSP, setSelectedSP] = useState<ServiceProvider | null>(null);

    const [issueDetail, setIssueDetail] = useState<string>("");

    const [showMessageModal, setShowMessageModal] = useState(false);
    const [modalMessage, setModalMessage] = useState("");
    const handleShowMessageModal = (message: string) => {
        setModalMessage(message);
        setShowMessageModal(true);
    };

    const OWNER_PROPERTY_LINK = window.config.SERVER_URL + "/properties-owner";
    const GENERAL_SERVICE_TYPE_LINK =
        window.config.SERVER_URL + "/general-service-types";
    const SPECIFIC_SERVICES_LINK =
        window.config.SERVER_URL + "/specific-service-types";
    const TIMELINES_LINK = window.config.SERVER_URL + "/request-timelines";
    const PROVIDERS_LINK = window.config.SERVER_URL + "/find-sp";

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
        fetchData(OWNER_PROPERTY_LINK).then((response) => {
            if (!response.error) {
                setProperties(response);
            } else {
                setError("ERROR GETTING PROPERTY");
            }
        });

        fetchData(GENERAL_SERVICE_TYPE_LINK).then((response) => {
            if (response.isSuccess) {
                setGeneralServiceTypes(response.data);
            } else {
                setError(response.message);
            }
        });

        fetchData(TIMELINES_LINK).then((response) => {
            if (response.isSuccess) {
                setTimelines(response.data);
            } else {
                setError(response.message);
            }
        });
    }, [
        fetchData,
        GENERAL_SERVICE_TYPE_LINK,
        OWNER_PROPERTY_LINK,
        TIMELINES_LINK,
        user?.id,
    ]);

    const handlePropertySelect = (selectedProperty: Property) => {
        setProperty(selectedProperty);
    };
    const handleGeneralTypeSelect = (
        selectedGeneralType: GeneralServiceType,
    ) => {
        setSelectedGenType(selectedGeneralType);
        setSelectedSpecService(null);

        const params = new URLSearchParams({
            parentId: selectedGeneralType.id,
        });
        fetchData(SPECIFIC_SERVICES_LINK + "?" + params.toString())
            .then((response) => {
                if (response.isSuccess) {
                    setSpecificServices(response.data);
                } else {
                    setError(response.message);
                }
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
                setError(error.error);
            });
    };

    const handleSpecServiceSelect = (
        selectedSpecService: SpecificServiceType,
    ) => {
        setSelectedSpecService(selectedSpecService);
        // TODO: Change to fetchData
        if (serviceProviders.length == 0) {
            console.log(selectedSpecService, " ", property);
            fetch(PROVIDERS_LINK, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + user?.token,
                },

                body: JSON.stringify({
                    childId: selectedSpecService.id,
                    propertyId: property?.id,
                }),
            })
                .then((response) => {
                    if (!response.ok) {
                        setError("Error: Network response was not ok");
                    }
                    return response.json();
                })
                .then((responseJson) => {
                    if (responseJson.isSuccess) {
                        console.log(responseJson.data);
                        setServiceProviders(responseJson.data);
                    } else {
                        setError("Error: " + responseJson.message);
                    }
                });
        }
    };

    const handleServiceProviderSelect = (selectedProvider: ServiceProvider) => {
        setSelectedSP(selectedProvider);
    };
    const handleTimelineSelect = (selectedTimeline: Timeline) => {
        setSelectedTimeline(selectedTimeline);
    };

    const handleSubmit = () => {
        setIsLoading(true);
        setError(null);
        console.log("Handling submit...");

        const createRequestBody = {
            propertyId: property?.id,
            timelineId: selectedTimeline?.id,
            serviceTypeId: selectedSpecService?.id,
            managerId: user?.id,
            detail: issueDetail,
            serviceRequestId: "",
            proposals: [
                {
                    serviceProviderId: selectedSP?.id,
                    serviceTypeId: selectedSpecService?.id,
                    timelineId: selectedTimeline?.id,
                },
            ],
        };

        // TODO: Change to fetchData

        fetch(window.config.SERVER_URL + "/ho-service-request", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + user?.token,
            },
            body: JSON.stringify(createRequestBody),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                return response.json();
            })
            .then((responseJson) => {
                setIsLoading(false);
                if (responseJson.isSuccess) {
                    handleShowMessageModal("Request successfully created");
                } else {
                    setError(responseJson.message);
                }
            })
            .catch((error) => setError(error));
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
        <div id="request-form-container">
            <Form className="create-request">
                <Form.Group>
                    <SearchableDropdown
                        items={properties}
                        onSelect={handlePropertySelect}
                        placeholder={
                            property ? property.name : "Select a property"
                        }
                        labelKey="name"
                    />
                    <Form.Label className="mb-2">
                        What type of service is needed?
                    </Form.Label>

                    <SearchableDropdown
                        items={generalServiceTypes}
                        onSelect={handleGeneralTypeSelect}
                        placeholder={
                            selectedGenType
                                ? selectedGenType.serviceType
                                : "Select a Service Type"
                        }
                        labelKey="serviceType"
                    />
                </Form.Group>

                <Form.Group>
                    <Form.Label>
                        Which subcategory best describes the required service?
                    </Form.Label>

                    <SearchableDropdown
                        items={specificServices}
                        onSelect={handleSpecServiceSelect}
                        placeholder={
                            selectedSpecService
                                ? selectedSpecService.serviceType
                                : "Select a Service"
                        }
                        labelKey="serviceType"
                    />
                </Form.Group>

                <Form.Group>
                    <Form.Label>When should the work be done?</Form.Label>

                    <SearchableDropdown
                        items={timelines}
                        onSelect={handleTimelineSelect}
                        placeholder={
                            selectedTimeline
                                ? selectedTimeline.title
                                : "Select a Timeline"
                        }
                        labelKey="title"
                    />
                </Form.Group>

                <Form.Group>
                    <Form.Label>Choose a service provider</Form.Label>

                    <SearchableDropdown
                        items={serviceProviders}
                        onSelect={handleServiceProviderSelect}
                        placeholder={
                            selectedSP
                                ? selectedSP.firstName
                                : "Select a Service Provider"
                        }
                        labelKey="firstName"
                    />
                </Form.Group>

                <Form.Group className="mb-5">
                    <Form.Label>
                        Describe the issue that needs to be addressed:
                    </Form.Label>

                    <Form.Control
                        as="textarea"
                        rows={3}
                        onChange={(e) => {
                            setIssueDetail(e.target.value);
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
            </Form>

            {error && <ErrorMessageContainer message={error} />}
            {ModalContent}
        </div>
    );
}

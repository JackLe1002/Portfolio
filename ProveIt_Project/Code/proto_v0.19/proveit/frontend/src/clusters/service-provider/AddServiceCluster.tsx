import { useCallback, useEffect, useState } from "react";
import "../../styles/components/addService.css";
import {
    GeneralServiceType,
    ServiceOffering,
    SpecificServiceType,
    Timeline,
} from "../../types";
import { useAuthContext } from "../../hooks/useAuthContext";
import { Button, Form } from "react-bootstrap";
import SearchableDropdown from "../../components/DropDownList";
import ErrorMessageContainer from "../../components/ErrorMessageContainer";
import { useNavigate } from "react-router-dom";
import Spinner from "../../components/Spinner";
import Modal from "react-bootstrap/Modal";

export function AddServiceCluster() {
    const [generalServiceTypes, setGeneralServiceTypes] = useState<
        GeneralServiceType[]
    >([]);
    const [selectedGenType, setSelectedGenType] =
        useState<GeneralServiceType | null>(null);

    const [specificServices, setSpecificServices] = useState<
        SpecificServiceType[]
    >([]);
    const [timelines, setTimelines] = useState<Timeline[]>([]);

    const [serviceOfferings, setServiceOfferings] = useState<ServiceOffering[]>(
        [],
    );

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const GENERAL_SERVICE_TYPE_LINK =
        window.config.SERVER_URL + "/general-service-types";
    const SPECIFIC_SERVICES_LINK =
        window.config.SERVER_URL + "/specific-service-types";
    const TIMELINES_LINK = window.config.SERVER_URL + "/request-timelines";
    const ADD_SERVICE_LINK = window.config.SERVER_URL + "/service";

    const [showMessageModal, setShowMessageModal] = useState(false);
    const [modalMessage, setModalMessage] = useState("");
    const handleShowMessageModal = (message: string) => {
        setModalMessage(message);
        setShowMessageModal(true);
    };

    const user = useAuthContext().state.user;
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
                setError("An error occured");
                throw error;
            }
        },
        [user],
    );

    useEffect(() => {
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
    }, [fetchData, GENERAL_SERVICE_TYPE_LINK, TIMELINES_LINK]);

    const handleGeneralTypeSelect = (
        selectedGeneralType: GeneralServiceType,
    ) => {
        setSelectedGenType(selectedGeneralType);
        setServiceOfferings([]);

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
        offeringIndex: number,
    ) => {
        const nextServiceOfferings = [...serviceOfferings];

        nextServiceOfferings[offeringIndex].service = selectedSpecService;

        setServiceOfferings(nextServiceOfferings);
    };

    const handleTimelineSelect = (
        selectedTimeline: Timeline,
        offeringIndex: number,
    ) => {
        const nextServiceOfferings = [...serviceOfferings];

        nextServiceOfferings[offeringIndex].timeline = selectedTimeline;

        setServiceOfferings(nextServiceOfferings);
    };

    const addNewOffering = () => {
        const newService: ServiceOffering = {
            service: undefined,
            timeline: undefined,
            detail: undefined,
        };

        setServiceOfferings((serviceOfferings) => [
            ...serviceOfferings,
            newService,
        ]);
    };

    const handleSubmit = () => {
        setIsLoading(true);

        const servicesArray = serviceOfferings.map((serviceOffering) => {
            return {
                serviceTypeId: serviceOffering.service?.id,
                timelineId: serviceOffering.timeline?.id,
                detail: "Service offering",
            };
        });

        const addServiceBody = {
            parentId: selectedGenType?.id,
            services: servicesArray,
        };

        const headers = new Headers();
        headers.append("Content-Type", "application/json");

        if (user) {
            headers.append("Authorization", `Bearer ${user.token}`);
        }

        fetch(ADD_SERVICE_LINK, {
            method: "POST",
            headers: headers,
            body: JSON.stringify(addServiceBody),
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
                        responseJson.message ?? "Successfully added service",
                    );
                    navigate("/dashboard");
                } else {
                    setError(responseJson.message ?? "An error occured");
                }
            });
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
        <div id="service-form-container">
            <Form className="add-service mb-4">
                <Form.Group>
                    <Form.Label className="mb-2">
                        What category of service would you like to offer?
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

                <hr />

                {serviceOfferings.map((offering, index) => (
                    <Form.Group>
                        <Form.Label>Service {index + 1}</Form.Label>

                        <SearchableDropdown
                            items={specificServices}
                            onSelect={(specService): void => {
                                handleSpecServiceSelect(specService, index);
                            }}
                            placeholder={
                                offering.service
                                    ? offering.service.serviceType
                                    : "Select a service"
                            }
                            labelKey="serviceType"
                        />

                        <SearchableDropdown
                            items={timelines}
                            onSelect={(timeline): void => {
                                handleTimelineSelect(timeline, index);
                            }}
                            placeholder={
                                offering.timeline
                                    ? offering.timeline.title
                                    : "Select a typlical timeline"
                            }
                            labelKey="title"
                        />

                        <hr />
                    </Form.Group>
                ))}

                <Button
                    className="add-service mb-5 "
                    disabled={selectedGenType ? false : true}
                    onClick={() => {
                        addNewOffering();
                    }}
                >
                    Add a service +
                </Button>

                {isLoading ? (
                    <Spinner />
                ) : (
                    <Button
                        className="submit-button"
                        disabled={serviceOfferings.length > 0 ? false : true}
                        onClick={handleSubmit}
                    >
                        Submit
                    </Button>
                )}
            </Form>

            {error && <ErrorMessageContainer message={error} />}
            {ModalContent}
        </div>
    );
}

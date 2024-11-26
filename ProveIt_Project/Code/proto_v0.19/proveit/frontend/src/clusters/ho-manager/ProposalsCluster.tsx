import { useCallback, useEffect, useState } from "react";
import { useAuthContext } from "../../hooks/useAuthContext";
import { RequestDetails, Proposal } from "../../types";
import { useSearchParams } from "react-router-dom";
import ErrorMessageContainer from "../../components/ErrorMessageContainer";
import { ServiceRequestCard } from "../../components/ServiceRequestCard";
import Spinner from "../../components/Spinner";
import { ServiceProposalCard } from "../../components/ServiceProposalCard";
import { useNavigate } from "react-router-dom";
import { Col, Row, Button } from "react-bootstrap";
import Modal from "react-bootstrap/Modal";

export function ProposalsCluster() {
    const user = useAuthContext().state.user;
    const navigate = useNavigate();

    const [searchParams] = useSearchParams();

    const [requestDetails, setRequestDetails] = useState<
        RequestDetails | undefined
    >(undefined);
    const [proposals, setProposals] = useState<Proposal[]>([]);

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const [showMessageModal, setShowMessageModal] = useState(false);
    const [modalMessage, setModalMessage] = useState("");
    const handleShowMessageModal = (message: string) => {
        setModalMessage(message);
        setShowMessageModal(true);
    };

    const REQUEST_DETAILS_LINK = window.config.SERVER_URL + "/request-details";
    const APPROVE_PROPOSAL_LINK =
        window.config.SERVER_URL + "/approve-proposal";
    const REJECT_PROPOSAL_LINK = window.config.SERVER_URL + "/reject-proposal";

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
        fetchData(
            REQUEST_DETAILS_LINK + "?id=" + searchParams.get("requestId"),
        ).then((response) => {
            console.log(response);
            if (response.isSuccess) {
                setRequestDetails(response.data);
                setProposals(response.data.proposals.filter(checkSubmitted));
            } else {
                setError(response.message ?? "Error fetching request details");
            }
        });
    }, [user, REQUEST_DETAILS_LINK, fetchData, searchParams]);

    function checkSubmitted(proposal: Proposal) {
        return proposal.status == "submitted";
    }

    async function handleApproveProposal(proposal: Proposal) {
        setError(null);
        setIsLoading(true);

        fetch(APPROVE_PROPOSAL_LINK + "?id=" + proposal.id, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + user?.token,
            },
        })
            .then((response) => {
                setIsLoading(false);
                if (!response.ok) {
                    setError("Error: Network resposne was not ok");
                }
                return response.json();
            })
            .then((responseJson) => {
                if (responseJson.isSuccess) {
                    handleShowMessageModal(responseJson.message);
                } else {
                    setError(responseJson.message);
                }
            })
            .catch((error) => {
                setError("Error approving proposal: " + error);
            });
    }

    async function handleRejectProposal(proposal: Proposal) {
        setError(null);
        setIsLoading(true);
        console.log("Rejecting proposal: " + proposal.id);

        fetch(REJECT_PROPOSAL_LINK + "?id=" + proposal.id, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + user?.token,
            },
        })
            .then((response) => {
                setIsLoading(false);
                if (!response.ok) {
                    setError("Error: Network resposne was not ok");
                }
                return response.json();
            })
            .then((responseJson) => {
                if (responseJson.isSuccess) {
                    console.log(responseJson.message);
                    fetchData(
                        REQUEST_DETAILS_LINK +
                            "?id=" +
                            searchParams.get("requestId"),
                    ).then((response) => {
                        console.log(response);
                        if (response.isSuccess) {
                            setRequestDetails(response.data);
                            setProposals(
                                response.data.proposals.filter(checkSubmitted),
                            );
                        } else {
                            setError(
                                response.message ??
                                    "Error fetching request details",
                            );
                        }
                    });
                } else {
                    setError(responseJson.message);
                }
            })
            .catch((error) => {
                setError("Error approving proposal: " + error);
            });
    }

    const ModalContent = (
        <Modal
            show={showMessageModal}
            onHide={() => setShowMessageModal(false)}
        >
            <Modal.Header closeButton>
                <Modal.Title>Notice</Modal.Title>
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
        <>
            {error && <ErrorMessageContainer message={error} />}

            <div className="mb-5">
                {requestDetails ? (
                    <ServiceRequestCard requestDetails={requestDetails} />
                ) : (
                    <>
                        <Spinner />
                        <p>Loading service request...</p>
                    </>
                )}
            </div>

            <h2>Proposals</h2>
            <div className="mb-5">
                {isLoading ? (
                    <>
                        <Spinner />
                        <p>Approving request proposal...</p>
                    </>
                ) : (
                    <Row>
                        {proposals.length > 0 ? (
                            proposals.map((proposal) => (
                                <Col>
                                    <ServiceProposalCard
                                        proposal={proposal}
                                        approveHandler={handleApproveProposal}
                                        rejectHandler={handleRejectProposal}
                                    />
                                </Col>
                            ))
                        ) : (
                            <p>
                                No proposals found for the given service
                                request!
                            </p>
                        )}
                    </Row>
                )}

                {ModalContent}
            </div>
        </>
    );
}

import { Button, Col, Row } from "react-bootstrap";
import { Job } from "../types";
import Spinner from "./Spinner";
import Modal from "react-bootstrap/Modal";
import { useState } from "react";

interface SPJobTableProps {
    jobs: Job[];
    activateJob: (jobId: string) => void;
    completeJob: (jobId: string) => void;
    isLoading: boolean;
}

export function SPJobTable(props: SPJobTableProps) {
    const [showJobDetail, setShowJobDetail] = useState<boolean>(false);
    const [jobDetail, setJobDetail] = useState<Job | undefined>(undefined);

    const handleJobDetailClick = (id: string) => {
        const job: Job | undefined = props.jobs?.filter((obj) => {
            return obj.id === id;
        })[0];
        console.log("JOB");
        console.log(job);
        setJobDetail(job);
        setShowJobDetail(true);
    };

    const handleCloseJobDetail = () => {
        setJobDetail(undefined);
        setShowJobDetail(false);
    };

    return (
        <div className="request-container mb-5">
            {props.isLoading && <Spinner />}

            <table className="dashboard-table">
                <thead className="dashboard-header">
                    <tr>
                        <th>Client</th>
                        <th>Service</th>
                        <th>Address</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {props.jobs.length > 0 ? (
                        props.jobs.map((job) => (
                            <tr>
                                <td>
                                    {job.initiator.firstName +
                                        " " +
                                        job.initiator.lastName}
                                </td>

                                <td>{job.serviceType.serviceType}</td>

                                <td>{job.property.streetAddress}</td>

                                <td>
                                    <Row s={1} md={2}>
                                        <Col>
                                            <Button
                                                className="standard-button mb-1"
                                                style={{ width: "100%" }}
                                                disabled={props.isLoading}
                                                onClick={() => {
                                                    handleJobDetailClick(
                                                        job.id,
                                                    );
                                                }}
                                            >
                                                Details
                                            </Button>
                                        </Col>

                                        <Col>
                                            {job.activityStatus ==
                                                "pending" && (
                                                <Button
                                                    className="standard-button mb-1"
                                                    style={{ width: "100%" }}
                                                    onClick={() => {
                                                        props.activateJob(
                                                            job.id,
                                                        );
                                                    }}
                                                    disabled={props.isLoading}
                                                >
                                                    Start Job
                                                </Button>
                                            )}

                                            {job.activityStatus ==
                                                "started" && (
                                                <Button
                                                    className="standard-button mb-1"
                                                    style={{ width: "100%" }}
                                                    onClick={() => {
                                                        props.completeJob(
                                                            job.id,
                                                        );
                                                    }}
                                                    disabled={props.isLoading}
                                                >
                                                    Complete Job
                                                </Button>
                                            )}
                                        </Col>
                                    </Row>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={4}>
                                You're not working on any service Request!
                                Accept one to get started.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>

            {/* Show more detail about job popup */}
            <Modal show={showJobDetail} onHide={handleCloseJobDetail}>
                <Modal.Header closeButton>
                    <Modal.Title>Job Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <table className="property-detail-table">
                        <tbody>
                            {jobDetail != null ? (
                                <>
                                    <tr>
                                        <td>Activity Status: </td>
                                        <td>‎ </td>
                                        <td>{jobDetail.activityStatus}</td>
                                    </tr>
                                    <tr>
                                        <td>Service Request: </td>
                                        <td>‎ </td>
                                        <td>
                                            {jobDetail.serviceType.serviceType}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Description: </td>
                                        <td>‎ </td>
                                        <td>{jobDetail.proposal.detail}</td>
                                    </tr>
                                    <tr>
                                        <td>Address: </td>
                                        <td>‎ </td>
                                        <td>
                                            {jobDetail.property.streetAddress}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Request Date: </td>
                                        <td>‎ </td>
                                        <td>{`$${jobDetail.proposal.quotePrice} (${jobDetail.proposal.quoteType})`}</td>
                                    </tr>
                                    <tr>
                                        <td>Request Timeline: </td>
                                        <td>‎ </td>
                                        <td>{jobDetail.timeline.title}</td>
                                    </tr>
                                </>
                            ) : (
                                <tr>
                                    <td colSpan={2}>No details available.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </Modal.Body>
                <Modal.Footer>
                    <button
                        className="delete-button"
                        onClick={handleCloseJobDetail}
                    >
                        Close
                    </button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

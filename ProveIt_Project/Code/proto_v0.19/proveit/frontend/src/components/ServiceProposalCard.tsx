import { Button, Card } from "react-bootstrap";
import { Proposal } from "../types";

interface ServiceProposalCardProps {
    proposal: Proposal;
    approveHandler: (proposal: Proposal) => void;
    rejectHandler: (proposal: Proposal) => void;
}

export function ServiceProposalCard(props: ServiceProposalCardProps) {
    return (
        <Card style={{ width: "18rem" }}>
            <Card.Body>
                <Card.Title>
                    {props.proposal.serviceProvider.firstName +
                        " " +
                        props.proposal.serviceProvider.lastName}
                </Card.Title>
                <Card.Subtitle>
                    {props.proposal.serviceProvider.spDetail.company}
                </Card.Subtitle>

                <hr className="mb-3" />

                <Card.Text>
                    Quoted Price: ${props.proposal.quotePrice}
                </Card.Text>
                <Card.Text>
                    Estimated Hours: {props.proposal.estimatedHours}
                </Card.Text>
                <Card.Text>Start Date: {props.proposal.startDate}</Card.Text>
                <Card.Text>End Date: {props.proposal.endDate}</Card.Text>
                {props.proposal.detail && (
                    <Card.Text>Detail: {props.proposal.detail}</Card.Text>
                )}

                <div className="d-grid">
                    <Button
                        onClick={() => {
                            props.approveHandler(props.proposal);
                        }}
                        className="standard-button"
                    >
                        Approve
                    </Button>
                </div>
                <div className="d-grid" style={{ marginTop: "1rem" }}>
                    <Button
                        onClick={() => {
                            props.rejectHandler(props.proposal);
                        }}
                        className="standard-button"
                    >
                        Reject
                    </Button>
                </div>
            </Card.Body>
        </Card>
    );
}

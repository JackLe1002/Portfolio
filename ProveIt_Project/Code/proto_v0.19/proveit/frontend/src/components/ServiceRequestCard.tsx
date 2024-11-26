import { Button, Card } from "react-bootstrap";
import { RequestDetails } from "../types";

interface ServiceRequestCardProps {
    requestDetails: RequestDetails;
}

export function ServiceRequestCard(props: ServiceRequestCardProps) {
    return (
        <Card style={{ width: "18rem" }}>
            <Card.Body>
                <Card.Title>
                    {props.requestDetails.serviceType.serviceType}
                </Card.Title>
                <Card.Subtitle>
                    {props.requestDetails.property.streetAddress}
                </Card.Subtitle>
                <hr className="mb-3" />

                <Card.Text>
                    Request Date: {props.requestDetails.createdAt}
                </Card.Text>
                <Card.Text>
                    Requested Timeline: {props.requestDetails.timeline.title}
                </Card.Text>
                <Card.Text>Detail: {props.requestDetails.detail}</Card.Text>

                <div className="d-grid">
                    <Button className="standard-button">View Details</Button>
                </div>
            </Card.Body>
        </Card>
    );
}

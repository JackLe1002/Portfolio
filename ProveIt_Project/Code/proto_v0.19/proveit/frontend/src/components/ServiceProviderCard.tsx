import { Button, Card } from "react-bootstrap";
import { ServiceProvider } from "../types";
import Spinner from "./Spinner";

interface SPCardProps {
    sp: ServiceProvider;
    buttonHandler: (sp: ServiceProvider) => void;
    isLoading: boolean;
}

export function ServiceProviderCard(props: SPCardProps) {
    console.log(props.sp);
    return (
        <Card style={{ width: "18rem" }}>
            <Card.Body>
                <Card.Title>
                    {props.sp.firstName + " " + props.sp.lastName}
                </Card.Title>
                <Card.Subtitle>{props.sp.spDetail?.company}</Card.Subtitle>
                <hr className="mb-3" />
                {props.sp.spDetail.isPublic ? (
                    <Card.Subtitle>{"PUBLIC"}</Card.Subtitle>
                ) : (
                    <Card.Subtitle>{"PRIVATE"}</Card.Subtitle>
                )}
                <Card.Text>
                    {"Standard Rate: $" +
                        props.sp.spDetail?.perHourRate +
                        "/hr"}
                </Card.Text>
                <Card.Text>
                    Typical timeline for service: As soon as possible
                </Card.Text>
                <Card.Text>
                    {"Address: " + props.sp.spDetail?.address}
                </Card.Text>
                <Card.Text>
                    {"Radius of Operation: " +
                        props.sp.spDetail?.distanceCovered +
                        " miles"}
                </Card.Text>

                {props.isLoading ? (
                    <>
                        <Spinner />
                        <p>Submitting service request...</p>
                    </>
                ) : (
                    <div className="d-grid">
                        <Button
                            onClick={() => {
                                props.buttonHandler(props.sp);
                            }}
                            className="standard-button"
                        >
                            Request Quote
                        </Button>
                    </div>
                )}
            </Card.Body>
        </Card>
    );
}

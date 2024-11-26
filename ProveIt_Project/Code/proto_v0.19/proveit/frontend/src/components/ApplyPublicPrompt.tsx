import { Button } from "react-bootstrap";
import { useNavigate } from "react-router";
import Spinner from "./Spinner";
import ErrorMessageContainer from "./ErrorMessageContainer";

interface ApplyPublicPromptProps {
    isAppliedForPublic: boolean;
    isPublic: boolean;
    isLoading: boolean;
    error: string | null;
    checkStatus: () => void;
}

export function ApplyPublicPrompt(props: ApplyPublicPromptProps) {
    const navigate = useNavigate();

    if (props.isPublic) {
        return (
            <div className="apply-public mb-5">
                <h2>Public Service Provider</h2>

                <p>You are verified as a public service provider.</p>

                <p>
                    You have passed the background check and are now verified
                    with public service provider status. You will now be able to
                    recieve service requests from all users of the HomeTrumpeter
                    system.
                </p>
            </div>
        );
    }

    if (props.isAppliedForPublic) {
        return (
            <div className="apply-public mb-5">
                <h2>Public Service Provider</h2>

                <p>You have applied for public service provider status.</p>

                <p>
                    Check your email and fill out the background check request
                    from certn. Once your background check has been processend
                    and approved, you will be granted public status.
                </p>

                {props.isLoading ? (
                    <Spinner />
                ) : (
                    <Button
                        className="standard-button"
                        onClick={props.checkStatus}
                    >
                        Check application status
                    </Button>
                )}

                {props.error && <ErrorMessageContainer message={props.error} />}
            </div>
        );
    }

    return (
        <div className="apply-public mb-5">
            <h2>Public Service Provider</h2>

            <p>You have not applied for public service provider status.</p>
            <p>
                Public service providers can advertise their services to all
                homeowners and property managers on HomeTrumpeter. Expand your
                business reach with public status!
            </p>

            <Button
                className="standard-button"
                onClick={() => {
                    navigate("/apply-public");
                }}
            >
                Apply now!
            </Button>
        </div>
    );
}

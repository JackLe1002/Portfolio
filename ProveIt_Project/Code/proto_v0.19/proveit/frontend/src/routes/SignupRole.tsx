import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

export function SignupRole() {
    const navigate = useNavigate();

    return (
        <div className="select-role-container">
            <img
                src="https://hometrumpeter.com/wp-content/uploads/2023/03/logo.svg"
                className="main-logo"
            />
            <div className="info-message">
                Welcome to HomeTrumpeter! What category best describes you?
            </div>

            <div className="button-options-container">
                <div className="button-option-group">
                    <Button
                        className="standard-button"
                        onClick={() => navigate("/signup/owner")}
                    >
                        Homeowner / Manager
                    </Button>
                    <div className="option-description">
                        I own my own home or manage properties for others
                    </div>
                </div>

                <div className="button-option-group">
                    <Button
                        className="standard-button"
                        onClick={() => navigate("/signup/invited")}
                    >
                        Tenant / Service Provider
                    </Button>
                    <div className="option-description">
                        I have been invited to HomeTrumpeter by a Homeowner or
                        Property Manager
                    </div>
                </div>
            </div>
        </div>
    );
}

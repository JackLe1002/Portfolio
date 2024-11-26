import { AgreementSubmitCluster } from "../clusters/ho-manager/AgreementSubmitCluster";
import "../styles/pages/addProperty.css";
import { useNavigate } from "react-router-dom";

export function SubmitAgreement() {
    const navigate = useNavigate();
    return (
        <div className="login-container">
            <img
                src="https://hometrumpeter.com/wp-content/uploads/2023/03/logo.svg"
                className="main-logo"
                onClick={() => navigate("/dashboard")}
            />
            <AgreementSubmitCluster />
        </div>
    );
}

import htLogo from "../assets/ht-logo.svg";
import { RequestServiceCluster } from "../clusters/tenant/RequestServiceCluster";
import { useNavigate } from "react-router-dom";

export function RequestService() {
    const navigate = useNavigate();
    return (
        <div className="login-container">
            <img
                src={htLogo}
                className="main-logo"
                onClick={() => navigate("/dashboard")}
            />

            <h1>Request a Service</h1>

            <RequestServiceCluster />
        </div>
    );
}

import htLogo from "../assets/ht-logo.svg";
import { ProposalsCluster } from "../clusters/ho-manager/ProposalsCluster";
import { useNavigate } from "react-router-dom";

export function Proposals() {
    const navigate = useNavigate();
    return (
        <div className="login-container">
            <img
                src={htLogo}
                className="main-logo"
                onClick={() => navigate("/dashboard")}
            />

            <h1>Service Proposals</h1>

            <p>
                Review, Reject, or approve proposals for the following service
                request:
            </p>

            <ProposalsCluster />
        </div>
    );
}

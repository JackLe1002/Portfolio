import htLogo from "../assets/ht-logo.svg";
import { RequestQuoteCluster } from "../clusters/ho-manager/RequestQuoteCluster";
import { useNavigate } from "react-router-dom";

export function RequestQuote() {
    const navigate = useNavigate();
    return (
        <div className="login-container">
            <img
                src={htLogo}
                className="main-logo"
                onClick={() => navigate("/dashboard")}
            />

            <h1>Request a Quote</h1>

            <p>
                Request a quote from a public or private service provider for
                the following service request:
            </p>

            <RequestQuoteCluster />
        </div>
    );
}

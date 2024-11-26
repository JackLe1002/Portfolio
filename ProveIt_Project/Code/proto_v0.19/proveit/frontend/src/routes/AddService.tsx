import htLogo from "../assets/ht-logo.svg";
import { AddServiceCluster } from "../clusters/service-provider/AddServiceCluster";
import { useNavigate } from "react-router-dom";

export function AddService() {
    const navigate = useNavigate();
    return (
        <div className="login-container">
            <img
                src={htLogo}
                className="main-logo"
                onClick={() => navigate("/dashboard")}
            />

            <h1>Add a Service</h1>

            <p>Fill out the information below to add a new service offering</p>

            <p>
                For each service, indicate the typical timeline to complete the
                service.
            </p>

            <AddServiceCluster />
        </div>
    );
}

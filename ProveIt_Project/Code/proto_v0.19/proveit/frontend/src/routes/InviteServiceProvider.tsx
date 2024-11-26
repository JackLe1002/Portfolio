import InviteUserCluster from "../clusters/ho-manager/InviteUserCluster";
import "../styles/pages/addProperty.css";
import { useNavigate } from "react-router-dom";

export function InviteServiceProvider() {
    const navigate = useNavigate();
    return (
        <div className="login-container">
            <img
                src="https://hometrumpeter.com/wp-content/uploads/2023/03/logo.svg"
                className="main-logo"
                onClick={() => navigate("/dashboard")}
            />

            <h1>Invite a Service Provider</h1>

            <InviteUserCluster roleName="service_provider" />
        </div>
    );
}

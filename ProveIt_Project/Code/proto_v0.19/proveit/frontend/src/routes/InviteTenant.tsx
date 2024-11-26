import InviteUserCluster from "../clusters/ho-manager/InviteUserCluster";
import "../styles/pages/addProperty.css";
import { useNavigate } from "react-router-dom";

export function InviteTenant() {
    const navigate = useNavigate();
    return (
        <div className="login-container">
            <img
                src="https://hometrumpeter.com/wp-content/uploads/2023/03/logo.svg"
                className="main-logo"
                onClick={() => navigate("/dashboard")}
            />

            <h1>Invite a Tenant</h1>

            <InviteUserCluster roleName="tenant" />
        </div>
    );
}

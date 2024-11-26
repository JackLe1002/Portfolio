import { AddPropertyCluster } from "../clusters/ho-manager/AddPropertyCluster";
import "../styles/pages/addProperty.css";
import { useNavigate } from "react-router-dom";

export function AddProperty() {
    const navigate = useNavigate();
    return (
        <div className="login-container">
            <img
                src="https://hometrumpeter.com/wp-content/uploads/2023/03/logo.svg"
                className="main-logo"
                onClick={() => navigate("/dashboard")}
            />

            <h1>Add a Property</h1>

            <p>
                Please complete all the following prompts to add a property to
                your account.
            </p>
            <p>Ensure all information is entered correctly.</p>

            <AddPropertyCluster />
        </div>
    );
}

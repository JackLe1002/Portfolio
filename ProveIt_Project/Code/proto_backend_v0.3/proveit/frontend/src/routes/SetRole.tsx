import { useSetRole } from "../hooks/useSetRole";
import Button from "react-bootstrap/Button";

export function SetRole() {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { setRole, isLoading, error } = useSetRole();

    const handleOptionClick = async (roleSelection: string) => {
        await setRole(roleSelection);
        if (error) {
            alert(error);
        }
    };

    return (
        <div className="select-role-container">
            <img
                src="https://hometrumpeter.com/wp-content/uploads/2023/03/logo.svg"
                className="main-logo"
            />
            <div className="info-message">
                Welcome to HomeTrumpeter! What is your role in property
                management?
            </div>
            <div className="button-options-container">
                <div className="button-option-group">
                    <Button
                        className="standard-button"
                        onClick={() => handleOptionClick("owner")}
                    >
                        Homeowner
                    </Button>
                    <div className="option-description">I own my own home</div>
                </div>

                <div className="button-option-group">
                    <Button
                        className="standard-button"
                        onClick={() => handleOptionClick("manager")}
                    >
                        Manager
                    </Button>
                    <div className="option-description">
                        I manage properties on behalf of others
                    </div>
                </div>
            </div>
        </div>
    );
}

import { PhoneInputCluster } from "../clusters/PhoneInputCluster";

/**
 * Page for inputting phone number so that an OTP can be sent.
 * "/verifyphone"
 */
export function VerifyPhone() {
    return (
        <div className="login-container">
            <img
                src="https://hometrumpeter.com/wp-content/uploads/2023/03/logo.svg"
                className="main-logo"
            />
            <PhoneInputCluster />
        </div>
    );
}

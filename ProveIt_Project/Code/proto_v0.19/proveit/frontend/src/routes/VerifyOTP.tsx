import { OTPVerifyCluster } from "../clusters/OTPVerifyCluster";

export function VerifyOTP() {
    return (
        <div className="login-container">
            <img
                src="https://hometrumpeter.com/wp-content/uploads/2023/03/logo.svg"
                className="main-logo"
            />
            <OTPVerifyCluster />
        </div>
    );
}

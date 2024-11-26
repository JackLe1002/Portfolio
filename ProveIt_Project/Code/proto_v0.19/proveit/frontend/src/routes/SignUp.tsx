import { SignUpCluster } from "../clusters/SignUpCluster";

/**
 * Signup page
 * "/signup"
 */
export function SignUp() {
    return (
        <div className="login-container">
            <img
                src="https://hometrumpeter.com/wp-content/uploads/2023/03/logo.svg"
                className="main-logo"
            />
            <h1>Homeowner / Manager Signup</h1>
            <p></p>
            <SignUpCluster signupType="manager" />
        </div>
    );
}

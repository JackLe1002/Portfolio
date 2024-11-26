import { SignUpCluster } from "../components/SignUpCluster";

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
            <SignUpCluster />
        </div>
    );
}

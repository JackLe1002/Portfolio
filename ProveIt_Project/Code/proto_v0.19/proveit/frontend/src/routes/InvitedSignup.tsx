import { SignUpCluster } from "../clusters/SignUpCluster";

export function InvitedSignup() {
    return (
        <div className="login-container">
            <img
                src="https://hometrumpeter.com/wp-content/uploads/2023/03/logo.svg"
                className="main-logo"
            />
            <h1>Tenant / Service Provider Signup</h1>
            <SignUpCluster signupType="invited" />
        </div>
    );
}

import { LoginCluster } from "../clusters/LoginCluster";

/**
 * Login page
 * "/login"
 */
export function Login() {
    return (
        <div className="login-container">
            <img
                src="https://hometrumpeter.com/wp-content/uploads/2023/03/logo.svg"
                className="main-logo"
            />
            <LoginCluster />
        </div>
    );
}

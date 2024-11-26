import { useNavigate } from "react-router-dom";

/**
 * Home page
 * "/"
 *
 * WIP: need to add the rest of the page
 */
export function Home() {
    const navigate = useNavigate();

    const handleLogIn = () => {
        navigate("/login");
    };

    const handleSignUp = () => {
        navigate("/SignUp");
    };

    return (
        <div>
            <p>Welcome home!</p>
            <button onClick={handleLogIn}>Log in</button>
            <button onClick={handleSignUp}>Sign up</button>
        </div>
    );
}

import { useNavigate } from "react-router-dom";
import "../styles/components/PageFooter.css";

export default function Footer() {
    const navigate = useNavigate();

    const handleLogIn = () => {
        navigate("/login");
    };

    const handleSignUp = () => {
        navigate("/SignUp");
    };

    return (
        <div className="page-footer">
            <div className="footer-links">
                <div className="footer-link-group">
                    <a onClick={handleLogIn}>Log in</a>
                    <a onClick={handleSignUp}>Sign up</a>
                </div>

                <a href="https://google.com">About Us</a>
                <a href="https://hometrumpeter.com/">HomeTrumpeter</a>
            </div>
        </div>
    );
}

import { useNavigate } from "react-router-dom";

export function useLogout() {
    const navigate = useNavigate();

    const logout = () => {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        navigate("/");
    };

    return { logout };
}

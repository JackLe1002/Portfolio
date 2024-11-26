import { Navigate } from "react-router-dom";
import { useAuthContext } from "../hooks/useAuthContext";

export const ProtectedRoute = ({
    redirect,
    children,
    validRoles = null,
}: {
    redirect: string;
    children: React.ReactNode;
    validRoles?: string[] | null;
}) => {
    const { state } = useAuthContext();
    const user = state.user;

    if (!user || (validRoles && !validRoles.includes(user?.role?.role))) {
        return <Navigate to={redirect} />;
    }
    return children;
};

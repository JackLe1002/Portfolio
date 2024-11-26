/**
 * Router for navigating to various routes in the website
 * All pages MUST go under /src/routes/<page.tsx>
 */

import { createBrowserRouter } from "react-router-dom";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { Home } from "./routes/Home";
import { Login } from "./routes/Login";
import { ErrorPage } from "./error-page";
import { Dashboard } from "./routes/Dashboard";
import { VerifyPhone } from "./routes/VerifyPhone";
import { SignUp } from "./routes/SignUp";
import { VerifyOTP } from "./routes/VerifyOTP";
import { SetRole } from "./routes/SetRole";

export const Router = createBrowserRouter([
    {
        path: "/",
        element: <Home />,
        errorElement: <ErrorPage />,
    },
    {
        path: "/login",
        element: <Login />,
        errorElement: <ErrorPage />,
    },
    {
        path: "/dashboard",
        element: (
            <ProtectedRoute redirect="/login">
                <Dashboard />
            </ProtectedRoute>
        ),
        errorElement: <ErrorPage />,
    },
    {
        path: "/signup",
        element: <SignUp />,
        errorElement: <ErrorPage />,
    },
    {
        path: "/verifyphone",
        element: <VerifyPhone />,
        errorElement: <ErrorPage />,
    },
    {
        path: "/verifyotp",
        element: <VerifyOTP />,
        errorElement: <ErrorPage />,
    },
    {
        path: "/setrole",
        element: <SetRole />,
        errorElement: <ErrorPage />,
    },
]);

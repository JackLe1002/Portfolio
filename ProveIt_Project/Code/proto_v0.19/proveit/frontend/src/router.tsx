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
import { AddProperty } from "./routes/AddProperty";
import { InviteTenant } from "./routes/InviteTenant";
import { InviteServiceProvider } from "./routes/InviteServiceProvider";
import { InvitedSignup } from "./routes/InvitedSignup";
import { TenantOnboarding } from "./routes/TenantOnboarding";
import { SignupRole } from "./routes/SignupRole";
import { ServiceProviderOnboarding } from "./routes/ServiceProviderOnboarding";
import { ForgotPassword } from "./routes/ForgotPassword";
import { HOTenants } from "./routes/HOTenants";
import { HOServiceProvider } from "./routes/HOServiceProvider";
import { RequestService } from "./routes/RequestService";
import { RequestQuote } from "./routes/RequestQuote";
import { AddService } from "./routes/AddService";
import { Proposals } from "./routes/Proposals";
import { SendQuote } from "./routes/SendQuote";
import { ApplyPublic } from "./routes/ApplyPublic";
import { SubmitAgreement } from "./routes/SubmitAgreement";
import { HORequestService } from "./routes/HORequestService";
import { SeeAgreement } from "./routes/SeeAgreement";

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
        element: <SignupRole />,
        errorElement: <ErrorPage />,
    },
    {
        path: "/verifyphone",
        element: (
            <ProtectedRoute redirect="/dashboard">
                <VerifyPhone />
            </ProtectedRoute>
        ),
        errorElement: <ErrorPage />,
    },
    {
        path: "/verifyotp",
        element: (
            <ProtectedRoute redirect="/dashboard">
                <VerifyOTP />
            </ProtectedRoute>
        ),
        errorElement: <ErrorPage />,
    },
    {
        path: "/setrole",
        element: (
            <ProtectedRoute redirect="/dashboard">
                <SetRole />
            </ProtectedRoute>
        ),
        errorElement: <ErrorPage />,
    },
    {
        //TODO: Protect this route
        path: "/addproperty",
        element: (
            <ProtectedRoute
                redirect="/dashboard"
                validRoles={["owner", "manager"]}
            >
                <AddProperty />
            </ProtectedRoute>
        ),
        errorElement: <ErrorPage />,
    },
    {
        path: "/invite/tenant",
        element: (
            <ProtectedRoute
                redirect="/dashboard"
                validRoles={["owner", "manager"]}
            >
                <InviteTenant />
            </ProtectedRoute>
        ),
        errorElement: <ErrorPage />,
    },
    {
        path: "/invite/serviceprovider",
        element: (
            <ProtectedRoute
                redirect="/dashboard"
                validRoles={["owner", "manager"]}
            >
                <InviteServiceProvider />
            </ProtectedRoute>
        ),
        errorElement: <ErrorPage />,
    },
    {
        path: "/signup/invited",
        element: <InvitedSignup />,
        errorElement: <ErrorPage />,
    },
    {
        path: "/signup/owner",
        element: <SignUp />,
        errorElement: <ErrorPage />,
    },
    {
        path: "/onboarding/tenant",
        element: <TenantOnboarding />,
        errorElement: <ErrorPage />,
    },
    {
        path: "/onboarding/serviceprovider",
        element: <ServiceProviderOnboarding />,
        errorElement: <ErrorPage />,
    },
    {
        path: "/forgot-password",
        element: <ForgotPassword />,
        errorElement: <ErrorPage />,
    },
    {
        path: "/ho/tenants",
        element: <HOTenants />,
        errorElement: <ErrorPage />,
    },
    {
        path: "/ho/service-providers",
        element: <HOServiceProvider />,
        errorElement: <ErrorPage />,
    },
    {
        path: "/request-service",
        element: <RequestService />,
        errorElement: <ErrorPage />,
    },
    {
        path: "/add-service",
        element: (
            <ProtectedRoute
                redirect="/dashboard"
                validRoles={["service_provider"]}
            >
                <AddService />
            </ProtectedRoute>
        ),
        errorElement: <ErrorPage />,
    },
    {
        path: "/request-quote",
        element: (
            <ProtectedRoute
                redirect="/dashboard"
                validRoles={["owner", "manager"]}
            >
                <RequestQuote />
            </ProtectedRoute>
        ),
        errorElement: <ErrorPage />,
    },
    {
        path: "/proposals",
        element: (
            <ProtectedRoute
                redirect="/dashboard"
                validRoles={["owner", "manager"]}
            >
                <Proposals />
            </ProtectedRoute>
        ),
        errorElement: <ErrorPage />,
    },
    {
        path: "/send-quote",
        element: (
            <ProtectedRoute
                redirect="/dashboard"
                validRoles={["service_provider"]}
            >
                <SendQuote />
            </ProtectedRoute>
        ),
        errorElement: <ErrorPage />,
    },
    {
        path: "/apply-public",
        element: (
            <ProtectedRoute
                redirect="/dashboard"
                validRoles={["service_provider"]}
            >
                <ApplyPublic />
            </ProtectedRoute>
        ),
        errorElement: <ErrorPage />,
    },
    {
        path: "/submit-agreement",
        element: (
            <ProtectedRoute
                redirect="/dashboard"
                validRoles={["owner", "manager"]}
            >
                <SubmitAgreement />
            </ProtectedRoute>
        ),
    },
    {
        path: "/ho-request-service",
        element: (
            <ProtectedRoute
                redirect="/dashboard"
                validRoles={["owner", "manager"]}
            >
                <HORequestService />
            </ProtectedRoute>
        ),
        errorElement: <ErrorPage />,
    },
    {
        path: "/tenant/see-agreement",
        element: (
            <ProtectedRoute redirect="/dashboard" validRoles={["tenant"]}>
                <SeeAgreement />
            </ProtectedRoute>
        ),
        errorElement: <ErrorPage />,
    },
]);

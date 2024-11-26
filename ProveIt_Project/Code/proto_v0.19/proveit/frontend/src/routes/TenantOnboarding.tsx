import TenantOnboardingCluster from "../clusters/tenant/TenantOnboardingCluster";

export function TenantOnboarding() {
    return (
        <div className="login-container">
            <img
                src="https://hometrumpeter.com/wp-content/uploads/2023/03/logo.svg"
                className="main-logo"
            />

            <h1>Tenant Onboarding</h1>

            <p>Let's get to know you! We have just a few questions.</p>
            <p></p>
            <TenantOnboardingCluster />
        </div>
    );
}

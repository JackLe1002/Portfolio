import { ServiceProviderOnboardingCluster } from "../clusters/service-provider/ServiceProviderOnboardingCluster";

export function ServiceProviderOnboarding() {
    return (
        <div className="login-container">
            <img
                src="https://hometrumpeter.com/wp-content/uploads/2023/03/logo.svg"
                className="main-logo"
            />

            <h1>Service Provider Onboarding</h1>

            <p>Let's get started! We have just a few questions.</p>
            <p></p>
            <ServiceProviderOnboardingCluster />
        </div>
    );
}

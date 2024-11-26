/**
 * Dashboard for owner
 * "/dashboardowner"
 *
 * WIP: need to add the rest of the page
 */

import { DashboardOwnerCluster } from "../clusters/ho-manager/DashboardOwnerCluster";
import { DashboardTenantCluster } from "../clusters/tenant/DashboardTenantCluster";
import { DashboardServiceCluster } from "../clusters/service-provider/DashboardServiceCluster";
import { useAuthContext } from "../hooks/useAuthContext";

export function Dashboard() {
    const user = useAuthContext().state.user;

    if (!user) {
        throw new Error(
            "Could not retrieve user from authContext! Please log in again.",
        );
    }

    switch (user.role.role) {
        case "owner":
            return <DashboardOwnerCluster />;
        case "manager":
            return <DashboardOwnerCluster />;
        case "tenant":
            return <DashboardTenantCluster />;
        case "service_provider":
            return <DashboardServiceCluster />;
        default:
            throw new Error(
                "No dashboard route for user's role of " + user.role.role,
            );
    }
}

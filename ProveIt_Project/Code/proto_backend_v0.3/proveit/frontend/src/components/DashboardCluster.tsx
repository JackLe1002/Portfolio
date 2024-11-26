/**
 * Dashboard Cluster includes the tables, buttons
 * 
 * Sends: 
 * Receives: 
 */
import { useLogout } from "../hooks/useLogout"
/**
 * 
 * @returns Void
 */
export function DashboardCluster() {
    const {logout} = useLogout();

  return (
    <div className="dashboard-container">
        <img src="https://hometrumpeter.com/wp-content/uploads/2023/03/logo.svg" className="dashboard-logo" />
        
        {/* logout button */}
        <button className="logout-button" onClick={logout}>Log out</button>
        <h1 className="dashboard-title">Dashboard</h1>

        {/* left side of dashboard for inline-block */}
        <div className="dashboard-left-side">

            {/* Property block */}
            <div className="dashboard-table-container">
                <h1 className="dashboard-label">Properties</h1>
                <table className="dashboard-table">
                    <tr>
                        <th className="dashboard-header">No properties added</th>
                    </tr>
                    <tr>
                        <td className="dashboard-empty-property"> 
                            <a className="dashboard-link" href="https://youtu.be/dQw4w9WgXcQ?si=xCkLFrt7q1dP8Bk2">Add Property...</a>
                        </td>
                    </tr>
                </table>
            </div>

            {/* Service Request block */}
            <div className = "dashboard-table-container">
                <h1 className="dashboard-label">Service Requests</h1>
                <table className="dashboard-table">
                    <tr className="dashboard-header">
                        <th className="dashboard-header">Service</th>
                        <th>Provider</th>
                        <th>Property</th>
                    </tr>
                    <tr>
                        <td className="dashboard-empty-service" colSpan={3}> 
                            <a href="https://youtu.be/dQw4w9WgXcQ?si=xCkLFrt7q1dP8Bk2">Request a Service</a>
                        </td>
                    </tr>
                </table>
            </div>
        </div>

        {/* tip block */}
        <div className="tip-table-container">
            <table className="tip-table">
                <tr className="dashboard-tip-header">
                    <th>Tips</th>
                </tr>
                <tr>
                    <td>You dont have any property added. <a href="https://youtu.be/dQw4w9WgXcQ?si=xCkLFrt7q1dP8Bk2">Start by adding a property</a></td>
                </tr>
            </table>
        </div>
    </div>
  );
}
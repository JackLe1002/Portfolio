import { useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import { useLogout } from "../../hooks/useLogout";
import { useState } from "react";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useNavigate } from "react-router-dom";
import { ServiceProviderDetail } from "../../types";
import Offcanvas from "react-bootstrap/Offcanvas";
import Nav from "react-bootstrap/Nav";
import "../../styles/pages/allServiceTab.css";
/**
 *
 * @returns Void
 */
export function AllServiceProviderCluster() {
    const { logout } = useLogout();
    //const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [serviceProviders, setServiceProvider] = useState<
        ServiceProviderDetail[] | null
    >(null);

    const [selectedServiceProvider, setSelectedServiceProvider] =
        useState<ServiceProviderDetail | null>(null);
    const [showDetail, setShowDetail] = useState(false);

    const { state } = useAuthContext();
    const { user } = state;
    const navigate = useNavigate();
    const [isOffcanvasOpen, setIsOffcanvasOpen] = useState(false);
    const toggleOffcanvas = () => {
        setIsOffcanvasOpen(!isOffcanvasOpen);
    };

    useEffect(() => {
        setIsLoading(true);
        fetch(window.config.SERVER_URL + "/owner-service-provider", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + user?.token,
            },
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                console.log("SERVICE PROVIDER");
                console.log(response.json);
                return response.json();
            })
            .then((data) => {
                setIsLoading(false);
                setServiceProvider(data);
                console.log("SERVICE PROVIDER");
                console.log(data);
            })
            .catch((error) => {
                console.error("Error fetching data: " + error);
            });
    }, [user?.token]);

    // Function to handle the "Details" button click
    const handleDetailsClick = (serviceProvider: ServiceProviderDetail) => {
        setSelectedServiceProvider(serviceProvider);
        setShowDetail(true);
    };

    const handleCloseDetail = () => {
        //setSelectedProperty(null);
        setShowDetail(false);
    };

    return (
        <div className="allsp-container">
            <main>
            <div className="header">
                <h1
                    className="dashboard-title"
                    onClick={() => navigate("/dashboard")}
                >
                    Dashboard Homeowner
                </h1>
                <button
                    className="menu-toggle-button"
                    onClick={toggleOffcanvas}
                >
                    ☰
                </button>
            </div>
            {/* Nav Panel */}
            <Offcanvas
                show={isOffcanvasOpen}
                onHide={toggleOffcanvas}
                placement="end"
            >
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title>Service Providers</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    <div className="nav-container">
                        <Nav.Link onClick={() => navigate("/dashboard")}>
                            Dashboard
                        </Nav.Link>
                        <Nav.Link onClick={() => navigate("/addproperty")}>
                            Add Property
                        </Nav.Link>
                        <Nav.Link onClick={() => navigate("/invite/tenant")}>
                            Invite Tenant
                        </Nav.Link>
                        <Nav.Link
                            onClick={() => navigate("/invite/serviceprovider")}
                        >
                            Invite Service Provider
                        </Nav.Link>
                        <Nav.Link onClick={() => navigate("/ho/tenants")}>
                            Tenants
                        </Nav.Link>
                        <Nav.Link
                            onClick={() => navigate("/ho/service-providers")}
                        >
                            Service Provider
                        </Nav.Link>
                    </div>
                    <button className="logout-button" onClick={logout}>
                        Log out
                    </button>
                </Offcanvas.Body>
            </Offcanvas>

            {/* Property block */}
            <div className="all-serviceProvider-container">
                <h1 className="dashboard-label">Service Providers</h1>
                <table className="dashboard-table">
                    <thead className="dashboard-header">
                        <tr>
                            <th>First Name</th>
                            <th>Last Name</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {isLoading ? (
                            <td colSpan={2}>Loading Properties...</td>
                        ) : Array.isArray(serviceProviders) &&
                          serviceProviders.length > 0 ? (
                            serviceProviders.map((userServiceProvider) => (
                                <tr>
                                    <td>{userServiceProvider.firstName}</td>
                                    <td>{userServiceProvider.lastName}</td>
                                    <td>{userServiceProvider.email}</td>
                                    <td>{userServiceProvider.phone}</td>
                                    <td>
                                        <button
                                            onClick={() =>
                                                handleDetailsClick(
                                                    userServiceProvider,
                                                )
                                            }
                                            className="delete-button"
                                        >
                                            Details
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={3}>
                                    You have not invite any service provider
                                    Start by invite a service provider!
                                </td>
                            </tr>
                        )}

                        <tr>
                            <td
                                className="dashboard-empty-property"
                                colSpan={5}
                            >
                                <button
                                    className="add-property-button"
                                    onClick={() => {
                                        navigate("/invite/serviceprovider");
                                    }}
                                >
                                    Invite a service provider
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
                </main>
            {/* Footer */}
            <footer className="dashboard-footer">
                <div className="footer-content">
                    <p>
                        © {new Date().getFullYear()} HomeTrumpeter. All rights
                        reserved.
                    </p>
                    <div className="footer-links">
                        <a onClick={() => navigate("/privacy")}>
                            Privacy Policy
                        </a>
                        <a onClick={() => navigate("/tos")}>Terms of Service</a>
                        <a onClick={() => navigate("/contact")}>Contact Us</a>
                    </div>
                </div>
            </footer>

            {/* Show more detail about property Popup */}
            <Modal show={showDetail} onHide={handleCloseDetail} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Service Provider Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <table className="property-detail-table">
                        <tbody>
                            {selectedServiceProvider != null ? (
                                <>
                                    <tr>
                                        <td>First Name: </td>
                                        <td>
                                            {selectedServiceProvider.firstName}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Last Name: </td>
                                        <td>
                                            {selectedServiceProvider.lastName}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Email: </td>
                                        <td>{selectedServiceProvider.email}</td>
                                    </tr>
                                    <tr>
                                        <td>Phone: </td>
                                        <td>{selectedServiceProvider.phone}</td>
                                    </tr>
                                    <tr>
                                        <td>Address: </td>
                                        <td>
                                            {selectedServiceProvider.address}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Company: </td>
                                        <td>
                                            {selectedServiceProvider.company}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Distance Covered: </td>
                                        <td>
                                            {
                                                selectedServiceProvider.distanceCovered
                                            }
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Rate per Hour: </td>
                                        <td>
                                            {
                                                selectedServiceProvider.perHourRate
                                            }
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Is Public: </td>
                                        <td>
                                            {selectedServiceProvider.isPublic}
                                        </td>
                                    </tr>
                                </>
                            ) : (
                                <tr>
                                    <td colSpan={2}>No details available.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </Modal.Body>
                <Modal.Footer>
                    <button onClick={handleCloseDetail}>Close</button>
                </Modal.Footer>
            </Modal>
    </div>
    );
}

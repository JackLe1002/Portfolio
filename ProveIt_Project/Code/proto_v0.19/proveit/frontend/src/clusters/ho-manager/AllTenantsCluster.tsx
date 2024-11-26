import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLogout } from "../../hooks/useLogout";
import { useAuthContext } from "../../hooks/useAuthContext";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Spinner from "../../components/Spinner";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import { TenantBGResult, Agreement } from "../../types";
import Offcanvas from "react-bootstrap/Offcanvas";
import Nav from "react-bootstrap/Nav";
import "../../styles/pages/allTenantTab.css";

interface Tenant {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
}

interface TenantPropertyProps {
    property: string;
    tenant: Tenant;
}
export function AllTenantsCluster() {
    const [isLoading, setIsLoading] = useState(false);
    const [tenantsData, setTenantsData] = useState<TenantPropertyProps[]>([]);
    const [agreement, setAgreement] = useState<Agreement | null>(null);
    const { state } = useAuthContext();
    const { user } = state;
    const [isOffcanvasOpen, setIsOffcanvasOpen] = useState(false);
    const toggleOffcanvas = () => {
        setIsOffcanvasOpen(!isOffcanvasOpen);
    };
    const { logout } = useLogout();

    const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null);
    const [tenantBGResult, setTenantBGResult] = useState<TenantBGResult | null>(
        null,
    );

    const [bcModal, setBCModalShow] = useState(false);
    const [AgreementModal, setAgreementModalShow] = useState(false);

    const handleBCModalClose = () => setBCModalShow(false);
    const handleBCModalShow = (tenant: Tenant) => {
        setSelectedTenant(tenant);
        fetch(
            window.config.SERVER_URL + "/background-check/tenant-application",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + user?.token,
                },
                body: JSON.stringify({ id: tenant.id }),
            },
        )
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                //console.log(response.json);
                return response.json();
            })
            .then((responseJson) => {
                //console.log('Backend response:', responseJson);
                if (responseJson != null) {
                    setTenantBGResult(responseJson);
                } else if (responseJson == null) {
                    //console.log(responseJson);
                    alert(responseJson.message);
                }
            })
            .catch((error) => {
                console.error("Error fetching data: " + error);
            });

        setBCModalShow(true);
    };
    const handleAgreementModalClose = () => {
        setAgreementModalShow(false);
        setAgreement(null);
    };
    const handleAgreementModalShow = (tenant: Tenant) => {
        setIsLoading(true);
        fetch(window.config.SERVER_URL + "/agreement/tenant-see", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + user?.token,
            },
            body: JSON.stringify({ id: tenant.id }),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                //console.log(response);
                return response.json();
            })
            .then((data) => {
                setAgreement(data);
                setIsLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching data: " + error);
            })
            .finally(() => setAgreementModalShow(true));
    };

    const navigate = useNavigate();

    const handleBCInitiation = () => {
        if (selectedTenant) {
            setIsLoading(true);
            const queryParams = new URLSearchParams({
                userId: selectedTenant.id,
                firstName: selectedTenant.firstName,
                lastName: selectedTenant.lastName,
                email: selectedTenant.email,
            }).toString();

            setIsLoading(true);
            fetch(
                `${window.config.SERVER_URL}/background-check/tenant?${queryParams}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: "Bearer " + user?.token,
                    },
                },
            ).finally(() => {
                setIsLoading(false);
                setBCModalShow(false);
            });
        }
    };

    const handleBCApprove = () => {
        if (selectedTenant) {
            setIsLoading(true);

            const queryParams = new URLSearchParams({
                userId: selectedTenant.id,
            }).toString();

            setIsLoading(true);
            fetch(
                `${window.config.SERVER_URL}/background-check/tenant/approve?${queryParams}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: "Bearer " + user?.token,
                    },
                },
            ).finally(() => {
                setIsLoading(false);
                setBCModalShow(false);
            });
        }
    };

    const handleSendAgreement = () => {
        if (selectedTenant) {
            setIsLoading(true);
            const queryParams = new URLSearchParams({
                userId: selectedTenant.id,
            }).toString();
            fetch(
                `${window.config.SERVER_URL}/agreement/initiate?${queryParams}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${user?.token}`,
                    },
                },
            ).finally(() => {
                setIsLoading(false);
                setAgreementModalShow(false);
            });
        }
    };

    const handleBCReject = () => {
        if (selectedTenant) {
            setIsLoading(true);
            const queryParams = new URLSearchParams({
                userId: selectedTenant.id,
            }).toString();

            fetch(
                `${window.config.SERVER_URL}/background-check/tenant/reject?${queryParams}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${user?.token}`,
                    },
                },
            ).finally(() => {
                setIsLoading(false);
                setAgreementModalShow(false);
            });
        }
    };

    const handleBCDownload = (tenantBGResult: TenantBGResult) => {
        setIsLoading(true);
        fetch(
            window.config.SERVER_URL +
                "/background-check/tenant-application-download",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + user?.token,
                },
                body: JSON.stringify({
                    applicantId: tenantBGResult.id,
                    id: tenantBGResult.tenantId,
                }),
            },
        )
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                //console.log(response.json);
                return response.json();
            })
            .then((responseJson) => {
                //console.log('Backend response:', responseJson);
                if (responseJson.isSuccess) {
                    window.open(responseJson.reportUrl, "_blank");
                } else if (!responseJson.isSuccess) {
                    //console.log(responseJson);
                    alert(responseJson.message);
                }
            })
            .catch((error) => {
                console.error("Error fetching data: " + error);
            });
        setIsLoading(false);
    };

    useEffect(() => {
        setIsLoading(true);
        fetch(window.config.SERVER_URL + "/owner-tenants", {
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
                return response.json();
            })
            .then((data) => {
                setIsLoading(false);
                const formattedData: TenantPropertyProps[] = [];
                for (const propertyName in data) {
                    data[propertyName].forEach((tenant: Tenant) => {
                        formattedData.push({ property: propertyName, tenant });
                    });
                }
                setTenantsData(formattedData);
            })
            .catch((error) => {
                console.error("Error fetching data: " + error);
            });
    }, [user?.token]);

    //console.log(agreement);

    return (
        <body>
            <div className="tenant-tab-container">
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
                        <Offcanvas.Title>Tenants</Offcanvas.Title>
                    </Offcanvas.Header>
                    <Offcanvas.Body>
                        <div className="nav-container">
                            <Nav.Link onClick={() => navigate("/dashboard")}>
                                Dashboard
                            </Nav.Link>
                            <Nav.Link onClick={() => navigate("/addproperty")}>
                                Add Property
                            </Nav.Link>
                            <Nav.Link
                                onClick={() => navigate("/invite/tenant")}
                            >
                                Invite Tenant
                            </Nav.Link>
                            <Nav.Link
                                onClick={() =>
                                    navigate("/invite/serviceprovider")
                                }
                            >
                                Invite Service Provider
                            </Nav.Link>
                            <Nav.Link onClick={() => navigate("/ho/tenants")}>
                                Tenants
                            </Nav.Link>
                            <Nav.Link
                                onClick={() =>
                                    navigate("/ho/service-providers")
                                }
                            >
                                Service Provider
                            </Nav.Link>
                        </div>
                        <button className="logout-button" onClick={logout}>
                            Log out
                        </button>
                    </Offcanvas.Body>
                </Offcanvas>
                <div className="all-tenant-container">
                    <h1 className="dashboard-label">Tenants</h1>
                    {isLoading ? (
                        <Spinner />
                    ) : (
                        <table className="dashboard-table">
                            <thead className="dashboard-header">
                                <tr>
                                    <th>First Name</th>
                                    <th>Last Name</th>
                                    <th>Email</th>
                                    <th>Property</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {tenantsData.map((item, index) => (
                                    <tr key={index}>
                                        <td>{item.tenant.firstName}</td>
                                        <td>{item.tenant.lastName}</td>
                                        <td>{item.tenant.email}</td>
                                        <td>{item.property}</td>
                                        <td className="centered-column-2">
                                            <div className="button-container">
                                                <Button
                                                    variant="primary"
                                                    size="sm"
                                                    onClick={() => handleBCModalShow(item.tenant)}
                                                >
                                                    Background Check
                                                </Button>
                                                <Button
                                                    variant="secondary"
                                                    size="sm"
                                                    onClick={() => handleAgreementModalShow(item.tenant)}
                                                >
                                                    Agreement
                                                </Button>
                                            </div>
                                        </td>

                                    </tr>
                                ))}
                                <tr>
                                    <td
                                        className="dashboard-empty-property"
                                        colSpan={5}
                                    >
                                        <button
                                            className="add-property-button"
                                            onClick={() => {
                                                navigate("/invite/tenant");
                                            }}
                                        >
                                            Invite a tenent
                                        </button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    )}
                </div>
                </main>
                {/* Footer */}
                <footer className="dashboard-footer">
                    <div className="footer-content">
                        <p>
                            © {new Date().getFullYear()} HomeTrumpeter. All
                            rights reserved.
                        </p>
                        <div className="footer-links">
                            <a onClick={() => navigate("/privacy")}>
                                Privacy Policy
                            </a>
                            <a onClick={() => navigate("/tos")}>
                                Terms of Service
                            </a>
                            <a onClick={() => navigate("/contact")}>
                                Contact Us
                            </a>
                        </div>
                    </div>
                </footer>

                <Modal show={bcModal} onHide={handleBCModalClose} size="lg">
                    <Modal.Header closeButton>
                        <Modal.Title>Background Check</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {tenantBGResult != null &&
                        Array.isArray(tenantBGResult.checksResult) ? (
                            tenantBGResult.checksResult.length > 1 ? (
                                <div className="bg-info-table">
                                    <table className="property-detail-table">
                                        <thead className="dashboard-header">
                                            <tr>
                                                <th>Check</th>
                                                <th>Status</th>
                                                <th>Result</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {tenantBGResult.checksResult.map(
                                                (result) => (
                                                    <tr>
                                                        <td>
                                                            {result.checkName}
                                                        </td>
                                                        <td>{result.result}</td>
                                                        <td>
                                                            {result.statusLabel}
                                                        </td>
                                                    </tr>
                                                ),
                                            )}
                                        </tbody>
                                    </table>
                                    <div className="button-container">
                                    <Button
                                        variant="info"
                                        onClick={() =>
                                            handleBCDownload(tenantBGResult)
                                        }
                                    >
                                        Download Result
                                    </Button>
                                    <Button
                                        variant="success"
                                        className="logout-button"
                                        onClick={handleBCApprove}
                                    >
                                        Accept
                                    </Button>
                                    <Button
                                        variant="danger"
                                        onClick={handleBCReject}
                                    >
                                        Reject
                                    </Button>
                                    </div>
                                </div>
                            ) : (
                                <h1>Background Check initiated</h1>
                            )
                        ) : (
                            <>
                                <p>
                                    Tenant have no info on background check,
                                    press the button below to initiate the
                                    background check
                                </p>
                                <Button
                                    variant="info"
                                    onClick={handleBCInitiation}
                                >
                                    Initiate
                                </Button>
                            </>
                        )}
                    </Modal.Body>
                    <Modal.Footer>
                        <Button
                            variant="secondary"
                            onClick={handleBCModalClose}
                        >
                            Close
                        </Button>
                    </Modal.Footer>
                </Modal>
                <Modal show={AgreementModal} onHide={handleAgreementModalClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Agreement</Modal.Title>
                    </Modal.Header>
                    {isLoading ? (
                        <Spinner />
                    ) : (
                        <Modal.Body>
                            {agreement?.status != "not found" ? (
                                <Form>
                                    <Form.Group as={Row} controlId="rent">
                                        <Form.Label column sm="5">
                                            Rent
                                        </Form.Label>
                                        <Col sm="5">
                                            <Form.Control
                                                type="text"
                                                value={agreement?.rent}
                                                plaintext
                                                readOnly
                                            />
                                        </Col>
                                    </Form.Group>

                                    <Form.Group
                                        as={Row}
                                        controlId="securityDeposit"
                                    >
                                        <Form.Label column sm="5">
                                            Security Deposit
                                        </Form.Label>
                                        <Col sm="5">
                                            <Form.Control
                                                type="text"
                                                value={
                                                    agreement?.advancePayment
                                                }
                                                plaintext
                                                readOnly
                                            />
                                        </Col>
                                    </Form.Group>

                                    <Form.Group as={Row} controlId="lateFee">
                                        <Form.Label column sm="5">
                                            Late Fee
                                        </Form.Label>
                                        <Col sm="5">
                                            <Form.Control
                                                type="number"
                                                value={agreement?.lateFee}
                                                plaintext
                                                readOnly
                                            />
                                        </Col>
                                    </Form.Group>

                                    <Form.Group
                                        as={Row}
                                        controlId="rentDueDate"
                                    >
                                        <Form.Label column sm="5">
                                            Rent Due Date
                                        </Form.Label>
                                        <Col sm="5">
                                            <Form.Control
                                                type="number"
                                                value={agreement?.rentDueDate}
                                                plaintext
                                                readOnly
                                            />
                                        </Col>
                                    </Form.Group>

                                    <Form.Group as={Row} controlId="startDate">
                                        <Form.Label column sm="5">
                                            Start Date
                                        </Form.Label>
                                        <Col sm="5">
                                            <Form.Control
                                                type="string"
                                                value={agreement?.startDate}
                                                plaintext
                                                readOnly
                                            />
                                        </Col>
                                    </Form.Group>

                                    <Form.Group as={Row} controlId="endDate">
                                        <Form.Label column sm="5">
                                            End Date
                                        </Form.Label>
                                        <Col sm="5">
                                            <Form.Control
                                                type="string"
                                                value={agreement?.endDate}
                                                plaintext
                                                readOnly
                                            />
                                        </Col>
                                    </Form.Group>

                                    <Form.Group as={Row} controlId="status">
                                        <Form.Label column sm="5">
                                            Status
                                        </Form.Label>
                                        <Col sm="5">
                                            <Form.Control
                                                type="string"
                                                value={agreement?.status}
                                                plaintext
                                                readOnly
                                            />
                                        </Col>
                                    </Form.Group>
                                </Form>
                            ) : (
                                <h1>Agreement haven't been submitted yet!</h1>
                            )}
                        </Modal.Body>
                    )}
                    <Modal.Footer>
                        <Button
                            variant="secondary"
                            onClick={handleAgreementModalClose}
                        >
                            Close
                        </Button>
                        <Button variant="primary" onClick={handleSendAgreement}>
                            Send
                        </Button>
                        <Button
                            className="standard-button"
                            onClick={() => {
                                if (selectedTenant !== null) {
                                    navigate(
                                        "/submit-agreement?id=" +
                                            selectedTenant.id,
                                    );
                                }
                            }}
                        >
                            Submit Agreement
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        </body>
    );
}

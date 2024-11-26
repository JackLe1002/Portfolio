import { useEffect, useCallback } from "react";

import { useLogout } from "../../hooks/useLogout";
import { useState } from "react";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useNavigate } from "react-router-dom";
import { TenantProperty, ServiceRequest, ContactInfo } from "../../types";
import Offcanvas from "react-bootstrap/Offcanvas";
import Nav from "react-bootstrap/Nav";
import Modal from "react-bootstrap/Modal";
import Badge from "react-bootstrap/Badge";
import Accordion from "react-bootstrap/Accordion";

import Homie from "../../components/Homie";

import "../../styles/pages/dashboard.css";
import { Button } from "react-bootstrap";
import { OwnerContactModal } from "../../components/OwnerContactModal";

/**
 *
 * @returns Void
 */
export function DashboardTenantCluster() {
    const { logout } = useLogout();
    const [isLoading, setIsLoading] = useState(false);
    const [properties, setProperties] = useState<TenantProperty[] | null>(null);
    const [tickets, setTickets] = useState<ServiceRequest[] | null>(null);
    const [showTicketDetail, setShowTicketDetail] = useState<boolean>(false);
    const [ticketDetail, setTicketDetail] = useState<
        ServiceRequest | undefined
    >(undefined);
    const [update, setUpdate] = useState<boolean>(false);
    const [showOwnerContact, setShowOwnerContact] = useState<boolean>(false);
    const [ownerContact, setOwnerContact] = useState<ContactInfo | undefined>(
        undefined,
    );

    const [propertyID, setPropertyID] = useState<string>("");

    const { state } = useAuthContext();
    const { user } = state;
    const navigate = useNavigate();
    const [isOffcanvasOpen, setIsOffcanvasOpen] = useState(false);
    const toggleOffcanvas = () => {
        setIsOffcanvasOpen(!isOffcanvasOpen);
    };

    const fetchData = useCallback(
        async (url: string, method = "GET", body?: string) => {
            const headers = new Headers();
            headers.append("Content-Type", "application/json");

            if (user) {
                headers.append("Authorization", `Bearer ${user.token}`);
            }

            let requestOptions;

            if (method == "GET") {
                requestOptions = {
                    method: method,
                    headers: headers,
                };
            } else if (method == "POST") {
                requestOptions = {
                    method: method,
                    headers: headers,
                    body: body,
                };
            }

            try {
                const response = await fetch(url, requestOptions);
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                return response.json();
            } catch (error) {
                console.error("Error:", error);
                throw error;
            }
        },
        [user],
    );

    useEffect(() => {
        setIsLoading(true);
        if (user) {
            fetch(
                window.config.SERVER_URL +
                    "/properties-tenant" +
                    "?tenantId=" +
                    user.id,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: "Bearer " + user?.token,
                    },
                },
            )
                .then((response) => {
                    if (!response.ok) {
                        throw new Error("Network response was not ok");
                    }
                    return response.json();
                })
                .then((data) => {
                    setIsLoading(false);
                    setProperties(data);
                    setOwnerContact(data[0].ownerContact);
                    setPropertyID(data[0].id);
                })
                .catch((error) => {
                    console.error("Error fetching data: " + error);
                });

            fetch(window.config.SERVER_URL + "/tenant/service-requests", {
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
                    setTickets(data.data.serviceRequests);
                    console.log("TENANT TICKETS");
                    console.log(data);
                })
                .catch((error) => {
                    console.error("Error fetching data: " + error);
                });
            setUpdate(false);
        }
    }, [user, user?.token, update]);

    const handleTicketDetailClick = (id: string) => {
        const ticket: ServiceRequest | undefined = tickets?.filter((obj) => {
            return obj.id === id;
        })[0];
        console.log("TICKET");
        console.log(ticket);
        setTicketDetail(ticket);
        setShowTicketDetail(true);
    };

    const handleCloseTicketDetail = () => {
        setTicketDetail(undefined);
        setShowTicketDetail(false);
    };

    const handleWithdrawClick = (id: string) => {
        fetchData(
            window.config.SERVER_URL + "/service-request-withdraw?id=" + id,
            "POST",
        )
            .then((response) => {
                if (response.isSuccess) {
                    console.log("SUCCESSFULLY WITHDREW SERVICE REQUEST: " + id);
                    console.log(user);
                    console.log(response);
                    setUpdate(true);
                } else {
                    console.error(response.message);
                }
            })
            .catch((error) => {
                console.error(error);
            });
    };

    console.log(ownerContact);

    return (
        <div className="dashboard-container">
            <main>
                <div className="header">
                    <div className="logo-and-title">
                        <svg xmlns="http://www.w3.org/2000/svg" width="130" height="32" viewBox="0 0 130 32"
                             fill="none">
                            <path
                                d="M32.1857 31.2874C30.9887 31.2874 29.967 30.8251 29.1207 29.9004C28.2783 28.9713 27.8572 27.8497 27.8572 26.5356C27.8572 25.1906 28.2783 24.0557 29.1207 23.131C29.967 22.2019 30.9887 21.7373 32.1857 21.7373C33.3786 21.7373 34.3963 22.2019 35.2386 23.131C36.0849 24.0557 36.5081 25.1751 36.5081 26.4891C36.5081 27.8341 36.0849 28.9713 35.2386 29.9004C34.3963 30.8251 33.3786 31.2874 32.1857 31.2874ZM32.2219 29.8075C33.0602 29.8075 33.7776 29.4823 34.3741 28.8319C34.9706 28.1771 35.2688 27.3895 35.2688 26.4692C35.2688 25.5445 34.9706 24.757 34.3741 24.1066C33.7776 23.4518 33.0602 23.1244 32.2219 23.1244C31.3796 23.1244 30.6602 23.4518 30.0637 24.1066C29.4713 24.757 29.1751 25.5445 29.1751 26.4692C29.1751 27.3895 29.4713 28.1771 30.0637 28.8319C30.6602 29.4823 31.3796 29.8075 32.2219 29.8075ZM47.0936 31.2874V21.7439C46.7551 21.7439 46.4669 21.8745 46.2291 22.1355C46.1284 22.2506 46.0477 22.381 45.9873 22.527L45.9752 22.5204L42.2573 29.1571L38.5333 22.5204L38.5273 22.527C38.4668 22.381 38.3842 22.2506 38.2794 22.1355C38.0416 21.8745 37.7555 21.7439 37.421 21.7439V31.2874C37.7555 31.2874 38.0416 31.1569 38.2794 30.8959C38.5172 30.6349 38.6361 30.3207 38.6361 29.9535V25.2614L41.2719 29.9535C41.3606 30.1083 41.4674 30.2366 41.5923 30.3384C41.7938 30.4933 42.0155 30.5773 42.2573 30.5906C42.4991 30.5773 42.7188 30.4933 42.9162 30.3384C43.0452 30.2366 43.154 30.1083 43.2427 29.9535L45.8724 25.2614V29.9535C45.8724 30.3207 45.9913 30.6349 46.2291 30.8959C46.4669 31.1569 46.7551 31.2874 47.0936 31.2874ZM44.4276 21.8435V21.8236H44.4155L44.4276 21.8435ZM51.8272 26.4294C52.1615 26.4294 52.4478 26.2989 52.6856 26.0379C52.9234 25.7768 53.0421 25.4604 53.0421 25.0888H50.7088C50.3742 25.0888 50.0881 25.2194 49.8503 25.4804C49.6125 25.7414 49.4936 26.0578 49.4936 26.4294H51.8272ZM53.786 31.2874H48.0488H48.0004V21.7439H53.786C53.786 22.1112 53.6668 22.4253 53.429 22.6864C53.1912 22.9474 52.9054 23.0779 52.5706 23.0779H49.2216V29.9468H52.5706C52.9054 29.9468 53.1912 30.0774 53.429 30.3384C53.6668 30.5995 53.786 30.9158 53.786 31.2874ZM61.0768 31.2874V23.0779H57.7696C57.7696 22.7107 57.8887 22.3966 58.1265 22.1355C58.3644 21.8745 58.6522 21.7439 58.9911 21.7439H65.6046C65.6046 22.1112 65.4839 22.4253 65.242 22.6864C65.0042 22.9474 64.7179 23.0779 64.3836 23.0779H62.2979V29.9468C62.2979 30.3185 62.1787 30.6349 61.9409 30.8959C61.7031 31.1569 61.4152 31.2874 61.0768 31.2874ZM72.9135 31.2941C72.8047 31.2941 72.6432 31.2609 72.4296 31.1945C72.2202 31.1282 72.0267 30.9313 71.8493 30.6039L70.1871 27.3453H68.5792C68.5792 26.978 68.6978 26.6639 68.9356 26.4029C69.1735 26.1419 69.4613 26.0113 69.8002 26.0113H70.9609C71.3277 26.0113 71.6398 25.8697 71.8978 25.5866C72.1598 25.299 72.2909 24.9517 72.2909 24.5446C72.2909 24.142 72.1598 23.7991 71.8978 23.5159C71.6398 23.2283 71.3277 23.0845 70.9609 23.0845H67.7326V29.9535C67.7326 30.3207 67.6114 30.6349 67.37 30.8959C67.1321 31.1569 66.8458 31.2874 66.5115 31.2874V21.7439H70.9609C71.662 21.7439 72.2625 22.0183 72.7624 22.5669C73.2623 23.1155 73.5119 23.7748 73.5119 24.5446C73.5119 25.3189 73.2623 25.9803 72.7624 26.529C72.424 26.8962 72.0169 27.144 71.5413 27.2723L73.5119 31.1215C73.3144 31.2366 73.1147 31.2941 72.9135 31.2941ZM77.5141 31.2874C78.2193 31.2874 78.844 31.0574 79.3883 30.5972C80.1982 29.8982 80.6031 28.9978 80.6031 27.8961V21.7439C80.2689 21.7439 79.9825 21.8745 79.7447 22.1355C79.5069 22.3966 79.3883 22.7129 79.3883 23.0845V27.8961C79.3883 28.4624 79.2046 28.9469 78.8378 29.3495C78.471 29.7522 78.03 29.9535 77.5141 29.9535C76.9941 29.9535 76.5509 29.7522 76.1842 29.3495C75.8215 28.9469 75.6399 28.4624 75.6399 27.8961V23.0845C75.6399 22.7129 75.5213 22.3966 75.2835 22.1355C75.0456 21.8745 74.7573 21.7439 74.4188 21.7439V27.8961C74.4188 28.9978 74.8259 29.8982 75.6399 30.5972C76.1842 31.0574 76.8089 31.2874 77.5141 31.2874ZM91.1889 31.2874V21.7439C90.8499 21.7439 90.5621 21.8745 90.3242 22.1355C90.2237 22.2506 90.1427 22.381 90.0823 22.527L90.0704 22.5204L86.3525 29.1571L82.6285 22.5204L82.6223 22.527C82.5619 22.381 82.4794 22.2506 82.3746 22.1355C82.1368 21.8745 81.8505 21.7439 81.5162 21.7439V31.2874C81.8505 31.2874 82.1368 31.1569 82.3746 30.8959C82.6125 30.6349 82.7311 30.3207 82.7311 29.9535V25.2614L85.3667 29.9535C85.4554 30.1083 85.5622 30.2366 85.6876 30.3384C85.8888 30.4933 86.1106 30.5773 86.3525 30.5906C86.594 30.5773 86.8137 30.4933 87.0113 30.3384C87.1403 30.2366 87.2491 30.1083 87.3379 29.9535L89.9673 25.2614V29.9535C89.9673 30.3207 90.0864 30.6349 90.3242 30.8959C90.5621 31.1569 90.8499 31.2874 91.1889 31.2874ZM88.5228 21.8435V21.8236H88.5104L88.5228 21.8435ZM92.0952 31.2874C92.43 31.2874 92.7164 31.1569 92.9542 30.8959C93.1956 30.6304 93.3168 30.314 93.3168 29.9468V23.0779H96.5446C96.9114 23.0779 97.2241 23.2217 97.482 23.5093C97.744 23.7924 97.8751 24.1376 97.8751 24.5446C97.8751 24.9472 97.744 25.2924 97.482 25.5799C97.2241 25.8631 96.9114 26.0047 96.5446 26.0047H95.3839C95.0455 26.0047 94.7577 26.1352 94.5198 26.3962C94.282 26.6573 94.1629 26.9736 94.1629 27.3453H96.5446C97.2504 27.3453 97.8508 27.071 98.3466 26.5223C98.846 25.9737 99.0962 25.3144 99.0962 24.5446C99.0962 23.7704 98.846 23.1089 98.3466 22.5602C97.8467 22.0116 97.2462 21.7373 96.5446 21.7373H92.0952V31.2874ZM103.83 26.4294C104.164 26.4294 104.45 26.2989 104.688 26.0379C104.926 25.7768 105.045 25.4604 105.045 25.0888H102.711C102.377 25.0888 102.09 25.2194 101.853 25.4804C101.615 25.7414 101.496 26.0578 101.496 26.4294H103.83ZM105.788 31.2874H100.051H100.003V21.7439H105.788C105.788 22.1112 105.669 22.4253 105.432 22.6864C105.194 22.9474 104.907 23.0779 104.573 23.0779H101.224V29.9468H104.573C104.907 29.9468 105.194 30.0774 105.432 30.3384C105.669 30.5995 105.788 30.9158 105.788 31.2874ZM110.008 31.2874V23.0779H106.701C106.701 22.7107 106.82 22.3966 107.058 22.1355C107.295 21.8745 107.584 21.7439 107.922 21.7439H114.536C114.536 22.1112 114.415 22.4253 114.173 22.6864C113.935 22.9474 113.649 23.0779 113.315 23.0779H111.229V29.9468C111.229 30.3185 111.11 30.6349 110.873 30.8959C110.635 31.1569 110.346 31.2874 110.008 31.2874ZM119.269 26.4294C119.604 26.4294 119.89 26.2989 120.128 26.0379C120.366 25.7768 120.485 25.4604 120.485 25.0888H118.151C117.817 25.0888 117.53 25.2194 117.293 25.4804C117.055 25.7414 116.936 26.0578 116.936 26.4294H119.269ZM121.228 31.2874H115.491H115.443V21.7439H121.228C121.228 22.1112 121.109 22.4253 120.872 22.6864C120.634 22.9474 120.348 23.0779 120.013 23.0779H116.664V29.9468H120.013C120.348 29.9468 120.634 30.0774 120.872 30.3384C121.109 30.5995 121.228 30.9158 121.228 31.2874ZM128.543 31.2941C128.434 31.2941 128.273 31.2609 128.059 31.1945C127.85 31.1282 127.656 30.9313 127.479 30.6039L125.817 27.3453H124.208C124.208 26.978 124.328 26.6639 124.565 26.4029C124.803 26.1419 125.091 26.0113 125.43 26.0113H126.591C126.957 26.0113 127.27 25.8697 127.527 25.5866C127.79 25.299 127.921 24.9517 127.921 24.5446C127.921 24.142 127.79 23.7991 127.527 23.5159C127.27 23.2283 126.957 23.0845 126.591 23.0845H123.362V29.9535C123.362 30.3207 123.241 30.6349 123 30.8959C122.762 31.1569 122.476 31.2874 122.141 31.2874V21.7439H126.591C127.292 21.7439 127.892 22.0183 128.392 22.5669C128.892 23.1155 129.142 23.7748 129.142 24.5446C129.142 25.3189 128.892 25.9803 128.392 26.529C128.054 26.8962 127.647 27.144 127.171 27.2723L129.142 31.1215C128.944 31.2366 128.744 31.2941 128.543 31.2941Z"
                                fill="white"/>
                            <path fill-rule="evenodd" clip-rule="evenodd"
                                  d="M23.2701 15.6932C23.1606 15.6871 23.0513 15.7071 22.9495 15.7518C22.8477 15.7964 22.756 15.8647 22.6805 15.952C22.6051 16.0392 22.5478 16.1433 22.5125 16.2571C22.4772 16.3709 22.4647 16.4918 22.476 16.6114V29.3242H16.7586V24.159C16.7655 23.9366 16.6961 23.7195 16.5642 23.5504C16.4323 23.3813 16.2475 23.2726 16.0461 23.2456H11.9083C11.6875 23.2544 11.4776 23.3526 11.319 23.5214C11.1604 23.6901 11.0645 23.9173 11.0498 24.159V29.3101H5.41398V17.0681C5.41796 16.9503 5.40052 16.8328 5.36255 16.7225C5.32463 16.6122 5.26696 16.5113 5.19298 16.4258C5.11901 16.3403 5.03022 16.2718 4.93181 16.2245C4.83339 16.1771 4.72735 16.1518 4.61989 16.1499C4.51061 16.1447 4.40156 16.1652 4.30014 16.2101C4.19872 16.255 4.10728 16.3233 4.032 16.4104C3.95671 16.4974 3.89935 16.6012 3.86378 16.7147C3.82821 16.8282 3.81524 16.9487 3.82579 17.0681V30.346C3.8212 30.4651 3.83814 30.5841 3.87562 30.696C3.9131 30.8079 3.9704 30.9106 4.04421 30.9981C4.11801 31.0856 4.20687 31.1563 4.30567 31.2059C4.40447 31.2557 4.51126 31.2834 4.61989 31.2877H11.9169C12.1217 31.2583 12.3087 31.1447 12.4401 30.97C12.5716 30.7951 12.6377 30.5722 12.6251 30.346V25.0772H15.1662V30.3413C15.1747 30.588 15.2678 30.8222 15.427 30.9968C15.5862 31.1715 15.7996 31.2736 16.0246 31.283H23.2486C23.4625 31.258 23.6608 31.1488 23.8068 30.9756C23.9528 30.8024 24.0366 30.577 24.0427 30.3413V16.6114C24.0461 16.4937 24.0282 16.3765 23.9901 16.2665C23.9519 16.1565 23.8943 16.0559 23.8204 15.9705C23.7466 15.8851 23.658 15.8166 23.5598 15.769C23.4617 15.7214 23.3559 15.6956 23.2486 15.6932H23.2701ZM4.6113 2.29293C4.83577 2.32688 5.0389 2.45681 5.17637 2.65439C5.3139 2.85195 5.37462 3.10114 5.34527 3.34762V10.3397L13.3376 1.04518C13.4109 0.937991 13.5062 0.85138 13.616 0.79245C13.7256 0.733521 13.8465 0.703952 13.9686 0.706171C14.0676 0.716444 14.1629 0.752586 14.2465 0.811568C14.3302 0.870551 14.3997 0.950658 14.4493 1.04518C19.1237 6.42227 22.3773 10.1984 27.6182 16.3807C27.7721 16.569 27.8571 16.8129 27.8571 17.0657C27.8571 17.3186 27.7721 17.5625 27.6182 17.7508C27.4607 17.8903 27.2667 17.9711 27.0645 17.9816C26.859 17.9945 26.6571 17.9183 26.5022 17.7696L13.9643 3.01332L1.34913 17.539C1.29212 17.6443 1.21108 17.7316 1.114 17.7923C1.01692 17.8529 0.907116 17.8848 0.795399 17.8848C0.683681 17.8848 0.573883 17.8529 0.476803 17.7923C0.379722 17.7316 0.298708 17.6443 0.241699 17.539C0.161318 17.4737 0.0971688 17.3873 0.0551669 17.2877C0.0131652 17.1882 -0.00534084 17.0787 0.00132932 16.9692C0.00858345 16.7169 0.0932796 16.4747 0.241699 16.2818L3.87302 12.0442V3.34762C3.84371 3.10114 3.90441 2.85195 4.0419 2.65439C4.1794 2.45681 4.38253 2.32688 4.607 2.29293H4.6113Z"
                                  fill="white"/>
                            <path
                                d="M129.226 16.5635H27.0834C26.656 16.5635 26.3096 16.9438 26.3096 17.413C26.3096 17.8821 26.656 18.2625 27.0834 18.2625H129.226C129.654 18.2625 130 17.8821 130 17.413C130 16.9438 129.654 16.5635 129.226 16.5635Z"
                                fill="white"/>
                        </svg>
                        <h1 className="dashboard-title">Tenant Dashboard</h1>
                    </div>
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
                        <Offcanvas.Title>Tenant Dashboard</Offcanvas.Title>
                    </Offcanvas.Header>
                    <Offcanvas.Body>
                        <div className="nav-container">
                            <Nav.Link
                                onClick={() => navigate("/tenant/see-agreement")}
                            >
                                See Agreement
                            </Nav.Link>
                        </div>
                        <button className="logout-button" onClick={logout}>
                            Log out
                        </button>
                    </Offcanvas.Body>
                </Offcanvas>
                {/* Property block */}
                <div className="properties-container">
                    <h1 className="dashboard-label">Property</h1>
                    <table className="dashboard-table">
                        <thead className="dashboard-header">
                        <tr>
                            <th>Name</th>
                            <th>Address</th>
                            <th>Owner</th>
                        </tr>
                        </thead>

                        <tbody>
                        {isLoading ? (
                            <tr>
                                <td colSpan={2}>Loading Properties...</td>
                            </tr>
                        ) : Array.isArray(properties) &&
                        properties.length > 0 ? (
                            properties.map((userProperty) => (
                                <tr key={userProperty.name}>
                                    <td>{userProperty.name}</td>
                                    <td>{userProperty.streetAddress}</td>
                                    <td>
                                        <div className="between-flex">
                                            {userProperty.owner}

                                            <Button
                                                className="standard-button"
                                                onClick={() => {
                                                    setShowOwnerContact(true);
                                                }}
                                            >
                                                Contact Information
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={2}>
                                    You haven't added any properties yet. Start
                                    by adding a property!
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>

                {ownerContact && (
                    <OwnerContactModal
                        show={showOwnerContact}
                        ownerContact={ownerContact}
                        handleClose={() => {
                            setShowOwnerContact(false);
                        }}
                    />
                )}

                {/* Service Request block */}
                <div className="service-container">
                    <h1 className="dashboard-label">Service Requests</h1>

                    <Accordion defaultActiveKey="0" style={{paddingTop: "1rem"}}>
                        <Accordion.Item eventKey="0">
                            <Accordion.Header>Active</Accordion.Header>
                            <Accordion.Body>
                                <table className="dashboard-table">
                                    <thead className="dashboard-header">
                                    <tr>
                                        <th className="dashboard-header">
                                            Service
                                        </th>
                                        <th>
                                            <div className="centered-column">
                                                Request Date
                                            </div>
                                        </th>
                                        <th>
                                            <div className="centered-column">
                                                Status
                                            </div>
                                        </th>
                                        <th>
                                            <div className="centered-column">
                                                Actions
                                            </div>
                                        </th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {isLoading ? (
                                        <tr>
                                            <td colSpan={4}>
                                                Loading Service Requests...
                                            </td>
                                        </tr>
                                    ) : Array.isArray(tickets) &&
                                    tickets.length > 0 ? (
                                        tickets
                                            .filter(
                                                (t) =>
                                                    ![
                                                        "withdrawn",
                                                        "rejected",
                                                        "completed",
                                                    ].includes(t.status),
                                            )
                                            .map((userTicket) => (
                                                <tr key={userTicket.id}>
                                                    <td>
                                                        {
                                                            userTicket
                                                                .serviceType
                                                                .serviceType
                                                        }
                                                    </td>
                                                    <td>
                                                        <div className="centered-column">
                                                            {userTicket.createdAt.substring(
                                                                0,
                                                                10,
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div className="centered-column">
                                                            {userTicket.job
                                                                ?.activityStatus ? (
                                                                <Badge
                                                                    pill
                                                                    bg="primary"
                                                                >
                                                                    {
                                                                        userTicket
                                                                            .job
                                                                            .activityStatus
                                                                    }
                                                                </Badge>
                                                            ) : (
                                                                <Badge
                                                                    pill
                                                                    bg="warning"
                                                                >
                                                                    {
                                                                        userTicket.status
                                                                    }
                                                                </Badge>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <button
                                                            className="delete-button"
                                                            onClick={() =>
                                                                handleTicketDetailClick(
                                                                    userTicket.id,
                                                                )
                                                            }
                                                        >
                                                            Details
                                                        </button>
                                                        {userTicket.status ===
                                                            "requested" && (
                                                                <button
                                                                    className="delete-button"
                                                                    style={{
                                                                        background:
                                                                            "maroon",
                                                                    }}
                                                                    onClick={() =>
                                                                        handleWithdrawClick(
                                                                            userTicket.id,
                                                                        )
                                                                    }
                                                                >
                                                                    Withdraw
                                                                </button>
                                                            )}
                                                    </td>
                                                </tr>
                                            ))
                                    ) : (
                                        <tr>
                                            <td colSpan={4}>
                                                You don't have any service
                                                requests yet. Start by
                                                requesting a service!
                                            </td>
                                        </tr>
                                    )}

                                    <tr>
                                        <td
                                            className="dashboard-empty-service"
                                            colSpan={4}
                                        >
                                            <button
                                                className="request-service-button"
                                                onClick={() => {
                                                    navigate("/request-service");
                                                }}
                                            >
                                                {" "}
                                                Request a Service
                                            </button>
                                        </td>
                                    </tr>
                                    </tbody>
                                </table>
                            </Accordion.Body>
                        </Accordion.Item>
                    </Accordion>

                    <Accordion style={{paddingTop: "1rem"}}>
                        <Accordion.Item eventKey="0">
                            <Accordion.Header>Completed</Accordion.Header>
                            <Accordion.Body>
                                <table className="dashboard-table">
                                    <thead className="dashboard-header">
                                    <tr>
                                        <th className="dashboard-header">
                                            Service
                                        </th>
                                        <th>Property</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {isLoading ? (
                                        <tr>
                                            <td colSpan={4}>
                                                Loading Service Requests...
                                            </td>
                                        </tr>
                                    ) : Array.isArray(tickets) &&
                                    tickets.length > 0 ? (
                                        tickets
                                            .filter((t) =>
                                                [
                                                    "withdrawn",
                                                    "rejected",
                                                    "completed",
                                                ].includes(t.status),
                                            )
                                            .map((userTicket) => (
                                                <tr key={userTicket.id}>
                                                    <td>
                                                        {
                                                            userTicket
                                                                .serviceType
                                                                .serviceType
                                                        }
                                                    </td>
                                                    <td>
                                                        {
                                                            userTicket.property
                                                                .streetAddress
                                                        }
                                                    </td>
                                                    <td>
                                                        <div className="centered-column">
                                                        {userTicket.status ==
                                                        "completed" ? (
                                                            <Badge
                                                                pill
                                                                bg="success"
                                                            >
                                                                {
                                                                    userTicket.status
                                                                }
                                                            </Badge>
                                                        ) : (
                                                            <Badge
                                                                pill
                                                                bg="danger"
                                                            >
                                                                {
                                                                    userTicket.status
                                                                }
                                                            </Badge>
                                                        )}
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <button
                                                            className="delete-button"
                                                            onClick={() =>
                                                                handleTicketDetailClick(
                                                                    userTicket.id,
                                                                )
                                                            }
                                                        >
                                                            Details
                                                        </button>
                                                        {userTicket.status ===
                                                            "requested" && (
                                                                <button
                                                                    className="delete-button"
                                                                    style={{
                                                                        background:
                                                                            "maroon",
                                                                    }}
                                                                    onClick={() =>
                                                                        handleWithdrawClick(
                                                                            userTicket.id,
                                                                        )
                                                                    }
                                                                >
                                                                    Withdraw
                                                                </button>
                                                            )}
                                                    </td>
                                                </tr>
                                            ))
                                    ) : (
                                        <tr>
                                            <td colSpan={4}>
                                                You don't have any service
                                                requests yet. Start by
                                                requesting a service!
                                            </td>
                                        </tr>
                                    )}
                                    </tbody>
                                </table>
                            </Accordion.Body>
                        </Accordion.Item>
                    </Accordion>
                </div>

                {/* Show more detail about property Popup */}
                <Modal show={showTicketDetail} onHide={handleCloseTicketDetail}>
                    <Modal.Header closeButton>
                        <Modal.Title>Service Request Details</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <table className="property-detail-table">
                            <tbody>
                            {ticketDetail != null ? (
                                <>
                                    {ticketDetail.activityStatus && (
                                        <tr>
                                            <td>Activity Status:</td>
                                            <td>
                                                {ticketDetail.activityStatus}
                                            </td>
                                        </tr>
                                    )}
                                    <tr>
                                        <td>Service Type:</td>
                                        <td>
                                            {
                                                ticketDetail.serviceType
                                                    .serviceType
                                            }
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Property Name:</td>
                                        <td>{ticketDetail.property.name}</td>
                                    </tr>
                                    <tr>
                                        <td>Address:</td>
                                        <td>
                                            {
                                                ticketDetail.property
                                                    .streetAddress
                                            }
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Request Date:</td>
                                        <td>{ticketDetail.createdAt}</td>
                                    </tr>
                                    <tr>
                                        <td>Request Timeline:</td>
                                        <td>{ticketDetail.timeline.title}</td>
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
                        <button
                            className="delete-button"
                            onClick={handleCloseTicketDetail}
                        >
                            Close
                        </button>
                    </Modal.Footer>
                </Modal>
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
            <Homie propertyId={propertyID}/>
        </div>
    );
}

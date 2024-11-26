import { Button } from "react-bootstrap";
import { ServiceProvider } from "../types";

interface RequestQuoteTableProps {
    isLoading: boolean;
    serviceProviders: ServiceProvider[];
    handleSubmitRequest: (sp: ServiceProvider) => void;
}

export function RequestQuoteTable(props: RequestQuoteTableProps) {
    return (
        <table className="dashboard-table">
            <thead className="dashboard-header">
                <th>Service Provider</th>

                <th>Availability</th>

                <th>Standard Rate</th>

                <th>Address</th>

                <th>Radius of Operation</th>

                <th>Actions</th>
            </thead>

            <tbody>
                {Array.isArray(props.serviceProviders) &&
                props.serviceProviders.length > 0 ? (
                    props.serviceProviders.map((sp) => (
                        <tr>
                            <td>{sp.spDetail.company}</td>
                            <td>
                                {sp.spDetail.isPublic ? "Public" : "Private"}
                            </td>
                            <td>${sp.spDetail.perHourRate}/hr</td>
                            <td>{sp.spDetail.address}</td>
                            <td>{sp.spDetail.distanceCovered} Miles</td>
                            <td>
                                <Button
                                    className="standard-button"
                                    onClick={() => {
                                        props.handleSubmitRequest(sp);
                                    }}
                                >
                                    Request Quote
                                </Button>
                            </td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan={6}>
                            No Available Service Providers Found!
                        </td>
                    </tr>
                )}
            </tbody>
        </table>
    );
}

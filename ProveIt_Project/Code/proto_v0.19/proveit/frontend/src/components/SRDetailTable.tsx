import { RequestDetails } from "../types";

interface SRDetailTableProps {
    requestDetails: RequestDetails | null;
}

export function SRDetailTable(props: SRDetailTableProps) {
    return (
        <table className="dashboard-table">
            <thead className="dashboard-header">
                <th>Requested Service</th>
                <th>Address</th>
                <th>Request Date</th>
                <th>Requested Timeline</th>
                <th>Details</th>
            </thead>

            <tbody>
                <tr>
                    <td>{props.requestDetails?.serviceType?.serviceType}</td>

                    <td>{props.requestDetails?.property?.streetAddress}</td>

                    <td>{props.requestDetails?.createdAt}</td>

                    <td>{props.requestDetails?.timeline.title}</td>

                    <td>{props.requestDetails?.detail}</td>
                </tr>
            </tbody>
        </table>
    );
}

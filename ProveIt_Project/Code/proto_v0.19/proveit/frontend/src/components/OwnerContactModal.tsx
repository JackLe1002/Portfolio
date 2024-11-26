import { Button, Modal } from "react-bootstrap";
import { ContactInfo } from "../types";

interface OwnerContactModalProps {
    show: boolean;
    handleClose: () => void;
    ownerContact: ContactInfo;
}

export function OwnerContactModal(props: OwnerContactModalProps) {
    return (
        <Modal show={props.show}>
            <Modal.Header>Homeowner Contact Info</Modal.Header>

            <Modal.Body>
                <table className="property-detail-table">
                    <tbody>
                        <tr>
                            <td>Name:</td>

                            <td>{props.ownerContact.name}</td>
                        </tr>

                        <tr>
                            <td>Email:</td>

                            <td>{props.ownerContact.email}</td>
                        </tr>

                        <tr>
                            <td>Phone:</td>

                            <td>{props.ownerContact.phone}</td>
                        </tr>
                    </tbody>
                </table>
            </Modal.Body>

            <Modal.Footer>
                <Button className="standard-button" onClick={props.handleClose}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

import Form from "react-bootstrap/Form";
import React from "react";

interface FormGroupProps {
    label: string;
    type?: string; // Made optional with a default value
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    className?: string; // Added optional className prop
}

export function FormGroup({
    label,
    type = "text",
    value,
    onChange,
    className = "", // Default to empty string if not provided
}: FormGroupProps) {
    return (
        <Form.Group
            className={`mb-3 ${className}`}
            controlId={`formGroup${label.replace(/\s+/g, "")}`}
        >
            <Form.Label>{label}</Form.Label>
            <Form.Control
                type={type}
                placeholder={`Enter ${label}`}
                value={value}
                onChange={onChange}
                className={className} // Apply the className here if needed
            />
        </Form.Group>
    );
}

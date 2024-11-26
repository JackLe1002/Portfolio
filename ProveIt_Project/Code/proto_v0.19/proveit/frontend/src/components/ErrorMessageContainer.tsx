// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import React from "react";
interface ErrorMessageProps {
    message: string;
}

export default function ErrorMessageContainer(props: ErrorMessageProps) {
    return <div className="error">{props.message}</div>;
}

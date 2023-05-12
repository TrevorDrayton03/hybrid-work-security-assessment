import React from "react";
import { Spinner } from "react-bootstrap";

const FeedbackMessage = ({ appStatus }) => {
    return (
        <div>
            {appStatus === "running" && (
                <p>
                    <em>
                        <Spinner animation="grow" role="status" size="sm" />
                        &nbsp;Please wait...
                    </em>
                </p>
            )}
            {appStatus === "error" && (
                <p>
                    <em>Completed with error.</em>
                </p>
            )}
            {appStatus === "completed" && (
                <p>
                    <em>Completed without error.</em>
                </p>
            )}
        </div>
    );
};

export default FeedbackMessage;

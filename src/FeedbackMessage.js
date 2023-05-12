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
                    <b>
                        Completed with an error.
                    </b>
                </p>
            )}
            {appStatus === "completed" && (
                <p>
                    <b>
                        Completed successfully.
                    </b>
                </p>
            )}
        </div>
    );
};

export default FeedbackMessage;

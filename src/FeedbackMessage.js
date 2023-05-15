import React from "react";
import { Spinner } from "react-bootstrap";

const FeedbackMessage = ({ appStatus }) => {
    return (
        <div>
            {appStatus === "running" && (
                <p>
                    <em>
                        <Spinner animation="grow" role="status" size="sm" />
                        &nbsp;
                        Please standby...
                    </em>
                </p>
            )}
            {appStatus === "error" && (
                <p>
                    {/* <b> */}
                    <em>
                        Completed with an error.
                    </em>

                    {/* </b> */}
                </p>
            )}
            {appStatus === "completed" && (
                <p>
                    {/* <b> */}
                    <em>
                        Completed successfully.
                    </em>
                    {/* </b> */}
                </p>
            )}
        </div>
    );
};

export default FeedbackMessage;

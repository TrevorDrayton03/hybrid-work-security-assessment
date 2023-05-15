import React from "react";
import { Spinner } from "react-bootstrap";

const FeedbackMessage = ({ appStatus }) => {
    return (
        <div style={{ paddingBottom: '10px' }}>
            {appStatus === "running" && (
                <div>
                    <em>
                        <Spinner animation="grow" role="status" size="sm" />
                        &nbsp;
                        Please standby...
                    </em>
                </div>
            )}
            {appStatus === "error" && (
                <div>
                    <em>
                        Completed with the following error:
                    </em>
                </div>
            )}
            {appStatus === "completed" && (
                null
                // <div>
                //     <em>
                //         Completed successfully.
                //     </em>
                // </div>
            )}
        </div>
    );
};

export default FeedbackMessage;

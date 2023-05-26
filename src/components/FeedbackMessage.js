import React from "react"
import { Spinner } from "react-bootstrap"

/**
 * Displays a feedback message based on the application status.
 */
const FeedbackMessage = ({ appStatus }) => {
    return (
        <div style={{ paddingBottom: appStatus === 'completed' ? '5px' : '15px' }}>
            {appStatus === "running" && (
                null
                // <div>
                //     <em>
                //         <Spinner animation="grow" role="status" size="sm" />
                //         &nbsp
                //         Please standby...
                //     </em>
                // </div>
            )}
            {appStatus === "error" && (
                <div>
                    <em>
                        Your device does not meet the following security requirement:
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
    )
}

export default FeedbackMessage
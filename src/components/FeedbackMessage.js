import React from "react"

/**
 * Displays a feedback message based on the application status.
 * @param {string} appStatus - The application status.
 */
const FeedbackMessage = ({ appStatus }) => {
    return (
        <div style={{ paddingBottom: appStatus === 'completed' ? '5px' : '15px' }}>
            {appStatus === "running" && (
                // null
                <div>
                    <em>
                        Please standby, this may take a few minutes.
                    </em>
                </div>
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

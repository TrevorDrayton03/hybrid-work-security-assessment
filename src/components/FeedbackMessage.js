import React from "react"

/**
 * Displays a feedback message based on the application status.
 * @param {string} appStatus - The application status.
 */
const FeedbackMessage = ({ appStatus }) => {
    return (
        <div style={{ paddingBottom: appStatus === 'completed' ? '5px' : '15px' }}>
            {appStatus === "idle" && (
                // null
                <div>
                    <em>
                        Press the start button to begin your assessment.
                    </em>
                </div>
            )}
            {appStatus === "running" && (
                null
                // <div>
                //     <em>
                //         Please standby, this may take a few minutes.
                //     </em>
                // </div>
            )}
            {appStatus === "error" && (
                <div>
                    <em>
                        You did not pass the assessment due to the following security requirement:
                    </em>
                </div>
            )}
            {appStatus === "completed" && (
                null
                // <div>
                //     <em>
                //         Your assessment has completed.
                //     </em>
                // </div>
            )}
        </div>
    )
}

export default FeedbackMessage

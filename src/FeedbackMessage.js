import React from "react"

const FeedbackMessage = ({ appStatus }) => {
    return (
        <div>
            {
                appStatus === "running" &&
                <p>
                    <em>
                        Please wait... analyzing your system.
                    </em>
                </p>
            }
            {
                appStatus === "error" &&
                <p>
                    Found a missing requirement.
                </p>
            }
            {
                appStatus === "completed" &&
                <p>
                    Completed successfully without errors.
                </p>
            }

        </div>
    )
}

export default FeedbackMessage
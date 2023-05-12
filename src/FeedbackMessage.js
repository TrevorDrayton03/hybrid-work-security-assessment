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
                    <em>
                        Completed with errors.
                    </em>
                </p>
            }
            {
                appStatus === "completed" &&
                <p>
                    <em>
                        Completed without errors.
                    </em>
                </p>
            }

        </div>
    )
}

export default FeedbackMessage
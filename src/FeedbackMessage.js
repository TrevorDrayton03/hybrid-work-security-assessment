import React, { useState, useEffect } from "react"

const FeedbackMessage = ({ appStatus }) => {
    return (
        <div>
            {
                appStatus === "running" &&
                <p>
                    Please wait... analyzing your system.
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
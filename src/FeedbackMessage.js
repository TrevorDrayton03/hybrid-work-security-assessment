import React, { useState, useEffect } from "react"

const FeedbackMessage = ({ status }) => {
    return (
        <div>
            {
                status === "running" &&
                <p>
                    Please wait... analyzing your system.
                </p>
            }
            {
                status === "error" &&
                <p>
                    Found a missing requirement.
                </p>
            }
            {
                status === "completed" &&
                <p>
                    Completed successfully without errors.
                </p>
            }

        </div>
    )
}

export default FeedbackMessage
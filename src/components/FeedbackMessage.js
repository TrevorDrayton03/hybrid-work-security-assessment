import React from "react"

/**
 * Displays a feedback message based on the application status.
 * @param {string} appStatus - The application status.
 */
// if endPathLength is not null then there is a concrete path to the last rule
const FeedbackMessage = ({ appStatus, ruleList, endPathLength }) => {
    let failedRulesCount = ruleList.filter(rule => rule.responseStatus !== 200).length
    let passedRulesCount = ruleList.filter(rule => rule.responseStatus === 200).length
    let totalRulesCount = ruleList.length

    // goal is "You have completed with X error and Y warning"

    return (
        <div style={{ paddingBottom: appStatus === 'completed' || appStatus === 'paused' ? 0 : '15px' }}>
            {appStatus === "idle" && (
                <div>
                    <p>
                        This application will assess your computer's security settings against Thompson River University's network security requirements. &nbsp;
                    </p>
                    <p>
                        <em>
                            Press the start button to begin your assessment.
                        </em>
                    </p>
                </div>
            )}
            {appStatus === "running" && (
                null
            )}
            {appStatus === "error" && (
                <div>
                    <em>
                        You did not pass the following security check(s):
                    </em>
                </div>
            )}
            {appStatus === "completed" && (
                <div>
                    <p>
                        Your assessment is complete. &nbsp;
                        <em>
                            {endPathLength !== null ? "You passed " + passedRulesCount + "/" + endPathLength + " security check(s). ": null} 
                        </em>
                    </p>
                </div>
            )}
            {appStatus === "paused" && (
                <div>
                    <p>
                        {endPathLength !== null ? "You passed " + passedRulesCount + "/" + endPathLength + " security check(s). ": null} 
                        <em>
                            You did not pass the following security check(s):
                        </em>
                    </p>
                </div>
            )}
        </div>
    )
}

export default FeedbackMessage

import React from "react"

/**
 * Displays a feedback message based on the application status.
 * @param {string} appStatus - The application status.
 */
// if endPathLength is not null then there is a concrete path to the last rule
const FeedbackMessage = ({ appStatus, ruleList, endPathLength, isLastRule }) => {
    let failedRulesCount = ruleList.filter(rule => rule.responseStatus !== 200).length
    let passedRulesCount = ruleList.filter(rule => rule.responseStatus === 200).length
    let totalRulesCount = ruleList.length

    return (
        <div style={{ paddingBottom: appStatus === 'completed' || appStatus === 'paused' ? 0 : '15px' }}>
            {appStatus === "idle" && (
                <div>
                    <em>
                        Press the start button to begin your assessment.
                    </em>
                </div>
            )}
            {appStatus === "running" && (
                null
            )}
            {appStatus === "error" && (
                <div>
                    <em>
                    {/* {endPathLength !== null ? "You passed " + X + "/" + Y + " security check(s). ": null}  */}
                    {/* {endPathLength !== null ? "You failed the following " + (Y-X) + " security check(s): " : "You failed the following security check(s): "} */}
                    You failed the following security check(s):
                    </em>
                </div>
            )}
            {appStatus === "completed" && (
                <div>
                    <em>
                        {endPathLength !== null ? "You passed " + passedRulesCount + "/" + endPathLength + " security check(s). ": null} 
                    </em>
                </div>
                // if completed without errors
                    // null
                // if completed with errors
                    // You completed the X out of Y security checks with (Y-X) errors. Please review the errors below.
            )}
            {appStatus === "paused" && (
                <div>
                    <p>
                    {endPathLength !== null ? "You passed " + passedRulesCount + "/" + endPathLength + " security check(s). ": null} 
                        <em>
                            {/* {endPathLength !== null ? "You failed the following " + (endPathLength-X) + " security check(s): " : "You failed the following security check(s): "}                     */}
                            You failed the following security check(s):
                        </em>
                    </p>
                </div>
            )}
        </div>
    )
}

export default FeedbackMessage

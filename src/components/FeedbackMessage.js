import React from "react"

/**
 * Displays a feedback message based on the application status.
 * @param {string} appStatus - The application status.
 */
// if endPathLength is not null then a one-way path to a final rule exists
const FeedbackMessage = ({ appStatus, ruleList, endPathLength }) => {
    let failed = ruleList.filter(rule => rule.responseStatus !== 200).length
    let passed = ruleList.filter(rule => rule.responseStatus === 200).length
    let warnings = ruleList.filter(rule => rule.responseStatus !== 200 && rule.warning === true).length
    let errors = ruleList.filter(rule => rule.responseStatus !== 200 && rule.warning !== true).length
    let total = passed + errors // warnings are not counted in the total

    let errorText = errors === 1 ? "error" : "errors"
    let warningText = warnings === 1 ? "warning" : "warnings"

    return (
        <div style={{ paddingBottom: appStatus === 'completed' || appStatus === 'paused' ? 0 : '15px' }}>
            {appStatus === "idle" && (
                <div>
                    <p style={{marginBottom:0}}>
                        <em>
                            Press the start button to begin your assessment.
                        </em>
                    </p>
                    <p style={{marginBottom:0}}>
                        This application will assess your computer's security settings against Thompson River University's network security requirements. &nbsp;
                    </p>
                </div>
            )}
            {appStatus === "running" && (
                null
            )}
            {appStatus === "error" && (
                <div>
                    <p style={{marginBottom:0}}>
                        <em>
                            You must resolve the check at the top of the list to continue the assessment.
                        </em>
                    </p> 
                    <p style={{marginBottom:0}}>
                        You did not pass the security check(s) listed below.
                    </p>
                </div>
            )}
            {appStatus === "completed" && (
                <div>
                    {errors > 0 && 
                    <p style={{marginBottom:0}}>
                        <em>
                            You must resolve the {errorText} to connect to the TRU network.
                        </em>
                    </p>
                    }
                    <p style={{marginBottom:0}}>
                        Your assessment is <b>complete</b> with <span className="errors">{errors} {errorText}</span> and <span className="warnings">{warnings} {warningText}</span>. &nbsp;
                    </p>
                </div>
            )}
            {/* if it's paused it means we have the option to continue past this rule */}
            {appStatus === "paused" && (
                <div>
                    <p style={{marginBottom:0}}>
                        <em>
                            You may continue the assessment by pressing the "Continue To Next Check" button.
                        </em>
                    </p>
                    <p style={{marginBottom:0}}>
                        {/* messages for warning = true and false */}
                        You did not pass the security check(s) listed below.
                    </p>
                </div>
            )}
        </div>
    )
}

export default FeedbackMessage

import React from "react"
import { failedCount, passedCount, warningsCount, errorsCount } from '../helpers/helpers'


/**
 * Displays a feedback message based on the application status. Guides and informs the user.
 * @param {string} appStatus - The application status.
 * @param {array} ruleList - The list of assessed rules.
 * @param {number} endPathLength - The length of the end path, if it exists.
 */
const FeedbackMessage = ({ appStatus, ruleList, endPathLength }) => {
    let failed = failedCount(ruleList)
    let passed = passedCount(ruleList)
    let warnings = warningsCount(ruleList)
    let errors = errorsCount(ruleList)
    let total = passed + errors + warnings 
    let errorText = errors === 1 ? "error" : "errors"
    let warningText = warnings === 1 ? "warning" : "warnings"
    let isAre = errors === 1 ? "is" : "are"


    return (
        <div style={{ paddingBottom: appStatus === 'completed' || appStatus === 'paused' ? 0 : '15px' }}>
            {appStatus === "idle" && (
                <div>
                    <p style={{marginBottom:0}}>
                        This tool assesses your computer against Thompson River University's network security requirements. &nbsp;
                    </p>
                </div>
            )}
            {appStatus === "running" && (
                null
            )}
            {appStatus === "error" && (
                <div>
                    <p style={{marginBottom:0, fontSize:22}}>
                        You did not pass the security checks listed below.
                    </p>
                    <p style={{marginBottom:5}}>
                        <em>
                            You must resolve the <span className="errors">{errorText}</span>, which {isAre} preventing further security checks from being assessed.
                        </em>
                    </p> 
                </div>
            )}
            {appStatus === "completed" && (
                <div>
                    <p style={{ marginBottom: 0, fontSize:22 }}>
                    {/* Your assessment is <b>complete</b> with {errors > 0 ? <span className="errors">{errors} {errorText}</span> : errors + " " + errorText} and {warnings > 0 ? <span className="warnings">{warnings} {warningText}</span> : warnings + " " + warningText}. */}
                        Assessment is completed with {errors + ' ' + errorText} and {warnings + ' ' + warningText}, and a total of {total} security checks assessed.
                    </p>
                    {errors > 0 && 
                    <p style={{marginBottom:5}}>
                        <em>
                            {/* You must resolve the {errorText} to connect to the TRU network. */}
                            You must resolve the <span className="errors">{errorText}</span> to connect to the TRU network.
                        </em>
                    </p>
                    }
                </div>
            )}
            {appStatus === "paused" && (
                <div>
                    <p style={{marginBottom:0, fontSize:22 }}>
                        {/* messages for warning = true and false */}
                        You did not pass the security checks listed below.
                    </p>
                    {/* <p style={{marginBottom:5}}>
                        <em>
                            Continue the assessment by pressing the Continue button.
                        </em>
                    </p> */}
                </div>
            )}
        </div>
    )
}

export default FeedbackMessage

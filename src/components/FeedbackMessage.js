import React from "react"
import { failedCount, passedCount, warningsCount, errorsCount } from '../helpers/helpers'


/**
 * Displays a feedback message which informs the user based on the application state.
 * @param {string} appStatus - idle, running, completed, error, or paused.
 * @param {array} ruleList - Array, evaluated instructions in sequence.
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
                        This tool assesses your device's compliance with Thompson River University's network security requirements. &nbsp;
                    </p>
                </div>
            )}
            {appStatus === "running" && (
                null
            )}
            {appStatus === "error" && (
                <div>
                    <p style={{marginBottom:0, fontSize:22}}>
                        Your device did not pass the security checks listed below. You must resolve the <span className="errors">{errorText}</span> to continue.
                    </p>
                </div>
            )}
            {appStatus === "completed" && (
                <div>
                    <p style={{ marginBottom: 0, fontSize:22 }}>
                        The assessment has completed with {errors + ' ' + errorText} and {warnings + ' ' + warningText}, and with a total of {total} security checks assessed.
                    </p>
                    {errors > 0 && 
                    <p style={{marginBottom:5}}>
                        <em>
                            You must resolve the <span className="errors">{errorText}</span> to connect to TRU's network.
                        </em>
                    </p>
                    }
                </div>
            )}
            {appStatus === "paused" && (
                <div>
                    <p style={{marginBottom:0, fontSize:22 }}>
                        Your device did not pass the security checks listed below. The assessment has not completed, please continue.
                    </p>
                </div>
            )}
        </div>
    )
}

export default FeedbackMessage

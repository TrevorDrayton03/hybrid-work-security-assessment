import React from "react"
import ProgressBar from 'react-bootstrap/ProgressBar'
import { Spinner } from "react-bootstrap"


/**
 * Displays the progress indicator for the current rule.
 * @param {number} progressPercentage - The progress percentage.
 * @param {object} currentRule - The current rule.
 */
const ProgressIndicator = ({ progressPercentage, currentRule, currentRetryRule }) => {
    return (
        <div style={{padding: '0 0 16px 0'}}>
            <span style={{ fontSize: '1.25rem', padding: '20px 0 20px 0', display:'block' }}>
                <Spinner animation="grow" role="status" size="sm" /> &nbsp;
                {currentRetryRule ? currentRetryRule.title : currentRule.title}
            </span>
            <ProgressBar
                // animated
                now={progressPercentage}
                style={{ height: '25px', borderRadius:'15px' }}
            />
        </div>
    )
}

export default ProgressIndicator
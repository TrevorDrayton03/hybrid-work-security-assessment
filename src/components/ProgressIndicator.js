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
        <div style={{paddingTop: '160px'}}>
            <span style={{ fontSize: '1.25rem', padding: '20px 0 20px 0', display:'block' }}>
                <Spinner animation="grow" role="status" size="sm" /> &nbsp;
                {currentRetryRule ? currentRetryRule.title : currentRule.title}
            </span>
            <ProgressBar
                // animated
                now={progressPercentage}
                style={{ height: '25px', borderRadius: '0' }}
            />
        </div>
    )
}

export default ProgressIndicator
import React from "react"
import ProgressBar from 'react-bootstrap/ProgressBar'
import { Spinner } from "react-bootstrap"

/**
 * Displays the progress indicator for the current rule.
 * @param {number} progressPercentage - The progress percentage.
 * @param {object} currentRule - The current rule.
 */
const ProgressIndicator = ({ progressPercentage, currentRule }) => {
    return (
        <div>
            <span style={{ fontSize: '1.25rem', paddingBottom: '20px', display:'block' }}>
                <Spinner animation="grow" role="status" size="sm" /> &nbsp;
                {currentRule.title}
            </span>
            <ProgressBar
                // animated
                now={progressPercentage}
                key={currentRule.key}
                style={{ height: '25px', borderRadius: '0' }}
            />
        </div>
    )
}

export default ProgressIndicator
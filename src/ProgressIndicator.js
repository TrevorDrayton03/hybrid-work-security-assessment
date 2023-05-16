import React from "react"
import ProgressBar from 'react-bootstrap/ProgressBar'
import { Spinner } from "react-bootstrap";

/**
 * Displays the progress indicator for the current rule.
 * 
 */
const ProgressIndicator = ({ progressPercentage, currentRule }) => {
    return (
        <div>
            <p style={{ fontSize: '1.25rem', paddingBottom: '20px' }}>
                <Spinner animation="grow" role="status" size="sm" /> &nbsp;
                {currentRule.title}
            </p>
            <ProgressBar
                // animated
                now={progressPercentage}
                key={currentRule.key}
                className="width-flex"
                style={{ height: '25px', borderRadius: '0' }}
            />
        </div>
    );
}

export default ProgressIndicator
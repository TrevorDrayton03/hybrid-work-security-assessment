import React from "react"
import ProgressBar from 'react-bootstrap/ProgressBar'

const ProgressIndicator = ({ progressPercentage, currentRule }) => {
    return (
        <div>
            <p>
                <b>
                    {currentRule.title} <br />
                </b>
            </p>
            <ProgressBar
                // animated
                now={progressPercentage}
                key={currentRule.key}
                style={{ width: '200px' }}
            />
        </div>
    );
}

export default ProgressIndicator
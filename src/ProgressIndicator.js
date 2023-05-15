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
                style={{ minWidth: '200px', maxWidth: '560px', height: '25px', borderRadius: '0', width: '90vw'}}
            />
        </div>
    );
}

export default ProgressIndicator
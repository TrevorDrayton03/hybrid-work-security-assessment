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
                style={{ width: '250px', height:'25px', borderRadius:'0' }}
            />
        </div>
    );
}

export default ProgressIndicator
import React from "react"
import ProgressBar from 'react-bootstrap/ProgressBar'

// make it continuous by using an interval?

const ProgressIndicator = ({ progressPercentage, currentRule }) => {
    return (
        <div>
            <p>
                <b>
                    {currentRule.title} <br />
                </b>
                {/* {passText} <br />
                        {failText} <br />
                        {passRule} <br />
                        {failRule} */}
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
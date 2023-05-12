import React from "react"
import ProgressBar from 'react-bootstrap/ProgressBar'

// make it continuous by using an interval?

const ProgressIndicator = ({ progressPercentage, currentRule }) => {
    console.log(progressPercentage)
    return (
        <div>
            <p>
                {currentRule.title} <br />
                {/* {passText} <br />
                        {failText} <br />
                        {passRule} <br />
                        {failRule} */}
            </p>
            <ProgressBar
                animated
                now={progressPercentage}
                key={currentRule.key}
            />
        </div>
    );
}

export default ProgressIndicator
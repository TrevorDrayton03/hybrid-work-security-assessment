import React from "react"
import { useState, useEffect } from "react"
import ProgressBar from 'react-bootstrap/ProgressBar'

// make it continuous by using an interval?

const ProgressIndicator = ({ currentRule, tries, handleRuleChange, setRuleArray, ruleArray }) => {
    let progressPercentage = Math.floor((tries / currentRule.maxTries) * 100);

    useEffect(() => {
        if (progressPercentage >= 100) {
            handleRuleChange()
            setRuleArray([...ruleArray, currentRule])
            console.log("Completed!")
        }
    }, [progressPercentage]);

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
import React from "react"
import { useState, useEffect } from "react"
import ProgressBar from 'react-bootstrap/ProgressBar'

// make it continuous by using an interval?

const ProgressIndicator = ({ currentRule, tries, ruleChange, setRuleArray, ruleArray }) => {
    let progressPercentage = Math.floor((tries / currentRule.maxTries) * 100);

    useEffect(() => {
        if (progressPercentage >= 100) {
            ruleChange()
            setRuleArray([currentRule, ...ruleArray])
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
import React, { useState, useEffect } from "react"
import ProgressBar from 'react-bootstrap/ProgressBar'
import rules from './rule_config.json'

const RulePanel = ({ setCurrentRule, setTries, currentRule, setRuleArray, tries, maxTries, title, passText, failText, passRule, failRule }) => {
    // const [progress, setProgress] = useState(0)
    const progressPercentage = Math.floor((tries / maxTries) * 100);

    useEffect(() => {
        if (tries === maxTries) {
            let nextRule = Object.values(rules).find(rule => rule.key === passRule)
            console.log(nextRule)
            setCurrentRule(nextRule)
            setRuleArray({ ...currentRule, nextRule })
            setTries(0)

        }
    }, [tries]);

    return (
        <div>
            <p>
                {title} <br />
                {/* {passText} <br />
                        {failText} <br />
                        {passRule} <br />
                        {failRule} */}
            </p>
            <ProgressBar
                // now={tries * 100 / maxTries}
                now={progressPercentage}
            />
        </div>
    );
}

export default RulePanel
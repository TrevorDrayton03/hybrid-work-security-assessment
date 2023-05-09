import logo from './logo.svg'
import React, { useState, useEffect } from "react"
import './App.css'
import rules from './rule_config.json'
import RulePanel from './RulePanel'
import ControlButton from './ControlButton'
import FeedbackMessage from './FeedbackMessage'

function App() {
  const [status, setStatus] = useState('idle') // idle, running, completed
  const [responseStatus, setResponseStatus] = useState(null)
  const [currentRule, setCurrentRule] = useState(Object.values(rules).find(rule => rule.key === "GP1"))
  const [tries, setTries] = useState(1)
  const [ruleArray, setRuleArray] = useState({})

  // sets the first responseStatus and first rule
  useEffect(() => {
    (async () => {
      if (status === "running") {
        try {
          // const response = await fetch("http://www.google.com");
          // const status = await response.status();
          const response = { status: 200 };
          const status = response.status;
          setResponseStatus(status);
        } catch (error) {
          console.error(error);
        }
      }
    })()
    setRuleArray({ ...ruleArray, currentRule })
  }, [status])

  // checks responseStatus
  useEffect(() => {
    (async () => {
      if (responseStatus) {
        let currentTries = tries;
        while (currentTries <= currentRule.maxTries) {
          try {
            // const response = await fetch("http://www.google.com");
            // const status = await response.status();
            const response = { status: 200 };
            const status = response.status;
            setResponseStatus(status);
            setTries(currentTries);
          } catch (error) {
            console.error(error);
          }
          await new Promise((resolve) => setTimeout(resolve, 1000));
          currentTries++;
        }
      }
    })()
  }, [responseStatus, tries])
  // console.log(currentRule) // single object
  // console.log(ruleArray) // object with a single object
  return (
    <div className="App">
      <header className="App-header">
        {/* <img src={logo} className="App-logo" alt="logo" /> */}
        <h1>
          Thompson Rivers University
        </h1>
        <h3>
          Hybrid Work At Home Pre-Screening
        </h3>
      </header>
      <ControlButton
        status={status}
        setStatus={setStatus}
      />
      <FeedbackMessage
        status={status}
      />
      {(status === "running" || status === "completed") && (
        Object.values(ruleArray).map((rule, index) => (
          <RulePanel
            key={index}
            currentRule={currentRule}
            setCurrentRule={setCurrentRule}
            setRuleArray={setRuleArray}
            tries={tries}
            maxTries={rule.maxTries}
            title={rule.title}
            passText={rule.passText}
            failText={rule.failText}
            passRule={rule.passRule}
            failRule={rule.failRule}
            setTries={setTries}
          />
        ))
      )}
    </div>
  );
}

export default App

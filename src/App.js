import logo from './logo.svg'
import React, { useState, useEffect } from "react"
import './App.css'
import rules from './rule_config.json'
import RulePanel from './RulePanel'
import ControlButton from './ControlButton'
import FeedbackMessage from './FeedbackMessage'


function App() {
  const ruleKeys = Object.keys(rules)
  const ruleArray = Object.values(rules)
  const [status, setStatus] = useState('idle') // idle, running, completed
  const [currentRuleKey, setCurrentRuleKey] = useState(ruleKeys[1])

  console.log(status)

  return (
    <div className="App">
      <header className="App-header">
        {/* <img src={logo} className="App-logo" alt="logo" /> */}
        <h1>
          Thompson Rivers University
        </h1>
      </header>
      <ControlButton status={status} setStatus={setStatus} />
      <FeedbackMessage status={status} />
      <RulePanel
        status={status}
        title={ruleArray[currentRuleKey].title}
        passText={ruleArray[currentRuleKey].passText}
        failText={ruleArray[currentRuleKey].failText}
        passRule={ruleArray[currentRuleKey].passRule}
        failRule={ruleArray[currentRuleKey].failRule}
        setCurrentRuleKey={setCurrentRuleKey}
      />
    </div>
  );
}

export default App

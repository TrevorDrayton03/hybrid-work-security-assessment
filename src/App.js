import logo from './logo.png'
import React, { useState, useEffect } from "react"
import './App.css'
import rules from './rule_config.json'
import ProgressIndicator from './ProgressIndicator'
import ControlButton from './ControlButton'
import FeedbackMessage from './FeedbackMessage'
import RuleList from './RuleList'

function App() {
  const firstTry = 0
  const firstRule = "FirstRule"

  const [appStatus, setAppStatus] = useState('idle') // idle, running, completed
  const [responseStatus, setResponseStatus] = useState(null)
  const [currentRule, setCurrentRule] = useState(Object.values(rules).find(rule => rule.key === firstRule))
  const [tries, setTries] = useState(firstTry)
  const [ruleArray, setRuleArray] = useState([])
  const [progressPercentage, setProgressPercentage] = useState(Math.floor((tries / currentRule.maxTries) * 100))


  // having async / state problems here with changing statuses *** anticipating a problem here
  const handleOnGo = async () => {
    setAppStatus('running')
    if (appStatus === 'completed') {
      handleOnReset()
    }
    let currentTries = firstTry;
    while (currentTries < currentRule.maxTries) {
      try {
        // const response = await fetch("http://www.google.com");
        // const status = await response.status();
        let response = { status: 200 };
        const status = response.status;
        // this might result in a race condition during the real fetch requests
        if (tries === firstTry) {
          setResponseStatus(status);
        } else {
          setResponseStatus(prevStatus => (status !== prevStatus) ? status : prevStatus);
        }
        await new Promise((resolve) => setTimeout(resolve, 1000));
        currentTries++;
        setTries(currentTries);

      } catch (error) {
        console.error(error);
      }
    }
  }

  // const handleOnClick = () => {
  //   setAppStatus('running')
  //   if (appStatus === 'completed') {
  //     onReset()
  //   }
  //   onGo()
  // }

  const handleRuleChange = () => {
    if (currentRule.passRule !== "END") {
      setCurrentRule(Object.values(rules).find(rule => rule.key === currentRule.passRule))
      setTries(firstTry)
      setResponseStatus(null)
      handleOnGo()
    } else {
      setAppStatus("completed")
    }
    if (progressPercentage >= 100) {
      setRuleArray(prevArray => [currentRule, ...prevArray])
    }
  }

  const handleOnReset = () => {
    setProgressPercentage(0)
    setRuleArray([])
    setCurrentRule(Object.values(rules).find(rule => rule.key === firstRule))
  }

  useEffect(() => {
    console.log(
      appStatus,
      responseStatus,
      currentRule,
      tries,
      ruleArray)
  }, [appStatus,
    responseStatus,
    currentRule,
    tries,
    ruleArray]);

  useEffect(() => {
    setProgressPercentage(Math.floor((tries / currentRule.maxTries) * 100))
  }, [tries]);

  useEffect(() => {
    if (progressPercentage >= 100) {
      handleRuleChange();
    }
  }, [progressPercentage]);

  // console.log(currentRule) // single object
  // console.log(ruleArray) // object with a single object
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="TRU Logo" />
        <h1>
          Hybrid Work At Home Pre-Screening
        </h1>
      </header>
      <ControlButton
        appStatus={appStatus}
        setAppStatus={setAppStatus}
        onGo={handleOnGo}
        onReset={handleOnReset}
      />
      <FeedbackMessage
        appStatus={appStatus}
      />
      {appStatus === "running" &&
        <ProgressIndicator
          key={currentRule.key}
          progressPercentage={progressPercentage}
          currentRule={currentRule}
        />
      }
      <RuleList ruleArray={ruleArray}></RuleList>
    </div>
  );
}

export default App

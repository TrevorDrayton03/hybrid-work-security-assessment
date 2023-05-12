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

  /*
  haven't tested for multiple changes
  (F,F) = success without GP detecting a change
  (F,T) = success with GP detecting a change
  (T,F) = error wihout GP detecting a change
  (T,T) = error with GP detecting a change
  */
  const causeResponseError = true
  const causeResponseChange = true

  const [appStatus, setAppStatus] = useState('idle')
  const [responseStatus, setResponseStatus] = useState(null)
  const [currentRule, setCurrentRule] = useState(Object.values(rules).find(rule => rule.key === firstRule))
  const [tries, setTries] = useState(firstTry)
  const [ruleArray, setRuleArray] = useState([])
  const [progressPercentage, setProgressPercentage] = useState(Math.floor((tries / currentRule.maxTries) * 100))

  const handleStart = () => {
    setAppStatus('running')
    if (appStatus !== 'running') {
      handleReset()
    }
  }

  const handleContinue = () => {
    setAppStatus('running')
    setCurrentRule(Object.values(rules).find(rule => rule.key === currentRule.passRule))
    setProgressPercentage(0)
    setTries(firstTry)
  }

  const handleRetry = () => {
    setAppStatus('running')
    setProgressPercentage(0)
    setTries(firstTry)
  }

  // does not currently handle failRule, assumes all fail results in "END"
  const handleRuleChange = async () => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    // if it's not over 
    if (currentRule.passRule !== "END" && (responseStatus >= 200 && responseStatus <= 299)) {
      setCurrentRule(Object.values(rules).find(rule => rule.key === currentRule.passRule))
      setTries(firstTry)
      setResponseStatus(null)
      setProgressPercentage(0)
      handleStart()
      // else it's over
    } else {
      // ending on a success
      if (responseStatus >= 200 && responseStatus <= 299) {
        setAppStatus("completed")
      }
      // ending on an error
      else {
        setAppStatus("error")
      }
    }
    currentRule.responseStatus = responseStatus;
    setRuleArray(prevArray => [currentRule, ...prevArray])
  }

  const handleReset = () => {
    setProgressPercentage(0)
    setRuleArray([])
    setCurrentRule(Object.values(rules).find(rule => rule.key === firstRule))
    setTries(firstTry)
  }

  useEffect(() => {
    console.log(appStatus, responseStatus, currentRule, tries, ruleArray)
  }, [appStatus, responseStatus, currentRule, tries, ruleArray])

  useEffect(() => {
    setProgressPercentage(Math.floor((tries / currentRule.maxTries) * 100))
  }, [tries])

  useEffect(() => {
    if (progressPercentage >= 100) {
      handleRuleChange()
    }
  }, [progressPercentage])

  useEffect(() => {
    if (appStatus === 'running') {
      (async () => {
        let currentTries = tries
        let shouldBreak = false
        let response = null
        while (currentTries < currentRule.maxTries && !shouldBreak) {
          try {
            // (T,F)
            if (causeResponseError && currentRule.key === "GP2" && !causeResponseChange) {
              response = await fetch("https://reqres.in/api/users/23")
              // (T,T)
            } else if (causeResponseError && (currentRule.key === "GP2" || currentRule.key === "GP3") && causeResponseChange) {
              // start with success, change to error
              if (currentTries === 3) {
                response = await fetch("https://reqres.in/api/users/23")
              } else {
                response = await fetch("https://reqres.in/api/users?page=2")
              }
            }
            //(F,T)
            else if (!causeResponseError && currentRule.key === "GP2" && causeResponseChange) {
              // start with error, change to success
              if (currentTries !== 3) {
                response = await fetch("https://reqres.in/api/users/23")
              } else {
                response = await fetch("https://reqres.in/api/users?page=2")
              }
            }
            //(F,F) 
            else {
              response = await fetch("https://reqres.in/api/users?page=2")
            }
            let status = response.status
            if (currentTries === firstTry) {
              setResponseStatus(status)
            } else {
              setResponseStatus(prevStatus => {
                if (status !== prevStatus) {
                  shouldBreak = true
                  setProgressPercentage(100)
                  return status
                } else {
                  return prevStatus
                }
              })
            }
          } catch (error) {
            console.log(error)
          }
          await new Promise((resolve) => setTimeout(resolve, 100))
          if (!shouldBreak) {
            currentTries++
            setTries(currentTries)
          }
        }
      })()
    }
  }, [currentRule, appStatus])

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="TRU Logo" />
        <h1>
          Hybrid Work at Home Pre-Screen
        </h1>
      </header>
      <ControlButton
        appStatus={appStatus}
        start={handleStart}
        continu={handleContinue}
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
      <RuleList
        ruleArray={ruleArray}
        responseStatus={responseStatus}
      />
    </div>
  )
}

export default App
import logo from './logo.png'
import React, { useState, useEffect } from "react"
import './App.css'
import rules from './rule_config.json'
import ProgressIndicator from './ProgressIndicator'
import ControlButton from './ControlButton'
import FeedbackMessage from './FeedbackMessage'
import RuleList from './RuleList'
import { v4 as uuidv4 } from 'uuid';

/**
 * The main application component.
 * 
 * This component represents the Hybrid Work-from-Home Pre-Screening Assessment application.
 * It manages the state, handles user interactions, and renders the UI components.
 *
 */
function App() {
  // Constants
  const firstTry = 0
  const firstRule = "FirstRule"
  const baseUrl = process.env.REACT_APP_BASE_URL

  /**
   * Configuration Flags
   * 
   * To show panel callout: change GP2's failRule from 'GP6' to 'end' in rule_config.json.
   * 
   */
  const causeResponseError = true
  const causeResponseChange = true

  // State variables
  const [appStatus, setAppStatus] = useState('idle')
  const [responseStatus, setResponseStatus] = useState(null)
  const [currentRule, setCurrentRule] = useState(Object.values(rules).find(rule => rule.key === firstRule))
  const [tries, setTries] = useState(firstTry)
  const [ruleArray, setRuleArray] = useState([])
  const [progressPercentage, setProgressPercentage] = useState(Math.floor((tries / currentRule.maxTries) * 100))

  /**
   * Handles the start button click event.
   *
   * This function sets the application status to 'running' and triggers a reset if the app is not already running.
   * 
   */
  const handleStart = () => {
    setAppStatus('running')
    if (appStatus !== 'running') {
      handleReset()
    }
  }

  /**
   * Handles the retry button click event.
   * 
   * This function updates the application status to 'running', removes the first rule from the rule array,
   * resets the progress percentage, and sets the number of tries to the initial value.
   * 
   */
  const handleRetry = () => {
    setAppStatus('running')
    let ruleArrayCopy = ruleArray
    ruleArrayCopy.shift()
    setRuleArray(ruleArrayCopy)
    setProgressPercentage(0)
    setTries(firstTry)
  }

  /**
   * Handle rule change action.
   * 
   * This asynchronous function is called when a rule change occurs.
   * It evaluates the current rule and response status to determine the next actions.
   * 
   */
  const handleRuleChange = async () => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    if (
      currentRule.passRule.toLowerCase() !== "end" &&
      (responseStatus >= 200 && responseStatus <= 299)
    ) {
      setCurrentRule(Object.values(rules).find(rule => rule.key === currentRule.passRule))
      setTries(firstTry)
      setResponseStatus(null)
      setProgressPercentage(0)
      handleStart()
    } else if (
      currentRule.failRule.toLowerCase() !== "end" &&
      (responseStatus > 299)
    ) {
      setCurrentRule(Object.values(rules).find(rule => rule.key === currentRule.failRule))
      setTries(firstTry)
      setResponseStatus(null)
      setProgressPercentage(0)
      handleStart()
    }
    else {
      if (responseStatus >= 200 && responseStatus <= 299) {
        setAppStatus("completed")
      }
      else {
        setAppStatus("error")
      }
    }
    currentRule.responseStatus = responseStatus;
    let uniqueId = uuidv4()
    currentRule.uuid = uniqueId;
    setRuleArray(prevArray => [currentRule, ...prevArray])
  }

  /**
 * Handle copy action.
 * 
 * This function is used to copy the uuid that was generated when a mandatory security check is not passed.
 * 
 */
  const handleCopy = (text) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        console.log('Text copied to clipboard:', text);
      })
      .catch((error) => {
        console.error('Failed to copy text:', error);
      });
  }

  /**
   * Handle reset action.
   * 
   * This function is called when the user presses the restart button.
   * It resets the progress percentage to 0, clears the rule array, sets the current rule to the first rule in the rules configuration,
   * and resets the number of tries to the initial value.
   */
  const handleReset = () => {
    setProgressPercentage(0)
    setRuleArray([])
    setCurrentRule(Object.values(rules).find(rule => rule.key === firstRule))
    setTries(firstTry)
  }

  useEffect(() => {
    console.log(appStatus, responseStatus, currentRule, tries, ruleArray)
  }, [appStatus, responseStatus, currentRule, tries, ruleArray])

  /**
   * Handle side effects related to progress, rule change, and app status.
   * 
   * This effect hook is triggered when there are changes in the 'tries' state.
   * It recalculates the progress percentage based on the number of tries and the current rule's maximum tries.
   */
  useEffect(() => {
    setProgressPercentage(Math.floor((tries / currentRule.maxTries) * 100))
  }, [tries])

  /**
   * Handle side effects related to progress reaching 100%.
   * 
   * This effect hook is triggered when there are changes in the 'progressPercentage' state.
   * If the progress percentage reaches, exceeds, or is set to 100, it calls the 'handleRuleChange' function to handle the rule change.
   */
  useEffect(() => {
    if (progressPercentage >= 100) {
      handleRuleChange()
    }
  }, [progressPercentage])

  /**
   * 
   * This effect hook is triggered when there are changes in the 'currentRule' and 'appStatus' states.
   * 
   * If the app status is set to 'running', it executes an asynchronous function that handles rule processing.
   * It performs multiple checks and fetches data based on different conditions, updating the response status and other relevant states.
   * It controls the number of tries, breaks the loop if necessary conditions are met, and sets the progress percentage to 100.
   * 
   */
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
              response = await fetch(baseUrl + "/23")
              // (T,T)
            } else if (causeResponseError && (currentRule.key === "GP2" || currentRule.key === "GP3") && causeResponseChange) {
              // start with success, change to error
              if (currentTries === 3) {
                response = await fetch(baseUrl + "/23")
              } else {
                response = await fetch(baseUrl + "?page=2")
              }
            }
            //(F,T)
            else if (!causeResponseError && currentRule.key === "GP2" && causeResponseChange) {
              // start with error, change to success
              if (currentTries !== 3) {
                response = await fetch(baseUrl + "/23")
              } else {
                response = await fetch(baseUrl + "?page=2")
              }
            }
            //(F,F) 
            else {
              response = await fetch(baseUrl + "?page=2")
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
          Hybrid Work-from-Home Pre-Screening Assessment
        </h1>
      </header>
      <ControlButton
        appStatus={appStatus}
        start={handleStart}
        retry={handleRetry}
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
        appStatus={appStatus}
        copy={handleCopy}
      />
    </div>
  )
}

export default App
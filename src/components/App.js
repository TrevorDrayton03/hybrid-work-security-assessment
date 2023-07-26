/**
 * Hybrid Work-from-Home Security Assessment
 *
 * This application assesses security requirements of staff devices to ensure they meet the necessary criteria for safely connecting remotely 
 * to TRU's network as part of the hybrid Work-from-Home program. It accomplishes this task by making fetch requests to TRU's servers that host HIPS rules.
 * These rules assess the user's device and return a response status based on the assessment. These are the same rules that Global Protect is
 * automatically checking on its own interval to ensure the user's device is compliant with TRU's security requirements, and will prevent users from staying
 * connected if it detects a security issue. This application is intended to be used as a tool to help users identify and resolve security issues before
 * connecting to TRU's network, or in the event they get kicked off the network by Global Protect.
 *
 * Main Component
 * 
 * This component represents the main entry point of the web app.
 * It serves as the container for the entire application and handles the overall layout and function.
 * 
 * Features:
 * - Fetches the rules_config.json file from the server and stores it in the application state for rule evaluation.
 * - Sends the data of each assessment result to a database for logging and tracking.
 * - Provides a progress bar to visualize the user's progress through each individual security check.
 * - Displays feedback messages based on the status of the application to keep users informed about the progress and results of the security checks.
 * - Offers control buttons to allow the user to start, restart, retry (warnings, errors, or all) the security check assessment and retry the last failed security check.
 * - Shows a spinner during rule evaluations to indicate that the application is running even if the progress indicator is not moving.
 * - Incorporates a responsive design to ensure usability on various screen sizes including mobile, tablet, and desktop.
 * - Ensures cross-browser compatibility for broad accessibility.
 * - Learnable and easy to use with a simple and intuitive user interface.
 * - Complies with ES6 standards for code readability, maintainability, and modern features.
 * - Robust error handling
 * 
 * Libraries/Dependencies:
 * Node.js: JavaScript runtime environment.
 * React: JavaScript library for building user interfaces.
 * Bootstrap & React-Bootstrap: Popular CSS framework for responsive and mobile-first web development.
 * MariaDB: Database management system for storing the data of the security check assessments.
 * Express: Web application framework for building server side applications in Node.js.
 * react-scripts: Configuration and scripts for running a React application in development and production environments.
 * uuid: Library for generating unique identifiers (UUIDs) for each security check assessment.
 * whatwg-fetch: Polyfill that provides a global fetch function for making web requests in browsers that do not support the native Fetch API.
 * react-icons: Library of icons for React applications, used for the copy UUID button.
 * 
 * Author: Trevor Drayton
 * Version: 1.1.0
 * Last Updated: Jul 19, 2023
 * 
 * Thompson Rivers University
 * Department: IT Information Security
 * Contact: trevorpdrayton@gmail.com or linkedin.com/in/trevor-drayton/
 */

import logo from '../logo.png'
import React, { useState, useEffect, useCallback } from "react"
import '../App.css'
import ProgressIndicator from './ProgressIndicator'
import ControlButton from './ControlButton'
import FeedbackMessage from './FeedbackMessage'
import RuleList from './RuleList'
import 'whatwg-fetch'
import { isRuleEnd, isRetryRuleEnd, isSecurityCheck, isUnsuccessful, isAWarning, isAnError } from '../helpers/helpers'
import useFetchRulesConfig from '../custom_hooks/useFetchRulesConfig.js'
import useStartAndRestart from '../custom_hooks/useStartAndRestart.js'
import useRetryLogic from '../custom_hooks/useRetryLogic.js'

function App() {

  /**
   * Constants
   * 
   * firstRule is the key property value that determines which rule in the rule_config.json file the fetch loop begins with
   * delay is the time in milliseconds that the fetch loop waits before sending another request, which is read from the rule_config.json file
   * baseUrl is the server url for the HIPS requests read from the .env file
   */
  const firstRule = "FirstRule"
  const delay = "tryDelay"
  const baseUrl = process.env.REACT_APP_HIPS_BASE_URL

  /**
   * State Variables
   * 
   * retryRules is an array of rules that have been filtered from the ruleList to be retried
   * currentRetryRule refers to the rule currently undergoing the retry assessment
   * endPathLength is the length of the path from the current rule to an end rule. It requires a final, singular path to be available from the current rule.
   */
  // const [retryRules, setRetryRules] = useState(null)
  // const [currentRetryRule, setCurrentRetryRule] = useState(null)
  const [endPathLength, setEndPathLength] = useState(null)

  const {
    isLoading,
    rules, 
    currentRule, 
    setCurrentRule, 
    tryDelay, 
  } = useFetchRulesConfig(firstRule, delay)

  const {
    action,
    appStatus,
    progressPercentage,
    ruleList,
    tries,
    responseStatus,
    uuid,
    handleStart,
    handleRuleChange,
    handleEndResultAndAppStatus,
    setAction,
    setAppStatus,
    setProgressPercentage,
    setRuleList,
    setTries,
    setResponseStatus,
    setUuid,
  } = useStartAndRestart(firstRule, rules, currentRule, setCurrentRule)

  const {
    retryRules,
    currentRetryRule,
    handleRetry,
    handleRetryRuleChange,
    setRetryRules,
  } = useRetryLogic(handleEndResultAndAppStatus, setAppStatus, setProgressPercentage, setTries, ruleList, setRuleList, setUuid, action, setAction);
  
  /**
   * Handles the continue button click event.
   * 
   * This function updates the application status to 'running', sets the current rule to the next rule in the sequence,
   * resets the progress percentage, and sets the number of tries to the initial value.
   */
  const handleContinue = useCallback(() => {
    setAction('continue')
    setAppStatus('running')
    setCurrentRule(Object.values(rules).find(rule => rule.key === currentRule.passRule))
    setProgressPercentage(0)
    setTries(0)
  },[rules, currentRule])
  

  /**
   * Handle copy UUID onClick event.
   */
  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(uuid)
      .catch((error) => {
        console.error('Failed to copy text:', error)
      })
  },[uuid])

  /**
   * A useful side effect for debugging.
   */
  useEffect(() => {
    console.log(appStatus, responseStatus, currentRule, tries, ruleList, action)
  }, [appStatus, responseStatus, currentRule, tries, ruleList, action])

  /**
   * Side effect that manages the progress bar percentage.
   * 
   * It calculates a normalized percentage that the ProgressIndicator uses.
   */
  useEffect(() => {
    if (currentRule) {
      setProgressPercentage(Math.floor((tries / currentRule.maxTries) * 100))
    }
  }, [tries])

  /**
   * It calls handleRuleChange or handleRetryRuleChange when progress percentage reaches 100%.
   */
  useEffect(() => {
    if (progressPercentage >= 100 && appStatus === "running") {
      handleRuleChange()
    }
    else if (progressPercentage >= 100 && appStatus === "retry") {
      handleRetryRuleChange()
    }
  }, [progressPercentage])

  /**
   * Side effect hooked into currentRule and appStatus that executes the standard rule assessment process.
   * Fetches for maxTry amount of times, identifies the responseStatus on the first try, and ends the current rule's assessment if
   * the responseStatus changes after the first try or maxTries amount of fetches have been made.
   */
  useEffect(() => {
    let currentTries = tries
    let shouldBreak = false
    let response = null
    if (appStatus === 'running') {
      (async () => {
        while (currentTries < currentRule.maxTries && !shouldBreak) {
          await new Promise((resolve) => setTimeout(resolve, tryDelay))
          try {
            response = await fetch(baseUrl + currentRule.port)
            let status = response.status
            if (currentTries === 0) {
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
          if (!shouldBreak) {
            currentTries++
            setTries(currentTries)
          }
        }
      })()
    }
  }, [currentRule, appStatus])

  /**
   * Side effect hooked into currentRetryRule and appStatus that executes the retry rule assessment process.
   */
  useEffect(() => {
    let currentTries = tries
    let shouldBreak = false
    let response = null

    if (appStatus === "retry") {
      (async () => {
        while (currentTries < currentRetryRule.maxTries && !shouldBreak) {
          await new Promise((resolve) => setTimeout(resolve, tryDelay)) // has to be up here
          try {
            response = await fetch(baseUrl + currentRetryRule.port)
            let status = response.status
            if (currentRetryRule.responseStatus !== status) {
              setProgressPercentage(100)
              shouldBreak = true
              setRetryRules(prevRetryRules => {
                let updatedRetryRules = [...prevRetryRules]
                let index = updatedRetryRules.findIndex(rule => rule.key === currentRetryRule.key)
                if (index !== -1) {
                  updatedRetryRules[index] = {
                    ...updatedRetryRules[index],
                    responseStatus: status
                  }
                }
                return updatedRetryRules
              })
            }    
          } catch (error) {
            console.log(error)
          }
          if (!shouldBreak) {
            currentTries++
            setTries(currentTries)
          }
        }
      })()
    }
  }, [currentRetryRule, appStatus])

  /**
   * Side effect that determines if a singular endpath is possible. If there is one, sets the end path length.
   */
  useEffect(() => {
    if(ruleList.length !== 0 && appStatus !== 'retry') {
      let tempCurrentRule = ruleList[0]
      let count = 0
        while (isSecurityCheck(tempCurrentRule)) {
          tempCurrentRule = rules[tempCurrentRule.passRule]
          count++
          if (isRuleEnd(tempCurrentRule)) {
            setEndPathLength(ruleList.length + count)
            break
          } else {
            setEndPathLength(null)
        }
      }
    }
  }, [ruleList])

  return (
    <div className="App-container">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="TRU Logo" />
      </header>
      <div className="App">
        <h1>
            Hybrid Work-from-Home Security Assessment
        </h1>
        {
        isLoading ?
          <div className="skeleton-loading">
            <div className="skeleton-button"></div>
            <div className="skeleton-text1"></div>
            {/* <div className="skeleton-text2"></div> */}
          </div>
          : 
          <>
            <ControlButton
              appStatus={appStatus}
              start={handleStart}
              retry={handleRetry}
              continu={handleContinue}
              ruleList={ruleList}
            />
            {(appStatus === "running" || appStatus === "retry") &&
              <ProgressIndicator
                key={currentRule.key}
                progressPercentage={progressPercentage}
                currentRule={currentRule}
                currentRetryRule={currentRetryRule}
              />
            }
            <FeedbackMessage
              appStatus={appStatus}
              ruleList={ruleList}
              endPathLength={endPathLength}
            />
            <RuleList
              ruleList={ruleList}
              appStatus={appStatus}
              uuid={uuid}
              copy={handleCopy}
            />
          </>
        }
      </div>
    </div>
  )
}

export default App
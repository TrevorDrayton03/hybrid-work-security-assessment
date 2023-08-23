/**
 * Hybrid Work Security Assessment
 *
 * This application assesses compliance of staff devices with TRU's HIPS (Host-Based Intrustion Prevention System) for connecting remotely 
 * to TRU's network for the Hybrid Work Program. It accomplishes this task by making fetch requests to an apache server for each HIPS rule.
 * The HIPS rules assess the user's device and return a response status based on the result of the assessment. 
 * 
 *
 * Features:
 * - Gets instructions from a rules_config.json file and stores it in the application state for rule evaluation.
 * - Logs each assessment result to a database.
 * - A device-friendly, responsive design.
 * - Ensures cross-browser compatibility.
 * - Learnable and easy to use (UX).
 * - Complies with ES6 standards for code readability, maintainability, and modern features.
 * - Robust error handling.
 * - The code is well documented, modular, cohesive, testable, and reusable. 
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
 * Web Vital Statistics (on my virtual machine in my development environment):
 * FCP (First Contentful Paint): 800ms to 1200ms
 * TTFB (Time to First Byte): 100ms to 300ms
 * FID (First Input Delay): 10ms to 100ms
 * 
 * Author: Trevor Drayton, Co-op
 * Version: 1.1.1
 * Last Updated: Aug 21, 2023
 * 
 * Thompson Rivers University
 * Department: Information Technology Services Information Security
 * Contact: trevorpdrayton@gmail.com or linkedin.com/in/trevor-drayton/
 */

import logo from '../logo.png'
import React, { useEffect, useCallback } from "react"
import '../App.css'
import ProgressIndicator from './ProgressIndicator'
import ControlButton from './ControlButton'
import FeedbackMessage from './FeedbackMessage'
import RuleList from './RuleList'
import 'whatwg-fetch'
import useFetchRulesConfig from '../custom_hooks/useFetchRulesConfig.js'
import useStartAndRestartLogic from '../custom_hooks/useStartAndRestartLogic.js'
import useRetryLogic from '../custom_hooks/useRetryLogic.js'
import useStandardRuleAssessment from '../custom_hooks/useStandardRuleAssessment.js'
import useRetryRuleAssessment from '../custom_hooks/useRetryRuleAssessment.js'
import useEndPathLength from '../custom_hooks/useEndPathLength.js'

const App = () => {
  /**
   * Constants
   * 
   * firstRule is the key value of the first instruction from the config file
   * delay is the key value used to get the delay time from the config file
   * baseUrl is the apache server url
   */
  const firstRule = "FirstRule"
  const delay = "tryDelay"
  const baseUrl = process.env.REACT_APP_HIPS_BASE_URL

  // Custom Hook: useFetchRulesConfig -- manages initial page loading and states.
  const {
    isLoading,                     // Boolean indicating if the rules configuration data is being fetched.
    rules,                         // Object, the contents of the config file.
    currentRule,                   // Current rule, initially set to the first rule.
    setCurrentRule,                // Asynchronous function to set the currentRule state.
    tryDelay,                      // Delay time (in milliseconds) between tries when evaluation rules.
    uuid                           // Permanent cookie, unique user reference number.
  } = useFetchRulesConfig(firstRule, delay)

  // Custom Hook: useStartAndRestartLogic -- provides the functions for starting and restarting assessments and instruction evalution.
  const {
    action,                        // start, restart, retry, or continue.
    appStatus,                     // idle, running, completed, error, or paused.
    progressPercentage,            // Number between 0 to 100, for the progress bar.
    ruleList,                      // Array, evaluated instructions in sequence.
    tries,                         // Number of fetch attempts for the current rule.
    responseStatus,                // HTTP response status code for the current rule.
    handleStart,                   // Function to handle the start and restart button onClick events.
    handleRuleChange,              // Function to change the current rule and update the ruleList to include the evaluation of the current rule.
    handleEndResultAndAppStatus,   // Function to evaluate the rule list, determine the end result, set the action state, and change the app status to completed.
    setAction,                     // Asynchronous function to set the action state.
    setAppStatus,                  // Asynchronous function to set the appStatus state.
    setProgressPercentage,         // Asynchronous function to set the progressPercentage state.
    setRuleList,                   // Asynchronous function to set the ruleList state.
    setTries,                      // Asynchronous function to set the tries state.
    setResponseStatus,             // Asynchronous function to set the responseStatus state.
  } = useStartAndRestartLogic(firstRule, rules, currentRule, setCurrentRule, uuid)


  // Custom Hook: useRetryLogic -- provides the functions for reassessing violations.
  const {
    currentRetryRule,              // The violation being reevaluated.
    handleRetry,                   // Function to handle the user clicking on the retry button.
    handleRetryRuleChange,         // Function to handle changing to the next violation.
    setRetryRules,                 // Asynchronous function to set the retryRules state.
  } = useRetryLogic(
    handleEndResultAndAppStatus,
    setAppStatus,
    setProgressPercentage,
    setTries,
    ruleList,
    setRuleList,
    uuid,
    action,
    setAction,
    rules,
    setCurrentRule
  )


  // Custom Hook: useEndPathLength -- calculate the length of the end path based on processed rule list.
  const endPathLength = useEndPathLength(ruleList, rules, appStatus)


  // Custom Hook: useStandardRuleAssessment -- the standard assessment process (when the user starts, restarts, or continues) dependent on currentRule and appStatus.
  useStandardRuleAssessment(
    currentRule,
    appStatus,
    tryDelay,
    tries,
    setTries,
    setResponseStatus,
    baseUrl,
    setProgressPercentage
  )


  // Custom Hook: useRetryRuleAssessment -- reassesses violations (when the user retries), dependent on currentRetryRule and appStatus.
  useRetryRuleAssessment(
    currentRetryRule,
    setRetryRules,
    appStatus,
    tryDelay,
    tries,
    setTries,
    baseUrl,
    setProgressPercentage
  )


  /**
   * Continues a standard assessment at the last violation's passRule, when the user presses the continue button.
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
  // useEffect(() => {
  //   console.log(appStatus, responseStatus, currentRule, tries, ruleList, action, currentRetryRule)
  // }, [appStatus, responseStatus, currentRule, tries, ruleList, action, currentRetryRule])


  /**
   * This hook calculates a normalized progress percentage for the ProgressIndicator.
   */
  useEffect(() => {
    if (currentRule) {
      setProgressPercentage(Math.floor((tries / currentRule.maxTries) * 100))
    }
  }, [tries])


  /**
   * This hook calls rule change functions, hooked into the progress percentage.
   */
  useEffect(() => {
    if (progressPercentage >= 100 && appStatus === "running") {
      handleRuleChange()
    }
    else if (progressPercentage >= 100 && appStatus === "retry") {
      handleRetryRuleChange()
    }
  }, [progressPercentage])


  return (
    <div className="App-container">
      <header className="App-header">
        <a href="https://www.tru.ca">
          <img src={logo} className="App-logo" alt="TRU Logo" />
        </a>
      </header>
      <div className="App">
        <h1>
            Hybrid Work Security Assessment
        </h1>
        {
        isLoading ?
          <div className="skeleton-loading">
            <div className="skeleton-button"></div>
            <div className="skeleton-text1"></div>
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
              ruleList={ruleList}y
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
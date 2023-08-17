/**
 * Hybrid Work Security Assessment
 *
 * This application assesses security requirements of staff devices to ensure they meet the necessary criteria for safely connecting remotely 
 * to TRU's network. It accomplishes this task by making fetch requests to TRU's servers that host HIPS rules.
 * The HIPS rules assess the user's device and return a response status based on the result of the assessment. These are the same rules that Global Protect is
 * automatically checking on its own interval to ensure the user's device is compliant with TRU's security requirements. This application is a tool to help 
 * users identify and resolve security issues that arise when connecting to TRU's network through the Global Protect VPN.
 *
 * Features:
 * - Fetches the rules_config.json file from the server and stores it in the application state for rule evaluation.
 * - Sends the data of each assessment result to a database for logging and tracking.
 * - Incorporates a responsive design to ensure usability on various screen sizes including mobile, tablet, and desktop.
 * - Ensures cross-browser compatibility for broad accessibility.
 * - Learnable and easy to use with an intuitive user interface.
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
 * Author: Trevor Drayton, Co-op Student
 * Version: 1.1.1
 * Last Updated: Aug 17, 2023
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

  // useFetchRulesConfig: Custom hook to fetch rule configuration data from the server and manage loading state.
  const {
    isLoading,                     // Boolean indicating if the rules configuration data is currently being fetched.
    rules,                         // Object containing the fetched rules configuration data.
    currentRule,                   // Current rule being processed from the fetched rules data.
    setCurrentRule,                // Asynchronous function to set the currentRule state.
    tryDelay,                      // Delay time (in milliseconds) between attempts when processing rules.
  } = useFetchRulesConfig(firstRule, delay)

  // useStartAndRestartLogic: Custom hook to manage the state and logic for starting, restarting, and processing rules.
  const {
    action,                        // Action type [start, restart, retry, continue] for logging purposes.
    appStatus,                     // Current status of the application [idle, running, completed, error, paused].
    progressPercentage,            // Progress percentage for the current rule processing.
    ruleList,                      // Array of rules that have been assessed and logged in the database.
    tries,                         // Number of fetch attempts for the current rule.
    responseStatus,                // HTTP response status code for the current rule.
    uuid,                          // Unique identifier for the current sequence referencing the sequence in the database.
    handleStart,                   // Function to handle the start and restart button onClick events.
    handleRuleChange,              // Function to change the current rule and update the rule list with the results of rule assessment.
    handleEndResultAndAppStatus,   // Function to evaluate the rule list, determine the end result, set the action state for logging, and change the app status to completed.
    setAction,                     // Asynchronous function to set the action state.
    setAppStatus,                  // Asynchronous function to set the appStatus state.
    setProgressPercentage,         // Asynchronous function to set the progressPercentage state.
    setRuleList,                   // Asynchronous function to set the ruleList state.
    setTries,                      // Asynchronous function to set the tries state.
    setResponseStatus,             // Asynchronous function to set the responseStatus state.
    setUuid,                       // Asynchronous function to set the uuid state.
  } = useStartAndRestartLogic(firstRule, rules, currentRule, setCurrentRule)


  // useRetryLogic: Custom hook to manage state and logic for handling retry rules.
  const {
    currentRetryRule,              // Current retry rule being processed.
    handleRetry,                   // Function to handle retry for unsuccessful rules.
    handleRetryRuleChange,         // Function to handle retry rule change and update retry rules state.
    setRetryRules,                 // Asynchronous function to set the retryRules state.
  } = useRetryLogic(
    handleEndResultAndAppStatus,
    setAppStatus,
    setProgressPercentage,
    setTries,
    ruleList,
    setRuleList,
    setUuid,
    action,
    setAction,
    rules,
    setCurrentRule
  )


  // useEndPathLength: Custom hook to calculate the length of the end path based on processed rule list.
  const endPathLength = useEndPathLength(ruleList, rules, appStatus)


  // useStandardRuleAssessment: Custom hook to assess rules, when the user starts, restarts, or continues, hooked on currentRule and appStatus.
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


  // useRetryRuleAssessment: Custom hook to assess retry rules, when the user retries, hooked on currentRetryRule and appStatus.
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
  // useEffect(() => {
  //   console.log(appStatus, responseStatus, currentRule, tries, ruleList, action, currentRetryRule)
  // }, [appStatus, responseStatus, currentRule, tries, ruleList, action, currentRetryRule])


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
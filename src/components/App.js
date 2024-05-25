/**
 * Hybrid Work Security Assessment
 * Author: Trevor Drayton
 * Version: 1.1.1
 * Last Updated: Aug 25, 2023
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

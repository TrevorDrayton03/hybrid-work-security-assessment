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
import React, { useState, useEffect } from "react"
import '../App.css'
import ProgressIndicator from './ProgressIndicator'
import ControlButton from './ControlButton'
import FeedbackMessage from './FeedbackMessage'
import RuleList from './RuleList'
import { v4 as uuidv4 } from 'uuid'
import 'whatwg-fetch'
import { isPassRule, isFailRule, isRuleEnd, isRetryRuleEnd, isSecurityCheck, isUnsuccessful, isAWarning, isAnError } from '../helpers/helpers'

function App() {

  /**
   * Constants
   * 
   * firstTry is the initialization value of the loops
   * firstRule is the key property value that determines which rule in the rule_config.json file the fetch loop begins with
   * delay is the time in milliseconds that the fetch loop waits before sending another request, which is read from the rule_config.json file
   * baseUrl is the server url for the HIPS requests read from the .env file
   */
  const firstTry = 0
  const firstRule = "FirstRule"
  const delay = "tryDelay"
  const baseUrl = process.env.REACT_APP_HIPS_BASE_URL

  /**
   * State Variables
   * 
   * appStatus is the primary state of the app [idle, running, completed, error, paused]
   * responseStatus refers to the http response status code; it gets appended to rules in the ruleList
   * rules is the data from rules_config.json
   * currentRule refers to the rule currently being assessed
   * ruleList is an array of rules that have been assessed, logged in the database as 'sequence' and used to show the user their results
   * retryRules is an array of rules that have been filtered from the ruleList to be retried
   * currentRetryRule refers to the rule currently undergoing the retry assessment
   * tries keeps count of the number of fetch requests for the current rule
   * tryDelay is the time in milliseconds that the fetch loop waits before sending another request, which is read from the rule_config.json file
   * progressPercentage refers to the value that's used for the progress bar component [ProgressIndicator.js]
   * uuid is the unique identifier for the current sequence, referencing the sequence in the database
   * action is for the purpose of logging the user event [start, restart, retry, continue]
   * endPathLength is the length of the path from the current rule to an end rule. It requires a final, singular path to be available from the current rule.
   * isLoading is true if rules are fetching in the initial page load, false if rules are fetched
   */
  const [appStatus, setAppStatus] = useState('idle')
  const [responseStatus, setResponseStatus] = useState(null)
  const [rules, setRules] = useState({})
  const [currentRule, setCurrentRule] = useState(null)
  const [ruleList, setRuleList] = useState([])
  const [retryRules, setRetryRules] = useState(null)
  const [currentRetryRule, setCurrentRetryRule] = useState(null)
  const [tries, setTries] = useState(firstTry)
  const [tryDelay, setTryDelay] = useState(0)
  const [progressPercentage, setProgressPercentage] = useState(0)
  const [uuid, setUuid] = useState(null)
  const [action, setAction] = useState(null)
  const [endPathLength, setEndPathLength] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  /**
   * OnComponentDidMount Side Effect (called on initial page load)
   * 
   * This side effect fetches the rules_config.json file and store the config data in the rules state.
   * It initializes the application's state.
   */
  useEffect(() => { 
    fetch("/api/rules")
      .then(response => response.json())
      .then(config => {
        setRules(config)
        setCurrentRule(Object.values(config).find(rule => rule.key === firstRule))
        setTryDelay(Object.values(config).find(rule => rule.key === delay)?.milliseconds)
        setIsLoading(false)
      })
      .catch(error => {
        console.error('Error:', error)
      })
  }, [])

  /**
   * Handles the start and restart button onClick events.
   *
   * This function sets the application status to 'running' and resets the app state if it is not already running.
   * It also receives the action from the button that was clicked for logging purposes.
   * 
   * @param {string} action - the user event
   */
  const handleStart = (action) => {
    setAction(action)
    setAppStatus('running')
    if (appStatus !== 'running') {
      setProgressPercentage(0)
      setRuleList([])
      setCurrentRule(Object.values(rules).find(rule => rule.key === firstRule))
      setTries(firstTry)
    }
  }

  /**
   * Handles the retry button click event. It sets the application status to 'retry', 
   * resets the progress percentage and tries, and prepares the rules to be retried 
   * based on the which type of rules the user wants to retry. Default is all failed rules 
   * when the user preses the retry button.
   * 
   * Once a filtered array is created, the items are linked together with a nextRule before
   * it gets fed into the retry mechanism
   * 
   * @param {string} type - the type of rules to be reassessed [null (will do all failed rules), warning, error]
   */
  const handleRetry = async (type) => {
    setAction('retry')
    setAppStatus('retry')
    setProgressPercentage(0)
    setTries(firstTry)
    let retryRules
    if (!type) {
      retryRules = Object.values(ruleList).filter(rule => isUnsuccessful(rule))
    } else if (type === "warning") {
      retryRules = Object.values(ruleList).filter(rule => isAWarning(rule))
    } else {
      retryRules = Object.values(ruleList).filter(rule => isAnError(rule))
    }
    let updatedRetryRules = [...retryRules].reverse().map((rule, index, array) => {
      if (index < array.length - 1) {
        return {
          ...rule,
          nextRule: array[index + 1].key
        }
      } else {
        return {
          ...rule,
          nextRule: null
        }
      }
    })
    setRetryRules(updatedRetryRules)
    setCurrentRetryRule(updatedRetryRules[0])
  }

  /**
   * Handles the continue button click event.
   * 
   * This function updates the application status to 'running', sets the current rule to the next rule in the sequence,
   * resets the progress percentage, and sets the number of tries to the initial value.
   */
  const handleContinue = () => {
    setAction('continue')
    setAppStatus('running')
    setCurrentRule(Object.values(rules).find(rule => rule.key === currentRule.passRule))
    setProgressPercentage(0)
    setTries(firstTry)
  }

  /**
   * Used to set the state of the app for the next rule; utilized in handleRuleChange.
   * 
   * @param {string} nextRule - the key property value
   */
  const changeToRule = (nextRule) => {
    setCurrentRule(Object.values(rules).find(rule => rule.key === nextRule))
    setTries(firstTry)
    setResponseStatus(null)
    setProgressPercentage(0)
  }

  /**
   * Encapsulates the logic required to change the current rule to either the pass rule, fail rule, or end rule,
   * and update the rule list with the results of the current rule's assessment.
   * Called when progress of the currentRule reaches 100%.
   */
  const handleRuleChange = async () => {
    await new Promise((resolve) => setTimeout(resolve, 500))
    currentRule.responseStatus = responseStatus
    if (isPassRule(currentRule)) {
      changeToRule(currentRule.passRule)
    } else if (isFailRule(currentRule)) {
      changeToRule(currentRule.failRule)
    } else {
      handleNoRuleChange(currentRule, ruleList)
    }
    setRuleList(prevArray => [currentRule, ...prevArray])
  }
  
  /**
   * Handles scenarios where no rule change occurs, determining the final state and logging.
   * 
   * @param {object} currentRule - the current rule being evaluated
   * @param {array} ruleList - the list of rules that have been evaluated so far
   */
  const handleNoRuleChange = async (currentRule, ruleList) => {
    let rList = [currentRule, ...ruleList] // synchronous solution for posting immediately
    let id = uuidv4()
    setUuid(id)
    let result
  
    if (isRuleEnd(currentRule)) {
      result = handleEndResultAndAppStatus(rList)
    } else if (currentRule.continueOption === true) {
      setAppStatus("paused")
      result = "incomplete"
    } else {
      setAppStatus("error")
      result = "incomplete"
    }
  
    const response = await fetch('/api/data', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        uid: id,
        sequence: rList,
        action: action,
        result: result
      }),
    })
    if (response.ok) {
      console.log('Data posted successfully')
    } else {
      console.log('Failed to post data')
    }
  }
  
  /**
   * Used in both the standard process and the retry process.
   * 
   * Evaluates the rule list to determine the end result and change the app state to completed.
   * 
   * @param {array} rList - the list of rules that have been evaluated
   * @returns {string} - the end result of the assessment
   */
  const handleEndResultAndAppStatus = (rList) => {
    let result
    if (rList.every(rule => rule.responseStatus === 200)) { 
      setAppStatus("completed")
      result = "completed successfully"
    } else if (rList.filter(rule => rule.responseStatus !== 200).every(rule => rule.warning === true)) { 
      setAppStatus("completed")
      result = "completed successfully with warning(s)"
    } else { 
      setAppStatus("completed")
      result = "completed unsuccessfully"
    }
    return result
  }
  
  /**
   * Handles the change of rule in the retry process. It sets the number of tries and progress percentage to 
   * initial values, finds the next rule to retry, and sets it as the current retry rule.
   * Sends a final POST request to the server with the updated rule list and the end result.
   */
  const handleRetryRuleChange = async () => {
    await new Promise((resolve) => setTimeout(resolve, 500))
    if(!isRetryRuleEnd(currentRetryRule)) {
      setTries(firstTry)
      setProgressPercentage(0)
      let nextRetryRule = Object.values(retryRules).find(rule => rule.key === currentRetryRule.nextRule)
      setCurrentRetryRule(nextRetryRule)
    } else if (isRetryRuleEnd(currentRetryRule)) {
      let result
      let id = uuidv4()
      setUuid(id)
      let rList = [...ruleList]

      rList = rList.map(rule => {
        let retryRule = retryRules.find(r => r.key === rule.key)
        if (retryRule && rule.responseStatus !== retryRule.responseStatus) {
          rule.responseStatus = retryRule.responseStatus
        }
        return rule
      })

      setRuleList(rList)
      
      if (isRetryRuleEnd(currentRetryRule) && isRuleEnd(rList[0])) {
        result = handleEndResultAndAppStatus(rList)
      } else if (currentRetryRule.continueOption === true) {
        setAppStatus("paused")
        result = "incomplete"
      } else {
        setAppStatus("error")
        result = "incomplete"
      }

      const response = await fetch('/api/data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          uid: id,
          sequence: rList,
          action: action,
          result: result
        }),
      })
      if (response.ok) {
        console.log('Data posted successfully')
      } else {
        console.log('Failed to post data')
      }
      setCurrentRetryRule(null)
    }
  }

  /**
   * Handle copy UUID onClick event.
   */
  const handleCopy = () => {
    navigator.clipboard.writeText(uuid)
      .catch((error) => {
        console.error('Failed to copy text:', error)
      })
  }

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
            <div className="skeleton-text2"></div>
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
/**
 * Hybrid Work-from-Home Security Assessment
 *
 * This application assesses security requirements of staff devices to ensure they meet the necessary criteria for safely connecting remotely 
 * to TRU's network as part of the hybrid Work-from-Home program. It was initialized using create-react-app.
 *
 * Main Component
 * 
 * This component represents the main entry point of the web app.
 * It serves as the container for the entire application and handles
 * the overall layout and function.
 * 
 * Features:
 * - Fetches the rules_config.json file from the server and stores it in state.
 * - Automatically send the data of each assessment to a database for logging.
 * - Real-time updates to the rules_config.json file are reflected in the app.
 * - Progress bar to show the user how far along they are in each individual security check.
 * - Feedback message to inform the user based on the status of the application.
 * - Control buttons to allow the user to start and restart the security check assessment and retry the last failed security check.
 * - A spinner to indicate when the application is busy.
 * - Responsive design for mobile, tablet, and desktop.
 * - Cross-browser compatibility.
 * - Error handling for failed mandatory security checks.
 * - Complies to ES6 standards.
 * 
 * Libraries/Dependencies:
 * Node.js: JavaScript runtime environment.
 * React: JavaScript library for building user interfaces.
 * Bootstrap: Popular CSS framework for responsive and mobile-first web development.
 * MariaDB: Database management system for storing the data of the security check assessments.
 * Express: Web application framework for building server side applications in Node.js.
 * react-scripts: Configuration and scripts for running a React application in development and production environments.
 * uuid: Library for generating unique identifiers (UUIDs) for each security check assessment.
 * whatwg-fetch: Polyfill that provides a global fetch function for making web requests in browsers that do not support the native Fetch API.
 * 
 * Author: Trevor Drayton
 * Version: 1.0.0
 * Last Updated: May 31, 2023
 * 
 * Thompson Rivers University
 * Department: Information Security
 * Contact: draytont10@mytru.ca or trevorpdrayton@gmail.com
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

function App() {

  /**
   * Constants
   * 
   * firstTry is the initialization of the fetch loop
   * firstRule is the key value that determines which rule in the rule_config.json file the fetch loop begins with
   * baseUrl is the server url for the HIPS requests
   */
  const firstTry = 0
  const firstRule = "FirstRule"
  const delay = "tryDelay"
  const baseUrl = process.env.REACT_APP_HIPS_BASE_URL

  /**
   * State Variables
   * 
   * appStatus refers to whether the entire app is running, idle, completed, or error (which is completed with a failed mandatory security check)
   * responseStatus refers to the http response status code; it gets appended to rules added to the ruleList
   * rules is the rules_config.json data
   * currentRule refers to the rule currently undergoing security assessment (the current rule in the flow chart / sequence of rules)
   * tries refers to the count for the number of fetch requests for the current rule, which increments until each rule's maxTries
   * progressPercentage refers to the value that's used for the progress bar component (ProgressIndicator.js)
   * uuid is the unique identifier for the current sequence to show, to be passed to RuleList to be shown on the front end
   * action is for the purpose of logging 
   */
  const [appStatus, setAppStatus] = useState('idle')
  const [responseStatus, setResponseStatus] = useState(null)
  const [rules, setRules] = useState({})
  const [currentRule, setCurrentRule] = useState(null)
  const [ruleList, setRuleList] = useState([])
  const [retryRules, setRetryRules] = useState(null)
  const [currentRetryRule, setCurrentRetryRule] = useState(null)
  const [tries, setTries] = useState(firstTry)
  const [tryDelay, setTryDelay] = useState(firstTry)
  const [progressPercentage, setProgressPercentage] = useState(0)
  const [uuid, setUuid] = useState(null)
  const [action, setAction] = useState(null)
  const [endPathLength, setEndPathLength] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  /**
   * OnComponentDidMount Side Effect (called once after rendering)
   * 
   * This side effect fetches the rules_config.json file and store the config data in the rules state.
   * 
   * @param {function} fetch - fetches the rules_config.json file from the server
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
  }, []);

  /**
   * Handles the start and restart button onClick events.
   *
   * This function sets the application status to 'running' and resets the app state if it is not already running.
   * It also gathers the action from the button that was clicked for logging.
   * 
   * @param {string} action - the action that was clicked (start, restart, or retry)
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
   * Handles the retry button click event.
   * 
   */
  const handleRetry = async () => {
    setAction('retry')
    setAppStatus('retry')
    setProgressPercentage(0)
    setTries(firstTry)
    let retryRules = Object.values(ruleList).filter(rule => rule.responseStatus !== 200 && rule.failRule === "end")
    let updatedRetryRules = [...retryRules].reverse().map((rule, index, array) => {
      if (index < array.length - 1) {
        return {
          ...rule,
          nextRule: array[index + 1].key
        };
      } else {
        return {
          ...rule,
          nextRule: null
        };
      }
    });
    setRetryRules(updatedRetryRules);
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
   * Used to set the state of the app for the next security check (aka rule); called in handleRuleChange 
   * and sets the next security check using the rule passed as an argument.
   * 
   * @param {string} nextRule - the key value of the next rule to be evaluated
   */
  const changeToRule = (nextRule) => {
    setCurrentRule(Object.values(rules).find(rule => rule.key === nextRule))
    setTries(firstTry)
    setResponseStatus(null)
    setProgressPercentage(0)
    handleStart(action)
  }

  /**
   * This asynchronous function is called when a rule change occurs.
   * 
   * It evaluates the current rule and response status to determine the next actions, 
   * contains a short timeout to help the UI run smoother, and
   * appends the response status and uuid to the current rule before adding them to the rule array.
   */
  const handleRuleChange = async () => {
    await new Promise((resolve) => setTimeout(resolve, 500))
    currentRule.responseStatus = responseStatus
    if (isPassRule(currentRule)) {
      changeToRule(currentRule.passRule)
    } else if (isFailRule(currentRule)) {
      changeToRule(currentRule.failRule)
    } else {
      handleNoRuleChange(currentRule, ruleList);
    }
    setRuleList(prevArray => [currentRule, ...prevArray])
  }
  
  const isPassRule = (currentRule) => {
    return currentRule.passRule.toLowerCase() !== "end" && (currentRule.responseStatus >= 200 && currentRule.responseStatus <= 299);
  }
  
  const isFailRule = (currentRule) => {
    return currentRule.failRule.toLowerCase() !== "end" && (currentRule.responseStatus > 299 || currentRule.responseStatus === null);
  }
  
  const handleNoRuleChange = async (currentRule, ruleList) => {
    let rList = [currentRule, ...ruleList] // synchronous solution for posting immediately
    let id = uuidv4()
    setUuid(id)
    let result
  
    if (isRuleEnd(currentRule)) {
      result = handleEndResultAndAppStatus(rList);
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
  
  const isRuleEnd = (currentRule) => {
    return currentRule.passRule.toLowerCase() === "end" && currentRule.failRule.toLowerCase() === "end";
  }
  const isRetryRuleEnd = (currentRetryRule) => {
    return currentRetryRule.nextRule === null
  }
  
  const handleEndResultAndAppStatus = (rList) => {
    let result;
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
    return result;
  }
  
  const handleRetryRuleChange = async () => {
    await new Promise((resolve) => setTimeout(resolve, 500))
    if(!isRetryRuleEnd(currentRetryRule)) {
      setTries(firstTry)
      setProgressPercentage(0)
      let nextRetryRule = Object.values(retryRules).find(rule => rule.key === currentRetryRule.nextRule);
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
        result = handleEndResultAndAppStatus(rList);
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
   * Handle copy I.D. number onClick event.
   * 
   * This function is used to copy the uuid that is generated when a mandatory security check is not passed.
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
   * Side effects related to progress reaching 100%.
   * 
   * This effect hook is triggered when there are changes in the 'progressPercentage' state.
   * It calls handleRuleChange when progress percentage reaches 100%.
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
   * Side effects that manage the fetch requests.
   * 
   * It immediately executes an asynchronous function that handles rule processing only if app status is 'running'.
   * It performs multiple checks and fetches data based on different conditions.
   * It sets the number of tries, breaks the fetch loop if necessary, and sets the progress percentage to 100.
   */
  useEffect(() => {
    let currentTries = tries
    let shouldBreak = false
    let response = null
    if (appStatus === 'running') {
      (async () => {
        // this loop is looking for changes in the response status
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

  useEffect(() => {
    let currentTries = tries
    let shouldBreak = false
    let response = null

    if (appStatus === "retry") {
      (async () => {
        while (currentTries < currentRetryRule.maxTries && !shouldBreak) {
          await new Promise((resolve) => setTimeout(resolve, tryDelay)) // has to be here
          try {
            response = await fetch(baseUrl + currentRetryRule.port)
            let status = response.status
            if (currentRetryRule.responseStatus !== status) {
              setProgressPercentage(100);
              shouldBreak = true;
              setRetryRules(prevRetryRules => {
                let updatedRetryRules = [...prevRetryRules];
                console.log(typeof updatedRetryRules)
                let index = updatedRetryRules.findIndex(rule => rule.key === currentRetryRule.key);
                if (index !== -1) {
                  updatedRetryRules[index] = {
                    ...updatedRetryRules[index],
                    responseStatus: status
                  }
                }
                return updatedRetryRules;
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
   * Side effect that determines if a singular endpath is possible.
   */
  useEffect(() => {
    if(ruleList.length !== 0 && appStatus !== 'retry') {
      let tempCurrentRule = ruleList[0]
      let count = 0
        while (tempCurrentRule.passRule.toLowerCase() !== "end" && tempCurrentRule.failRule.toLowerCase() === "end") {
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
              hasUnsuccessfulRules={ruleList.some(rule => rule.response !== 200)}
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
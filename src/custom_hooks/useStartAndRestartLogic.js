import { useState, useCallback } from 'react'
import { isPassRule, isFailRule, isRuleEnd } from '../helpers/helpers'
import { v4 as uuidv4 } from 'uuid'

/**
 * Custom Hook: useStartAndRestartLogic
 * 
 * Description:
 * This custom hook manages the state and logic for starting, restarting, and processing rules in the web application.
 * It uses React hooks, such as useState and useCallback, to manage various state variables and functions.
 * The hook encapsulates the application status, response status, progress percentage, rule list, tries count,
 * action type, unique identifier (UUID), and handles various user actions for rule assessment.
 * It also handles the logic to change the current rule, update the rule list, and determine the end result of the assessment.
 * 
 * Parameters:
 * @param {string} firstRule - The key property value of the first rule to start the assessment.
 * @param {object} rules - The object containing rules configuration data fetched from the server.
 * @param {object} currentRule - The current rule being processed from the fetched rules data.
 * @param {function} setCurrentRule - The function to set the currentRule state.
 * 
 * Return Values:
 * The hook returns an object containing various state variables and functions related to rule assessment and processing.
 * - action: The action type [start, restart, retry, continue] indicating user events.
 * - appStatus: The current status of the application [idle, running, completed, error, paused].
 * - progressPercentage: The progress percentage for the current rule processing.
 * - ruleList: An array of rules that have been assessed and logged in the database as 'sequence.'
 * - tries: The number of fetch attempts for the current rule.
 * - responseStatus: The HTTP response status code for the current rule.
 * - uuid: The unique identifier (UUID) for the current sequence, referencing the sequence in the database.
 * - handleStart: A function to handle the start and restart button onClick events.
 * - handleRuleChange: A function to change the current rule and update the rule list with the results of rule assessment.
 * - handleEndResultAndAppStatus: A function to evaluate the rule list and determine the end result and change the app status to completed.
 * - setAction: A function to set the action state.
 * - setAppStatus: A function to set the appStatus state.
 * - setProgressPercentage: A function to set the progressPercentage state.
 * - setRuleList: A function to set the ruleList state.
 * - setTries: A function to set the tries state.
 * - setResponseStatus: A function to set the responseStatus state.
 * - setUuid: A function to set the uuid state.
 */
function useStartAndRestartLogic(firstRule, rules, currentRule, setCurrentRule) {

/**
 * State Variables
 * 
 * appStatus is the primary state of the app [idle, running, completed, error, paused]
 * responseStatus refers to the http response status code; it gets appended to rules in the ruleList
 * ruleList is an array of rules that have been assessed, logged in the database as 'sequence' and used to show the user their results
 * tries keeps count of the number of fetch requests for the current rule
 * progressPercentage refers to the value that's used for the progress bar component [ProgressIndicator.js]
 * uuid is the unique identifier for the current sequence, referencing the sequence in the database
 * action is for the purpose of logging the user event [start, restart, retry, continue]
 */
  const [appStatus, setAppStatus] = useState('idle')
  const [responseStatus, setResponseStatus] = useState(null)
  const [progressPercentage, setProgressPercentage] = useState(0)
  const [ruleList, setRuleList] = useState([])
  const [tries, setTries] = useState(0)
  const [action, setAction] = useState(null)
  const [uuid, setUuid] = useState(null)

  /**
   * Handles the start and restart button onClick events.
   *
   * This function sets the application status to 'running' and resets the app state if it is not already running.
   * It also receives the action from the button that was clicked for logging purposes.
   * 
   * @param {string} action - the user event
   */
  const handleStart = useCallback((action) => {
    setAction(action)
    setAppStatus('running')
    if (appStatus !== 'running') {
      setProgressPercentage(0)
      setRuleList([])
      setCurrentRule(Object.values(rules).find(rule => rule.key === firstRule))
      setTries(0)
    }
  },[appStatus, rules])

  /**
   * Encapsulates the logic required to change the current rule to either the pass rule, fail rule, or end rule,
   * and update the rule list with the results of the current rule's assessment.
   * Called when progress of the currentRule reaches 100%.
   */  
  const handleRuleChange = useCallback(async () => {
    await new Promise((resolve) => setTimeout(resolve, 500))
    currentRule.responseStatus = responseStatus
    if (isPassRule(currentRule)) {
      changeToRule(currentRule.passRule)
    } else if (isFailRule(currentRule)) {
      changeToRule(currentRule.failRule)
    } else {
      handleNoRuleChange(currentRule, ruleList)
    }

    // prevents duplicates that can occur in very specific situations
    let isRuleAlreadyPresent = ruleList.some(rule =>
      Object.keys(rule).every(key => rule[key] === currentRule[key])
    )
    if(!isRuleAlreadyPresent){
    setRuleList(prevArray => [currentRule, ...prevArray])
    }
  },[currentRule, responseStatus, ruleList])

  /**
   * Used to set the state of the app for the next rule utilized in handleRuleChange.
   * 
   * @param {string} nextRule - the key property value
   */
  const changeToRule = useCallback((nextRule) => {
    setCurrentRule(Object.values(rules).find(rule => rule.key === nextRule))
    setTries(0)
    setResponseStatus(null)
    setProgressPercentage(0)
  },[rules])

  /**
   * Used in both the standard process and the retry process.
   * 
   * Evaluates the rule list to determine the end result and change the app state to completed.
   * 
   * @param {array} rList - the list of rules that have been evaluated
   * @returns {string} - the end result of the assessment
   */
  const handleEndResultAndAppStatus = useCallback((rList) => {
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
  },[])

  /**
   * Handles scenarios where no rule change occurs, determining the final state and logging.
   * 
   * @param {object} currentRule - the current rule being evaluated
   * @param {array} ruleList - the list of rules that have been evaluated so far
   */
  const handleNoRuleChange = useCallback(async (currentRule, ruleList) => {
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
  },[action])

  return {
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
  }
}

export default useStartAndRestartLogic
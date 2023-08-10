import { useState, useCallback } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { isRuleEnd, isRetryRuleEnd, isUnsuccessful, isAWarning, isAnError } from '../helpers/helpers'

/**
 * Custom Hook: useRetryLogic
 * 
 * Description:
 * This custom hook manages the state and logic for retrying rule assessments in the web application.
 * It takes several state variables and functions as parameters to coordinate the retry mechanism.
 * The hook works in conjunction with the useStartAndRestart custom hook to provide retry functionality for incomplete rules.
 * It uses React hooks, such as useState and useCallback, to manage various state variables and functions.
 * The hook is responsible for retrying the assessment of incomplete rules, updating the app status, progress percentage,
 * tries count, rule list, and UUID for each retry attempt. It also manages the action type for logging purposes.
 * 
 * Parameters:
 * @param {function} handleEndResultAndAppStatus - The function to evaluate the rule list and determine the end result and app status.
 * @param {function} setAppStatus - The function to set the appStatus state in the parent component.
 * @param {function} setProgressPercentage - The function to set the progressPercentage state in the parent component.
 * @param {function} setTries - The function to set the tries state in the parent component.
 * @param {array} ruleList - An array of rules that have been assessed and logged in the database as 'sequence.'
 * @param {function} setRuleList - The function to set the ruleList state in the parent component.
 * @param {function} setUuid - The function to set the uuid state in the parent component.
 * @param {string} action - The action type [start, restart, retry, continue] indicating user events.
 * @param {function} setAction - The function to set the action state in the parent component.
 * 
 * Return Values:
 * The hook returns an object containing state variables and functions related to retry logic.
 * - currentRetryRule: The current retry rule being processed during retry attempts.
 * - handleRetry: A function to handle the retry button onClick event.
 * - handleRetryRuleChange: A function to update the retry rule and retry the rule assessment.
 * - setRetryRules: A function to set the retryRules state in the parent component.
 */
function useRetryLogic(handleEndResultAndAppStatus, setAppStatus, setProgressPercentage, setTries, ruleList, setRuleList, setUuid, action, setAction, rules, setCurrentRule) {
  /**
   * State Variables
   * 
   * retryRules is an array of rules that have been filtered from the ruleList to be retried
   * currentRetryRule refers to the rule currently undergoing the retry assessment
   */
  const [retryRules, setRetryRules] = useState(null)
  const [currentRetryRule, setCurrentRetryRule] = useState(null)

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
  const handleRetry = useCallback(async (type) => {
    setAction('retry')
    setAppStatus('retry')
    setProgressPercentage(0)
    setTries(0)
    console.log("handleRetry ruleList", ruleList) // testing
    let retryRules
    if (!type) {
      retryRules = Object.values(ruleList).filter(rule => isUnsuccessful(rule))
    } else if (type === "warning") {
      retryRules = Object.values(ruleList).filter(rule => isAWarning(rule))
    } else {
      retryRules = Object.values(ruleList).filter(rule => isAnError(rule))
    }
    let filteredRetryRules = [...retryRules].reverse().map((rule, index, array) => {
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
    setRetryRules(filteredRetryRules)
    setCurrentRetryRule(filteredRetryRules[0])
  },[ruleList])

  /**
   * Handles the change of rule in the retry process. It sets the number of tries and progress percentage to 
   * initial values, finds the next rule to retry, and sets it as the current retry rule.
   * Sends a final POST request to the server with the updated rule list and the end result.
   */
  const handleRetryRuleChange = useCallback(async () => {
    await new Promise((resolve) => setTimeout(resolve, 500))
    if(!isRetryRuleEnd(currentRetryRule)) {
      setTries(0)
      setProgressPercentage(0)
      let nextRetryRule = Object.values(retryRules).find(rule => rule.key === currentRetryRule.nextRule)
      setCurrentRetryRule(nextRetryRule)
      console.log("not is retry rule end") // testing
    } else if (isRetryRuleEnd(currentRetryRule)) {
      console.log("retry rule is end") // testing
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

    const postRequest = async() => {
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
      }}

      if (isRuleEnd(rList[0])) {
        result = handleEndResultAndAppStatus(rList)
        postRequest()
      } else if (currentRetryRule.continueOption === true && rList.some(rule => isAnError(rule))) {
        setAppStatus("paused") 
        result = "incomplete"
        postRequest()
      } else if (currentRetryRule.continueOption === false && rList.some(rule => isAnError(rule))){
        setAppStatus("error")
        result = "incomplete"
        postRequest()
      } else if(!isRuleEnd(rList[0]) && rList.every(rule => !isAnError(rule))) {
        setAction('continue')
        setAppStatus('running')
        setCurrentRule(Object.values(rules).find(rule => rule.key === currentRetryRule.passRule))
        setProgressPercentage(0)
        setTries(0)
      } 

      setRuleList(rList)
      setCurrentRetryRule(null)
    }
  },[currentRetryRule, retryRules, ruleList, action, rules])

  return {
    currentRetryRule,
    handleRetry,
    handleRetryRuleChange,
    setRetryRules,
  }
}

export default useRetryLogic
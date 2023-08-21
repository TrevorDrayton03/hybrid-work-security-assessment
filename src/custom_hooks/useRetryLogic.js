import { useState, useCallback } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { isRuleEnd, isRetryRuleEnd, isUnsuccessful, isAWarning, isAnError } from '../helpers/helpers'

/**
 * Custom Hook: useRetryLogic
 * 
 * Description:
 * This custom hook provides the functions for reassessing violations.
 * 
 * Parameters:
 * @param {function} handleEndResultAndAppStatus - Function to evaluate the rule list, determine the end result, set the action state, and change the app status to completed.
 * @param {function} setAppStatus - Asynchronous function to set the appStatus state.
 * @param {function} setProgressPercentage - Asynchronous function to set the progressPercentage state.
 * @param {function} setTries - Asynchronous function to set the tries state.
 * @param {array} ruleList - Array, evaluated instructions in sequence.
 * @param {function} setRuleList - Asynchronous function to set the ruleList state.
 * @param {function} setUuid - Asynchronous function to set the uuid state.
 * @param {string} action - start, restart, retry, or continue.
 * @param {function} setAction - Asynchronous function to set the action state.
 * 
 * Return Values:
 * The hook returns an object containing state variables and functions related to retry logic.
 * - currentRetryRule: Current violation.
 * - handleRetry: Function to handle the user clicking on the retry button.
 * - handleRetryRuleChange: Function to handle changing to the next violation.
 * - setRetryRules: Asynchronous function to set the retryRules state.
 */
function useRetryLogic(handleEndResultAndAppStatus, setAppStatus, setProgressPercentage, setTries, ruleList, setRuleList, setUuid, action, setAction, rules, setCurrentRule) {
  /**
   * State Variables
   * 
   * retryRules is an array of the violations of the assessment
   * currentRetryRule is the violation being reevaluated.
   */
  const [retryRules, setRetryRules] = useState(null)
  const [currentRetryRule, setCurrentRetryRule] = useState(null)

  /**
   * Function to handle the user clicking on the retry button.
   * 
   * @param {string} type - violations type (warning, error, or all (null))
   */
  const handleRetry = useCallback(async (type) => {
    setAction('retry')
    setAppStatus('retry')
    setProgressPercentage(0)
    setTries(0)
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
   * Function to handle changing to the next violation.
   * Sends a final POST request to the server with the updated rule list and the end result.
   */
  const handleRetryRuleChange = useCallback(async () => {
    await new Promise((resolve) => setTimeout(resolve, 500))
    if(!isRetryRuleEnd(currentRetryRule)) {
      setTries(0)
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
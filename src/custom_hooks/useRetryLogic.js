import { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid'
import { isRuleEnd, isRetryRuleEnd, isSecurityCheck, isUnsuccessful, isAWarning, isAnError } from '../helpers/helpers'

function useRetryLogic(handleEndResultAndAppStatus, setAppStatus, setProgressPercentage, setTries, ruleList, setRuleList, setUuid, action, setAction) {
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
  },[currentRetryRule, retryRules, ruleList, action])
  return {
    retryRules,
    currentRetryRule,
    handleRetry,
    handleRetryRuleChange,
    setRetryRules,
  };
}

export default useRetryLogic;
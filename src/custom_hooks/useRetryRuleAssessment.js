import { useEffect } from 'react'

/**
 * Custom Hook: useRetryRuleAssessment
 * 
 * Description:
 * This custom hook reassesses violations (when the user retries), dependent on currentRetryRule and appStatus.
 * It functions similarly to useStandardRuleAssessment custom hook, with the difference being
 * that it is just looking for a change in the rule's response status and updating the ruleList to reflect the change. 
 * 
 * Parameters:
 * @param {object} currentRetryRule - The violation being reevaluated.
 * @param {function} setRetryRules - Asynchronous function to set the retryRules state.
 * @param {string} appStatus - idle, running, completed, error, or paused.
 * @param {number} tryDelay - Delay time (in milliseconds) between tries when evaluation rules.
 * @param {number} tries - Number of fetch attempts for the current rule.
 * @param {function} setTries - The function to set the tries state in the parent component.
 * @param {string} baseUrl - the apache server url
 * @param {function} setProgressPercentage - Asynchronous function to set the progressPercentage state.
 */
function useRetryRuleAssessment(currentRetryRule, setRetryRules, appStatus, tryDelay, tries, setTries, baseUrl, setProgressPercentage) {
  useEffect(() => {
    let currentTries = tries
    let shouldBreak = false
    let response = null

    if (appStatus === "retry") {
      (async () => { // Immediately Invoked Function Expression (IIFE)
        while (currentTries < currentRetryRule.maxTries && !shouldBreak) {
          await new Promise((resolve) => setTimeout(resolve, tryDelay))
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
}

export default useRetryRuleAssessment
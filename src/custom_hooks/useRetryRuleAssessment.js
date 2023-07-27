import { useEffect } from 'react'

/**
 * Custom Hook: useRetryRuleAssessment
 * 
 * Description:
 * This custom hook manages the state and logic for assessing retry rules in the web application.
 * It takes into account the currentRetryRule, application status, tryDelay, tries count, and the base URL for fetch requests.
 * The hook is designed to work with the useStartAndRestart custom hook to provide a retry mechanism for incomplete rules.
 * It uses React hooks, such as useState, to manage state variables and perform rule assessment.
 * The hook is responsible for retrying the assessment of incomplete rules at a specified delay and updating the tries count.
 * When a rule assessment reaches 100% progress, it updates the app status and sets the appropriate progress percentage.
 * 
 * Parameters:
 * @param {object} currentRetryRule - The current retry rule being processed.
 * @param {function} setRetryRules - The function to set the retryRules state in the parent component.
 * @param {string} appStatus - The current status of the application [idle, running, completed, error, paused].
 * @param {number} tryDelay - The delay time (in milliseconds) between retry attempts when processing rules.
 * @param {number} tries - The number of fetch attempts for the current rule.
 * @param {function} setTries - The function to set the tries state in the parent component.
 * @param {string} baseUrl - The base URL used for fetch requests.
 * @param {function} setProgressPercentage - The function to set the progressPercentage state in the parent component.
 * 
 * Return Values:
 * The hook doesn't return any values directly. Instead, it manages state and performs rule assessments as side effects.
 * It updates the app status, progress percentage, and tries count to indicate the progress of rule assessment.
 */
function useRetryRuleAssessment(currentRetryRule, setRetryRules, appStatus, tryDelay, tries, setTries, baseUrl, setProgressPercentage) {

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
}

export default useRetryRuleAssessment
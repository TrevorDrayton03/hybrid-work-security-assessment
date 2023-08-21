import { useEffect } from 'react'

/**
 * Custom Hook: useStandardRuleAssessment
 * 
 * Description:
 * This custom hook is the standard assessment process (when the user starts, restarts, or continues) dependent on currentRule and appStatus.
 * It performs fetch requests to the specified URL (baseUrl + currentRule.port) for a maximum of maxTries times.
 * If the responseStatus changes after the first try or maxTries amount of fetches have been made, the current rule's assessment ends.
 * The hook also sets the progressPercentage state to 100% when the assessment process is complete.
 * 
 * Parameters:
 * @param {object} currentRule - Current rule, initially set to the first rule.
 * @param {string} appStatus - idle, running, completed, error, or paused.
 * @param {number} tryDelay - Delay time (in milliseconds) between tries when evaluation rules.
 * @param {number} tries - Number of fetch attempts for the current rule.
 * @param {function} setTries - Asynchronous function to set the tries state.
 * @param {function} setResponseStatus - Asynchronous function to set the responseStatus state.
 * @param {string} baseUrl - The apache server url
 * @param {function} setProgressPercentage - Asynchronous function to set the progressPercentage state.
 */
function useStandardRuleAssessment(currentRule, appStatus, tryDelay, tries, setTries, setResponseStatus, baseUrl, setProgressPercentage) {

  useEffect(() => {
    let currentTries = tries
    let shouldBreak = false
    let response = null

    if (appStatus === 'running') {
      (async () => { // Immediately Invoked Function Expression (IIFE)
        while (currentTries < currentRule.maxTries && !shouldBreak) {
          await new Promise((resolve) => setTimeout(resolve, tryDelay))
          try {
            response = await fetch(baseUrl + currentRule.port)
            let status = response.status
            if (currentTries === 0) {
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
}

export default useStandardRuleAssessment
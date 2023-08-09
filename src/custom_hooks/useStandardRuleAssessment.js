import { useEffect } from 'react'

/**
 * Custom Hook: useStandardRuleAssessment
 * 
 * Description:
 * This custom hook is a side effect that executes the standard rule assessment process based on the currentRule and appStatus.
 * It performs fetch requests to the specified URL (baseUrl + currentRule.port) for a maximum of maxTries times.
 * The hook identifies the responseStatus on the first try and updates the setResponseStatus state accordingly.
 * If the responseStatus changes after the first try or maxTries amount of fetches have been made, the current rule's assessment ends.
 * The hook also sets the progressPercentage state to 100% when the assessment process is complete.
 * 
 * Parameters:
 * @param {object} currentRule - The current rule being assessed, containing assessment details such as maxTries and port.
 * @param {string} appStatus - The current status of the application [idle, running, completed, error, paused, retry].
 * @param {number} tryDelay - The time in milliseconds to wait between each fetch attempt.
 * @param {number} tries - The number of fetch attempts made for the current rule.
 * @param {function} setTries - A function to set the number of fetch attempts in the parent component.
 * @param {function} setResponseStatus - A function to set the responseStatus in the parent component.
 * @param {string} baseUrl - The base URL for the fetch request.
 * @param {function} setProgressPercentage - A function to set the progressPercentage in the parent component.
 * 
 * Return Values:
 * The hook does not return any values.
 */
function useStandardRuleAssessment(currentRule, appStatus, tryDelay, tries, setTries, setResponseStatus, baseUrl, setProgressPercentage) {

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
            if (currentTries === 0 && status !== 200) {
              setResponseStatus(status)
            } else if (currentTries === 0 && status === 200) { 
              shouldBreak = true
              setResponseStatus(status)
              setProgressPercentage(100)
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
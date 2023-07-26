import { useState, useEffect } from 'react'
import { isRuleEnd, isSecurityCheck} from '../helpers/helpers'

/**
 * Custom Hook: useEndPathLength
 * 
 * Description:
 * This custom hook calculates the length of the path from the current rule to an end rule in the web application.
 * It takes the ruleList, rules, and appStatus as dependencies to determine the end path length.
 * The hook works in conjunction with the useStartAndRestart custom hook to calculate the path length in the application.
 * It uses React hooks, such as useState and useEffect, to manage the endPathLength state and perform side effects.
 * The hook sets the endPathLength state if there is a final, singular path available from the current rule to an end rule.
 * 
 * Parameters:
 * @param {array} ruleList - An array of rules that have been assessed and logged in the database as 'sequence.'
 * @param {object} rules - An object containing all the rules, with rule keys as object keys for easy access.
 * @param {string} appStatus - The current status of the application [idle, running, completed, error, paused, retry].
 * 
 * Return Values:
 * The hook returns an object containing the calculated endPathLength.
 */
const useEndPathLength = (ruleList, rules, appStatus) => {
  /**
   * State Variables
   * 
   * endPathLength is the length of the path from the current rule to an end rule. It requires a final, singular path to be available from the current rule.
   */
    const [endPathLength, setEndPathLength] = useState(null)

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

  return {endPathLength}
}

export default useEndPathLength
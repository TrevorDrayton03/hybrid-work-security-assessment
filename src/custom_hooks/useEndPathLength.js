import { useState, useEffect } from 'react'
import { isFinalRule, isComplianceCheck} from '../helpers/helpers'

/**
 * Custom Hook: useEndPathLength
 * 
 * Description:
 * Sets the endPathLength state if there is a final, singular path available from the current rule to an end rule
 * 
 * Parameters:
 * @param {array} ruleList - evaluated instructions in sequence
 * @param {object} rules - contains rules configuration data fetched from the server
 * @param {string} appStatus - idle, running, completed, error, or paused
 * 
 * Return Values:
 * Returns the endPathLength number to a final rule if possible.
 */
const useEndPathLength = (ruleList, rules, appStatus) => {
  const [endPathLength, setEndPathLength] = useState(null)

  useEffect(() => {
    if(ruleList.length !== 0 && appStatus !== 'retry') {
      let tempCurrentRule = ruleList[0]
      let count = 0
        while (isComplianceCheck(tempCurrentRule)) {
          tempCurrentRule = rules[tempCurrentRule.passRule]
          count++
          if (isFinalRule(tempCurrentRule)) {
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
import { useState, useEffect } from 'react'
import { v4 as uuidv4 } from 'uuid'
import Cookies from 'js-cookie'

/**
 * Custom Hook: useFetchRulesConfig
 * 
 * Description:
 * Fetches the rules_config.json file and stores the data in the rules state
 * Sets the currentRule, tryDelay, and isLoading states
 * 
 * Parameters:
 * @param {string} firstRule - key value of the first instruction from the config file
 * @param {string} delay - key value used to get the delay time from the config file
 * 
 * Return Values:
 * Returns an object containing state variables and functions related to rules data fetching and handling
 * - isLoading: Boolean indicating if the rules configuration data is being fetched
 * - rules: Object, the contents of the config file
 * - tryDelay: Delay time (in milliseconds) between tries when evaluation rules
 * - currentRule: Current rule state, initially set to the first rule
 * - setCurrentRule: Asynchronous function to set the currentRule state
 * - uuid: The unique identifier (UUID) for the current sequence, referencing the sequence in the database
 */
const useFetchRulesConfig = (firstRule, delay) => {
  const [isLoading, setIsLoading] = useState(true)
  const [rules, setRules] = useState({})
  const [tryDelay, setTryDelay] = useState(0)
  const [currentRule, setCurrentRule] = useState(null)
  const [uuid, setUuid] = useState(null)

  useEffect(() => {
    fetch("/api/rules")
      .then(response => response.json())
      .then(config => {
        setRules(config)
        setCurrentRule(Object.values(config).find(rule => rule.key === firstRule))
        setTryDelay(Object.values(config).find(rule => rule.key === delay)?.milliseconds)
        setIsLoading(false)
      })
      .catch(error => {
        console.error('Error:', error)
      })
      if (navigator.cookieEnabled) {
        const userUuid = Cookies.get('user_uuid')
        if (!userUuid) {
          const newUuid = uuidv4()
          Cookies.set('user_uuid', newUuid, { expires: 365 * 10 })
          setUuid(newUuid)
        } else {
          setUuid(userUuid)
        }
      } else {
        setUuid(uuidv4())
      }
  }, [])

  return { isLoading, rules, currentRule, setCurrentRule, tryDelay, uuid }
}

export default useFetchRulesConfig

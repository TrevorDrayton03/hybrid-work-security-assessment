import { useState, useEffect } from 'react'

/**
 * Custom Hook: useFetchRulesConfig
 * 
 * Description:
 * This custom hook fetches the rules_config.json file and stores the data in the rules state.
 * It also sets the currentRule and tryDelay states using the firstRule and delay props.
 * The hook works as an initialization effect on the initial page load.
 * The hook sets the isLoading state to true during data fetching and false once the rules are fetched.
 * 
 * Parameters:
 * @param {string} firstRule - The is the key value of the first instruction from the config file
 * @param {string} delay - The is the key value used to get the delay time from the config file
 * 
 * Return Values:
 * The hook returns an object containing state variables and functions related to rules data fetching and handling.
 * - isLoading: Boolean indicating if the rules configuration data is being fetched.
 * - rules: Object, the contents of the config file.
 * - tryDelay: Delay time (in milliseconds) between tries when evaluation rules.
 * - currentRule: Current rule state, initially set to the first rule.
 * - setCurrentRule: Asynchronous function to set the currentRule state.
 */
const useFetchRulesConfig = (firstRule, delay) => {
  const [isLoading, setIsLoading] = useState(true)
  const [rules, setRules] = useState({})
  const [tryDelay, setTryDelay] = useState(0)
  const [currentRule, setCurrentRule] = useState(null)

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
  }, [])

  return { isLoading, rules, currentRule, setCurrentRule, tryDelay }
}

export default useFetchRulesConfig

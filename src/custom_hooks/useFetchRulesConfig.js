import { useState, useEffect } from 'react'

/**
 * Custom Hook: useFetchRulesConfig
 * 
 * Description:
 * This custom hook fetches the rules_config.json file and stores the configuration data in the rules state.
 * It also sets the currentRule and tryDelay states based on the firstRule and delay provided.
 * The hook works as an initialization effect to fetch rules data on the initial page load.
 * It uses React hooks, such as useState and useEffect, to manage state variables and perform side effects.
 * The hook sets the isLoading state to true during data fetching and false once the rules are fetched.
 * 
 * Parameters:
 * @param {string} firstRule - The key property value of the first rule to set as the currentRule.
 * @param {string} delay - The key property value of the rule containing the tryDelay configuration (in milliseconds).
 * 
 * Return Values:
 * The hook returns an object containing state variables and functions related to rules data fetching and handling.
 * - isLoading: A boolean flag indicating whether the rules are currently fetching (true) or fetched (false).
 * - rules: The rules configuration data fetched from the rules_config.json file.
 * - currentRule: The rule currently being assessed (based on the firstRule provided).
 * - setCurrentRule: A function to set the currentRule state in the parent component.
 * - tryDelay: The time in milliseconds that the fetch loop waits before sending another request (based on the delay provided).
 */
const useFetchRulesConfig = (firstRule, delay) => {

  /**
   * State Variables
   * 
   * rules is the data from rules_config.json
   * isLoading is true if rules are fetching in the initial page load, false if rules are fetched
   * currentRule refers to the rule currently being assessed
   * tryDelay is the time in milliseconds that the fetch loop waits before sending another request, which is read from the rule_config.json file
   */
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

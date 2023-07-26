import { useState, useEffect } from 'react'

/**
 * OnComponentDidMount Side Effect (called on initial page load)
 * 
 * This side effect fetches the rules_config.json file and store the config data in the rules state
 * and lets the app know when the data has been loaded.
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

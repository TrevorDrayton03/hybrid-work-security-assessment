import { useState, useEffect } from 'react';

/**
 * OnComponentDidMount Side Effect (called on initial page load)
 * 
 * This side effect fetches the rules_config.json file and store the config data in the rules state
 * and lets the app know when the data has been loaded.
 */
const useFetchRulesConfig = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [rules, setRules] = useState({});

  useEffect(() => {
    fetch("/api/rules")
      .then(response => response.json())
      .then(config => {
        setRules(config);
        setIsLoading(false);
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }, []);

  return { isLoading, rules };
}

export default useFetchRulesConfig;

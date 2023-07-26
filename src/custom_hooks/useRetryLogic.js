import { useState, useCallback } from 'react';

function useRetryLogic() {
  const [appStatus, setAppStatus] = useState('idle');
  const [progressPercentage, setProgressPercentage] = useState(0);
  const [retryRules, setRetryRules] = useState(null);
  const [currentRetryRule, setCurrentRetryRule] = useState(null);

  const handleRetry = useCallback(async (type) => {
    setAppStatus('retry');
    setProgressPercentage(0);
    setTries(0);
    let retryRules;
    // ... logic to filter retry rules based on type ...
    setRetryRules(filteredRetryRules);
    setCurrentRetryRule(filteredRetryRules[0]);
  }, [ruleList]);

  // ... other logic for handling retry, handleRetryRuleChange, handleEndResultAndAppStatus, etc ...

  return {
    appStatus,
    progressPercentage,
    retryRules,
    currentRetryRule,
    handleRetry,
    handleRetryRuleChange,
    handleEndResultAndAppStatus,
  };
}

export default useRetryLogic;
import { useEffect, useState } from 'react';

function useRuleAssessment(currentRule, appStatus, tryDelay) {
  const [tries, setTries] = useState(0);
  const [responseStatus, setResponseStatus] = useState(null);

  useEffect(() => {
    let currentTries = tries;
    let shouldBreak = false;
    let response = null;

    if (appStatus === 'running') {
      (async () => {
        while (currentTries < currentRule.maxTries && !shouldBreak) {
          await new Promise((resolve) => setTimeout(resolve, tryDelay));
          try {
            response = await fetch(baseUrl + currentRule.port);
            let status = response.status;
            if (currentTries === 0) {
              setResponseStatus(status);
            } else {
              setResponseStatus(prevStatus => {
                if (status !== prevStatus) {
                  shouldBreak = true;
                  setProgressPercentage(100);
                  return status;
                } else {
                  return prevStatus;
                }
              });
            }
          } catch (error) {
            console.log(error);
          }
          if (!shouldBreak) {
            currentTries++;
            setTries(currentTries);
          }
        }
      })();
    }
  }, [currentRule, appStatus]);
  
  return { tries, responseStatus };
}

export default useRuleAssessment;
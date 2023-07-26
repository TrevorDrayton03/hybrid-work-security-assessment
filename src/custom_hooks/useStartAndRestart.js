import { useState, useCallback } from 'react';
import { isPassRule, isFailRule, isRuleEnd } from '../helpers/helpers'
import { v4 as uuidv4 } from 'uuid'

function useStartAndRestart(firstRule, rules) {
  const [appStatus, setAppStatus] = useState('idle');
  const [progressPercentage, setProgressPercentage] = useState(0);
  const [ruleList, setRuleList] = useState([]);
  const [currentRule, setCurrentRule] = useState(null);
  const [tries, setTries] = useState(0);
  const [action, setAction] = useState(null)
  const [responseStatus, setResponseStatus] = useState(null)
  const [uuid, setUuid] = useState(null)

  const handleStart = useCallback((action) => {
    setAction(action)
    setAppStatus('running')
    if (appStatus !== 'running') {
      setProgressPercentage(0)
      setRuleList([])
      setCurrentRule(Object.values(rules).find(rule => rule.key === firstRule))
      setTries(0)
    }
  },[appStatus, rules])

  // ... other logic for handling restart, handleRuleChange, and handleNoRuleChange ...
  const handleRuleChange = useCallback(async () => {
    await new Promise((resolve) => setTimeout(resolve, 500))
    currentRule.responseStatus = responseStatus
    if (isPassRule(currentRule)) {
      changeToRule(currentRule.passRule)
    } else if (isFailRule(currentRule)) {
      changeToRule(currentRule.failRule)
    } else {
      handleNoRuleChange(currentRule, ruleList)
    }
    setRuleList(prevArray => [currentRule, ...prevArray])
  },[currentRule, responseStatus, ruleList])

  const changeToRule = useCallback((nextRule) => {
    setCurrentRule(Object.values(rules).find(rule => rule.key === nextRule))
    setTries(0)
    setResponseStatus(null)
    setProgressPercentage(0)
  },[rules])

  const handleEndResultAndAppStatus = useCallback((rList) => {
    let result
    if (rList.every(rule => rule.responseStatus === 200)) { 
      setAppStatus("completed")
      result = "completed successfully"
    } else if (rList.filter(rule => rule.responseStatus !== 200).every(rule => rule.warning === true)) { 
      setAppStatus("completed")
      result = "completed successfully with warning(s)"
    } else { 
      setAppStatus("completed")
      result = "completed unsuccessfully"
    }
    return result
  },[])

  const handleNoRuleChange = useCallback(async (currentRule, ruleList) => {
    let rList = [currentRule, ...ruleList] // synchronous solution for posting immediately
    let id = uuidv4()
    setUuid(id)
    let result
  
    if (isRuleEnd(currentRule)) {
      result = handleEndResultAndAppStatus(rList)
    } else if (currentRule.continueOption === true) {
      setAppStatus("paused")
      result = "incomplete"
    } else {
      setAppStatus("error")
      result = "incomplete"
    }
  
    const response = await fetch('/api/data', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        uid: id,
        sequence: rList,
        action: action,
        result: result
      }),
    })
    if (response.ok) {
      console.log('Data posted successfully')
    } else {
      console.log('Failed to post data')
    }
  },[action])

  return {
    action,
    appStatus,
    progressPercentage,
    ruleList,
    currentRule,
    tries,
    responseStatus,
    uuid,
    handleStart,
    handleRuleChange,
    handleEndResultAndAppStatus,
    setAction,
    setAppStatus,
    setProgressPercentage,
    setRuleList,
    setCurrentRule,
    setTries,
    setResponseStatus,
    setUuid,
  };
}

export default useStartAndRestart;
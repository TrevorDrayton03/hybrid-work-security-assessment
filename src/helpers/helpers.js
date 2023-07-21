/**
 * Used to determine if a rule is a failed security check.
 * 
 * @param {object} rule - The rule object.
 * @returns {boolean} - True if the rule is a failed security check.
 */
export const isUnsuccessful = (rule) => {
  return ((rule.responseStatus > 299 || rule.responseStatus === null) && rule.failRule === "end") 
}

/**
 * Used to determine if the application is not assessing any rules.
 * 
 * @param {string} appStatus - The application status.
 * @returns {boolean} - True if the application is not assessing any rules.
 */
export const isNotFetching = (appStatus) => {
  return (appStatus !== "running" && appStatus !== "retry")
}

/**
 * Used to determine if a failed security check is an error.
 * 
 * @param {object} rule - The rule object.
 * @returns {boolean} - True if the failed security check is an error.
 */
export const isAnError = (rule) => {
  return (isUnsuccessful(rule) && rule.warning === false)
}

/**
 * Used to determine if a failed security check is a warning.
 * 
 * @param {object} rule - The rule object.
 * @returns {boolean} - True if the failed security check is a warning.
 */
export const isAWarning = (rule) => {
  return (isUnsuccessful(rule) && rule.warning === true)
}

/**
 * Used to determine the amount of failed security checks (errors OR warnings).
 * 
 * @param {object} ruleList - The list of assessed rules.
 * @returns {integer} - Length of failed security checks in the assessed rules.
 */
export const failedCount = (ruleList) =>  {
  return ruleList.filter(rule => rule.responseStatus !== 200 && rule.failRule === "end").length
}

/**
 * Used to determine the amount of successful security checks.
 * 
 * @param {object} ruleList - The list of assessed rules.
 * @returns {integer} - Length of passed security checks in the assessed rules.
 */
export const passedCount = (ruleList) =>  {
  return ruleList.filter(rule => rule.responseStatus === 200).length
}

/**
 * Used to determine the amount of warnings.
 * 
 * @param {object} ruleList - The list of assessed rules.
 * @returns {integer} - Length of warnings in the assessed rules.
 */
export const warningsCount = (ruleList) =>  {
  return ruleList.filter(rule => rule.responseStatus !== 200 && rule.warning === true && rule.failRule === "end").length
}

/**
 * Used to determine the amount of errors.
 * 
 * @param {object} ruleList - The list of assessed rules.
 * @returns {integer} - Length of errors in the assessed rules.
 */
export const errorsCount = (ruleList) =>  {
  return ruleList.filter(rule => rule.responseStatus !== 200 && rule.warning !== true && rule.failRule === "end").length
}

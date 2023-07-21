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
 * Used to determine if a rule is a failed security check.
 * 
 * @param {object} rule - The rule object.
 * @returns {boolean} - True if the rule is a failed security check.
 */
export const isUnsuccessful = (rule) => {
  return ((rule.responseStatus > 299 || rule.responseStatus === null) && rule.failRule.toLowerCase() === "end") 
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
 * Determines if the current rule is a pass rule. A pass rule is one where the 
 * response status for the rule is within the 200-299 range, indicating success, 
 * and the passRule field of the rule isn't "end", meaning there's another rule to follow.
 * 
 * @param {object} rule - the current rule being evaluated
 * @returns {boolean} - true if the current rule is a pass rule, false otherwise
 */
export const isPassRule = (rule) => {
  return rule.passRule.toLowerCase() !== "end" && (rule.responseStatus >= 200 && rule.responseStatus <= 299)
}

/**
 * Determines if the current rule is a fail rule. A fail rule is one where the 
 * response status for the rule is above 299 or null, indicating failure, 
 * and the failRule field of the rule isn't "end", meaning there's another rule to follow.
 * 
 * @param {object} rule - the current rule being evaluated
 * @returns {boolean} - true if the current rule is a fail rule, false otherwise
 */
export const isFailRule = (rule) => {
  return rule.failRule.toLowerCase() !== "end" && (rule.responseStatus > 299 || rule.responseStatus === null)
}

/**
 * Determines if the current rule is an end rule. An end rule is one where both 
 * passRule and failRule fields of the rule are "end", indicating there's no more rule to follow.
 * 
 * @param {object} currentRule - the current rule being evaluated
 * @returns {boolean} - true if the current rule is the end rule, false otherwise
 */
export const isRuleEnd = (rule) => {
  return rule.passRule.toLowerCase() === "end" && rule.failRule.toLowerCase() === "end"
}

/**
 * Determines if the current retry rule in the retry process is the last retry rule. The last
 * retry rule is the one where the nextRule field of the rule is null.
 * 
 * @param {object} currentRetryRule - the current retry rule in the retry process
 * @returns {boolean} - true if the current retry rule in the retry process is the last retry rule, false otherwise
 */
export const isRetryRuleEnd = (rule) => {
  return rule.nextRule === null
}

/**
 * Determines if the current rule is a security check. 
 * A security check is one where the failRule is "end" and there is a passRule to follow.
 * 
 * @param {object} rule - the current rule being evaluated
 * @returns {boolean} - true if the current rule is a security check, false otherwise
 */
export const isSecurityCheck = (rule) => {
  return rule.passRule.toLowerCase() !== "end" && rule.failRule.toLowerCase() === "end"
}

/**
 * Used to determine the amount of failed security checks (errors OR warnings).
 * 
 * @param {object} ruleList - The list of assessed rules.
 * @returns {integer} - Length of failed security checks in the assessed rules.
 */
export const failedCount = (ruleList) =>  {
  return ruleList.filter(rule => rule.responseStatus !== 200 && rule.failRule.toLowerCase() === "end").length
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
  return ruleList.filter(rule => rule.responseStatus !== 200 && rule.warning === true && rule.failRule.toLowerCase() === "end").length
}

/**
 * Used to determine the amount of errors.
 * 
 * @param {object} ruleList - The list of assessed rules.
 * @returns {integer} - Length of errors in the assessed rules.
 */
export const errorsCount = (ruleList) =>  {
  return ruleList.filter(rule => rule.responseStatus !== 200 && rule.warning !== true && rule.failRule.toLowerCase() === "end").length
}

/**
 * Used to determine if there are any unsuccessful rules in the assessed rules.
 * 
 * @param {object} ruleList - The list of assessed rules.
 * @returns {boolean}
 */
export const hasUnsuccessfulRules = (ruleList) => {
  return ruleList.some(rule => isUnsuccessful(rule))
}

/**
 * Used to determine if there are both errors and warnings in the assessed rules.
 * 
 * @param {object} ruleList - The list of assessed rules.
 * @returns {boolean}
 */
export const hasErrorAndWarning = (ruleList) => {
  return (ruleList.some(rule => isAnError(rule)) && ruleList.some(rule => isAWarning(rule)))
}
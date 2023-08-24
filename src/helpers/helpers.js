/**
 * These helpers are general purpose functions that may be used up to multiple times throughout the application.
 */


/**
 * Used to determine if the application is assessing or reassessing.
 * 
 * @param {string} appStatus - idle, running, completed, error, or paused.
 * @returns {boolean} - True if the application is not assessing or reassessing.
 */
export const isNotFetching = (appStatus) => {
  return (appStatus !== "running" && appStatus !== "retry")
}

/**
 * Used to determine if a rule is a violation.
 * 
 * @param {object} rule - The evaluated instruction object.
 * @returns {boolean} - True if the rule is a violation.
 */
export const isViolation = (rule) => {
  return ((rule.responseStatus > 299 || rule.responseStatus === null) && rule.failRule.toLowerCase() === "end") 
}

/**
 * Used to determine if a violation is an error.
 * 
 * @param {object} rule - The evaluated instruction object.
 * @returns {boolean} - True if the violation is an error.
 */
export const isAnError = (rule) => {
  return (isViolation(rule) && rule.warning === false)
}

/**
 * Used to determine if a violation is a warning.
 * 
 * @param {object} rule - The evaluated instruction object.
 * @returns {boolean} - True if the violation is a warning.
 */
export const isAWarning = (rule) => {
  return (isViolation(rule) && rule.warning === true)
}

/**
 * Determines if the instruction evaluated successfully.
 * 
 * @param {object} rule - The evaluated instruction object.
 * @returns {boolean} - true if the current rule is a pass rule, false otherwise
 */
export const isPassRule = (rule) => {
  return rule.passRule.toLowerCase() !== "end" && (rule.responseStatus >= 200 && rule.responseStatus <= 299)
}

/**
 * Determines if the instruction evaluated iunsuccessfully
 * @param {object} rule - the evaluated instruction object.
 * @returns {boolean} - true if the current rule is a fail rule, false otherwise
 */
export const isFailRule = (rule) => {
  return rule.failRule.toLowerCase() !== "end" && (rule.responseStatus > 299 || rule.responseStatus === null)
}

/**
 * Determines if the current rule is a final rule.
 * @param {object} currentRule - the current rule being evaluated
 * @returns {boolean} - true if the current rule is a final rule, false otherwise
 */
export const isFinalRule = (rule) => {
  return rule.passRule.toLowerCase() === "end" && rule.failRule.toLowerCase() === "end"
}

/**
 * Determines if the current retry rule the last violation to reassess.
 * 
 * @param {object} rule - the violation being reevaluated
 * @returns {boolean} - true if the current retry rule in the retry process is the last retry rule, false otherwise
 */
export const isRetryRuleEnd = (rule) => {
  return rule.nextRule === null
}

/**
 * Determines if the current rule is a compliance check. 
 * A compliance check is one where the failRule is "end" and there is a passRule to follow.
 * 
 * @param {object} rule - the current rule being evaluated
 * @returns {boolean} - true if the current rule is a compliance check, false otherwise
 */
export const isComplianceCheck = (rule) => {
  return rule.passRule.toLowerCase() !== "end" && rule.failRule.toLowerCase() === "end"
}

/**
 * Used to determine the amount of violations in the assessment.
 * 
 * @param {object} ruleList - The list of assessed rules.
 * @returns {integer} - Length of violations in the ruleList.
 */
export const failedCount = (ruleList) =>  {
  return ruleList.filter(rule => rule.responseStatus !== 200 && rule.failRule.toLowerCase() === "end").length
}

/**
 * Used to determine the amount of security checks that evaluated successfully.
 * 
 * @param {object} ruleList - The list of assessed rules.
 * @returns {integer} - Length of successfull security checks in the assessed rules.
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
 * Used to determine if there are any violations in the assessed rules.
 * 
 * @param {object} ruleList - The list of assessed rules.
 * @returns {boolean}
 */
export const hasUnsuccessfulRules = (ruleList) => {
  return ruleList.some(rule => isViolation(rule))
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
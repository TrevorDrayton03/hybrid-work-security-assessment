import Button from 'react-bootstrap/Button'
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Dropdown from 'react-bootstrap/Dropdown';

/**
 * Displays the start, restart, retry, and continue buttons based on the application status.
 * @param {string} appStatus - The application status.
 * @param {function} start - The function to start the application from the firstRule.
 * @param {function} retry - The function to retry failed checks.
 * @param {function} continu - The function to continue the application when it's paused on a rule (continue is a keyword).
 * @param {boolean} hasUnsuccessfulRules - The boolean to determine if there are any unsuccessful rules.
 * @param {boolean} hasErrorAndWarning - The boolean to determine if there are both error(s) and warning(s).
 */
const ControlButton = ({ appStatus, start, retry, continu, ruleList }) => {
    let buttonContent
    const restartText = "Restart From Beginning" 
    const retryText = "Retry Failed Check(s)"
    const startText = "Start"
    const continueText = "Continue To Next Check"

    /**
     * Used to determine if a rule is a failed security check.
     * 
     * @param {object} rule - The rule object.
     * @returns {boolean} - True if the rule is a failed security check.
     */
    const isUnsuccessful = (rule) => {
        return ((rule.responseStatus > 299 || rule.responseStatus === null) && rule.failRule === "end") 
    }

    /**
     * Used to determine if a failed security check is an error.
     * 
     * @param {object} rule - The rule object.
     * @returns {boolean} - True if the failed security check is an error.
     */
    const isAnError = (rule) => {
        return (isUnsuccessful(rule) && rule.warning === false)
    }
    
    /**
     * Used to determine if a failed security check is a warning.
     * 
     * @param {object} rule - The rule object.
     * @returns {boolean} - True if the failed security check is a warning.
     */
    const isAWarning = (rule) => {
        return (isUnsuccessful(rule) && rule.warning === true)
    }

    const hasUnsuccessfulRules = () => {
        return ruleList.some(rule => isUnsuccessful(rule))
    }

    const hasErrorAndWarning = () => {
        return (ruleList.some(rule => isAnError(rule)) && ruleList.some(rule => isAWarning(rule)))
    }


    switch (appStatus) {
        case 'idle':
            buttonContent = (
                <Button variant="primary" onClick={() => start('start')}>
                    {startText}
                </Button>
            )
            break
        case 'error':
            buttonContent = (
                <div style={{ padding: '0', margin: '0' }}>
                    <Button variant="primary" onClick={() => start('restart')}>
                        {restartText}
                    </Button>
                    <Dropdown as={ButtonGroup} drop="up">
                        <Button variant="primary2" onClick={() => retry(null)} style={hasErrorAndWarning() ? {marginRight:0} : {marginRight:15}}>{retryText}</Button>
                        {hasErrorAndWarning() ? 
                        <>
                        <Dropdown.Toggle split variant="primary2" style={{marginRight:15}}/>
                        <Dropdown.Menu>
                            <Dropdown.Item onClick={() => retry("error")}>Errors</Dropdown.Item>
                            <Dropdown.Item onClick={() => retry("warning")}>Warnings</Dropdown.Item>
                            <Dropdown.Divider />
                            <Dropdown.Item onClick={() => retry(null)}>All</Dropdown.Item>
                        </Dropdown.Menu></> : null}
                    </Dropdown>
                </div>
            )
            break
        case 'completed':
            buttonContent = (
                <div style={{ padding: '0', margin: '0' }}>
                    <Button variant="primary" onClick={() => start('restart')}>
                        {restartText}
                    </Button>
                    { hasUnsuccessfulRules() && 
                    <Dropdown as={ButtonGroup} drop="up">
                    <Button variant="primary2" onClick={() => retry(null)} style={hasErrorAndWarning() ? {marginRight:0} : {marginRight:15}}>{retryText}</Button>
                    {hasErrorAndWarning() ? 
                    <>
                    <Dropdown.Toggle split variant="primary2" style={{marginRight:15}}/>
                    <Dropdown.Menu>
                        <Dropdown.Item onClick={() => retry("error")}>Errors</Dropdown.Item>
                        <Dropdown.Item onClick={() => retry("warning")}>Warnings</Dropdown.Item>
                        <Dropdown.Divider />
                        <Dropdown.Item onClick={() => retry(null)}>All</Dropdown.Item>
                    </Dropdown.Menu></> : null}
                </Dropdown>
                    }
                </div>
            )
            break
        case 'paused':
            buttonContent = (
                <div style={{ padding: '0', margin: '0' }}>
                    <Button variant="primary" onClick={() => start('restart')}>
                        {restartText}
                    </Button>
                    <Dropdown as={ButtonGroup} drop="up">
                        <Button variant="primary2" onClick={() => retry(null)} style={hasErrorAndWarning() ? {marginRight:0} : {marginRight:15}}>{retryText}</Button>
                        {hasErrorAndWarning() ? 
                        <>
                        <Dropdown.Toggle split variant="primary2" style={{marginRight:15}}/>
                        <Dropdown.Menu>
                            <Dropdown.Item onClick={() => retry("error")}>Errors</Dropdown.Item>
                            <Dropdown.Item onClick={() => retry("warning")}>Warnings</Dropdown.Item>
                            <Dropdown.Divider />
                            <Dropdown.Item onClick={() => retry(null)}>All</Dropdown.Item>
                        </Dropdown.Menu></> : null}
                    </Dropdown>
                    <Button variant="primary3" onClick={continu}>
                        {continueText}
                    </Button> 
                </div>
            )
            break
        default:
            buttonContent = null
    }

    return (
        <div style={appStatus !== 'running' && appStatus !== 'retry' ? { padding: '20px 20px 40px 0px'} : { padding: '5px 10px 5px 0px'}}>
            {buttonContent}
        </div>
    )
}

export default ControlButton

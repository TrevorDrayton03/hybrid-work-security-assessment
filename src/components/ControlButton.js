import Button from 'react-bootstrap/Button'
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Dropdown from 'react-bootstrap/Dropdown';
import { hasUnsuccessfulRules, hasErrorAndWarning } from '../helpers/helpers'

/**
 * Displays the start, restart, retry, and continue buttons based on the application status.
 * @param {string} appStatus - The application status.
 * @param {function} start - The function to start the application from the firstRule.
 * @param {function} retry - The function to retry failed checks.
 * @param {function} continu - The function to continue the application when it's paused on a rule (continue is a keyword).
 * @param {object} ruleList - The list of assessed rules.
 */
const ControlButton = ({ appStatus, start, retry, continu, ruleList }) => {
    let buttonContent
    const restartText = "Restart From Beginning" 
    const retryText = "Retry Failed Checks"
    const startText = "Start"
    const continueText = "Continue"

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
                        <Button variant={hasErrorAndWarning(ruleList) ? "primary-split" : "primary"} onClick={() => retry(null)} style={hasErrorAndWarning(ruleList) ? {marginRight:0} : {marginRight:15}}>{retryText}</Button>
                        {hasErrorAndWarning(ruleList) ? 
                        <>
                        <Dropdown.Toggle split variant="primary" style={{marginRight:15}}/>
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
                    { hasUnsuccessfulRules(ruleList) && 
                    <Dropdown as={ButtonGroup} drop="up">
                    <Button variant={hasErrorAndWarning(ruleList) ? "primary-split" : "primary"} onClick={() => retry(null)} style={hasErrorAndWarning(ruleList) ? {marginRight:0} : {marginRight:15}}>{retryText}</Button>
                    {hasErrorAndWarning(ruleList) ? 
                    <>
                    <Dropdown.Toggle split variant="primary" style={{marginRight:15}}/>
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
                        <Button variant={hasErrorAndWarning(ruleList) ? "primary-split" : "primary"} onClick={() => retry(null)} style={hasErrorAndWarning(ruleList) ? {marginRight:0} : {marginRight:15}}>{retryText}</Button>
                        {hasErrorAndWarning(ruleList) ? 
                        <>
                        <Dropdown.Toggle split variant="primary" style={{marginRight:15}}/>
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
        <div style={appStatus !== 'running' && appStatus !== 'retry' ? { padding: '20px 20px 20px 0px'} : { padding: '5px 10px 5px 0px'}}>
            {buttonContent}
        </div>
    )
}

export default ControlButton

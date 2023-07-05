import Button from 'react-bootstrap/Button'

/**
 * Displays the control button(s) based on the application status.
 * @param {string} appStatus - The application status.
 * @param {function} start - The function to start the application from the firstRule.
 * @param {function} retry - The function to retry a failed check.
 * @param {function} continu - The function to continue the application when it's paused on a rule.
 * @param {function} copy - The function to copy the UUID.
 */
const ControlButton = ({ appStatus, start, retry, continu, copy, isLastRule }) => {
    let buttonContent
    const restartText = "Restart From Beginning" 
    const retryText = "Retry Last Check"
    const startText = "Start"
    const continueText = "Continue To Next Check"
    // const copyButtonName = "Copy Reference Number"

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
                    <Button variant="primary2" onClick={retry}>
                        {retryText}
                    </Button>
                    {/* <Button variant="secondary" onClick={() => copy()}>
                        {copyButtonName}
                    </Button> */}
                </div>
            )
            break
        case 'completed':
            buttonContent = (
                <div style={{ padding: '0', margin: '0' }}>
                    <Button variant="primary" onClick={() => start('restart')}>
                        {restartText}
                    </Button>
                    {/* <Button variant="secondary" onClick={() => copy()}>
                        {copyButtonName}
                    </Button> */}
                </div>
            )
            break
        case 'paused':
            buttonContent = (
                <div style={{ padding: '0', margin: '0' }}>
                    <Button variant="primary" onClick={() => start('restart')}>
                        {restartText}
                    </Button>
                    <Button variant="primary2" onClick={retry}>
                        {retryText}
                    </Button>
                    {!isLastRule && <Button variant="primary3" onClick={continu}>
                        {continueText}
                    </Button>}
                    {/* <Button variant="secondary" onClick={() => copy()}>
                        {copyButtonName}
                    </Button> */}
                </div>
            )
            break
        default:
            buttonContent = null
    }

    return (
        <div style={appStatus !== 'running' ? { padding: '20px 20px 20px 0px'} : { padding: '5px 10px 5px 0px'}}>
            {buttonContent}
        </div>
    )
}

export default ControlButton

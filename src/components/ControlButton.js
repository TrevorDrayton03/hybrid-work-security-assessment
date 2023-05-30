import Button from 'react-bootstrap/Button'

/**
 * Displays the control button(s) based on the application status.
 * @param {string} appStatus - The application status.
 * @param {function} start - The function to start the application.
 * @param {function} retry - The function to retry the failed check.
 */
const ControlButton = ({ appStatus, start, retry }) => {
    let buttonContent

    switch (appStatus) {
        case 'idle':
            buttonContent = (
                <Button variant="primary" onClick={() => start('start')}>
                    Start
                </Button>
            )
            break
        case 'error':
            buttonContent = (
                <div style={{ padding: '0', margin: '0' }}>
                    <Button variant="primary" onClick={() => start('restart')}>
                        Restart
                    </Button>
                    <Button variant="secondary" onClick={retry}>
                        Retry Failed Check
                    </Button>
                </div>
            )
            break
        case 'completed':
            buttonContent = (
                <Button variant="primary" onClick={() => start('restart')}>
                    Restart
                </Button>
            )
            break
        default:
            buttonContent = null
    }

    return (
        <div style={appStatus !== 'running' ? { padding: '20px' } : { padding: '5px' }}>
            {buttonContent}
        </div>
    )
}

export default ControlButton

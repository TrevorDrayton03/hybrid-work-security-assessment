import Button from 'react-bootstrap/Button'

/**
 * Displays the control button(s) based on the application status.
 */
const ControlButton = ({ appStatus, start, retry }) => {
    let buttonContent

    switch (appStatus) {
        case 'idle':
            buttonContent = (
                <Button variant="primary" onClick={start}>
                    Start
                </Button>
            )
            break
        case 'error':
            buttonContent = (
                <div style={{ padding: '0', margin: '0' }}>
                    <Button variant="primary" onClick={start}>
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
                <Button variant="primary" onClick={start}>
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

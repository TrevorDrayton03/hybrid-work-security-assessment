import Button from 'react-bootstrap/Button'

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
                    &nbsp;
                    <Button variant="secondary" onClick={retry}>
                        Retry Last
                    </Button>
                </div>
            )
            break
        case 'completed':
            buttonContent = (
                <div style={{ padding: '0', margin: '0' }}>
                    <Button variant="primary" onClick={start}>
                        Restart
                    </Button>
                </div>
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

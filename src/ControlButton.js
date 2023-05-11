import Button from 'react-bootstrap/Button'

const ControlButton = ({ appStatus, setAppStatus, onGo, onReset }) => {
    const handleOnClick = () => {
        setAppStatus('running')
        if (appStatus === 'completed') {
            onReset()
        }
        onGo()
    }
    
    return (
        <div style={{ padding: '20px' }}>
            {(appStatus === 'idle' || appStatus === 'completed') ? (
                <Button
                    variant="primary"
                    onClick={handleOnClick}
                >
                    Go
                </Button>
            ) : (
                null // button not visible
            )}
        </div>
    );
}

export default ControlButton
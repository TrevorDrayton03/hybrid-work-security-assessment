import Button from 'react-bootstrap/Button'

const ControlButton = ({ appStatus, onGo }) => {
    return (
        <div style={appStatus !== "running" ? { padding: '20px' } : { padding: '5px' }}>
            {(appStatus === 'idle' || appStatus === 'completed') ? (
                <Button
                    variant="primary"
                    onClick={onGo}
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
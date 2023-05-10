import Button from 'react-bootstrap/Button'

const ControlButton = ({ appStatus, setAppStatus, onGo }) => {
    const handleOnClick = () => {
        setAppStatus('running')
        onGo()
    }
    return (
        <div style={{padding:'20px'}}>
            {appStatus === 'idle' ? (
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
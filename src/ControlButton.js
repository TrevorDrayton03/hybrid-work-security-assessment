import Button from 'react-bootstrap/Button'

const ControlButton = ({ status, setStatus }) => {
    const handleOnClick = () => {
        setStatus('running')
    }
    return (
        <div>
            {status === 'idle' ? (
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
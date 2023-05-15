import Button from 'react-bootstrap/Button'

const ControlButton = ({ appStatus, start, retry }) => {
    return (
        <div
            style={appStatus !== "running" ? { padding: '20px' } : { padding: '5px' }}
        >
            {(appStatus === 'idle' || appStatus === 'completed') ? (
                <Button
                    variant="primary"
                    onClick={start}
                >
                    Start
                </Button>
            ) : (appStatus === 'error') ? (
                <div style={{ padding: '0', margin: '0' }}>
                    <Button
                        variant="primary"
                        onClick={start}
                    >
                        Restart
                    </Button>
                    &nbsp;
                    <Button
                        variant="secondary"
                        onClick={retry}
                    >
                        Retry
                    </Button>
                    &nbsp;
                </div>
                // <Button
                //     variant="primary"
                //     onClick={start}
                // >
                //     Restart
                // </Button>
            ) : null
            }
        </div >
    );
}

export default ControlButton
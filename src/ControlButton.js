import Button from 'react-bootstrap/Button'
import { Spinner } from "react-bootstrap";

const ControlButton = ({ appStatus, go }) => {
    return (
        <div
            style={appStatus !== "running" ? { padding: '20px' } : { padding: '5px' }}
        // style={{ padding: '20px' }}
        >
            {(appStatus === 'idle' || appStatus === 'completed' || appStatus === 'error') ? (
                <Button
                    variant="primary"
                    onClick={go}
                    disabled={appStatus === "running" ? true : false}
                >
                    {appStatus !== "running" ?
                        'Go' : <Spinner animation="grow" role="status" size="sm" />
                    }
                </Button>
            ) : (
                null
            )}
        </div>
    );
}

export default ControlButton
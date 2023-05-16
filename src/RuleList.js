import Alert from 'react-bootstrap/Alert';
/**
 * The panel component.
 *
 * This component maintains a list of each rule that has been processed. 
 * 
 * One panel is visible when the current rule fails and failRule is 'end' or if the process completes successfully. 
 *  
 */
const RuleList = ({ ruleArray, appStatus }) => {
    return (
        <div style={{ padding: '10px' }}>
            {Object.values(ruleArray).map((rule) => {
                return (
                    (rule.responseStatus > 299 && rule.failRule.toLowerCase() === "end") ? (
                        <Alert
                            key={rule.key}
                            variant='danger'
                            className="width-flex"
                            style={{ paddingBottom: '5px', paddingTop: '5px', textAlign: 'left' }}
                        >
                            <Alert.Heading
                                style={{ margin: '0px', textAlign: 'left' }}
                            >
                                {rule.title}
                            </Alert.Heading>
                            {rule.failText} <br />
                            Status Code: {rule.responseStatus}.
                        </Alert>
                    ) : null
                )
            })}
            {appStatus === 'completed' && (
                < Alert
                    variant='primary'
                    className="width-flex"
                    style={{ paddingBottom: '5px', paddingTop: '5px', textAlign: 'left' }}
                >
                    <Alert.Heading
                        style={{ margin: '0px', textAlign: 'left' }}
                    >
                        Success!
                    </Alert.Heading>
                    The pre-screen test completed without error.
                </Alert>)
            }
        </div >
    );
}

export default RuleList
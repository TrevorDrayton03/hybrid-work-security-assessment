import Alert from 'react-bootstrap/Alert';

const RuleList = ({ ruleArray, appStatus }) => {
    return (
        <div style={{ padding: '10px' }}>
            {Object.values(ruleArray).map((rule) => {
                return (
                    // only shows the rule in a panel callout if the rule failed and failRule ends
                    (rule.responseStatus > 299 && rule.failRule.toLowerCase() === "end") ? (
                        < Alert
                            key={rule.key}
                            variant='danger'
                            className="width-flex"
                            style={{
                                paddingBottom: '5px', paddingTop: '5px', textAlign: 'left',
                            }}
                        >
                            <Alert.Heading
                                style={{ margin: '0px', textAlign: 'left' }}
                            >
                                {rule.title}
                            </Alert.Heading>
                            {rule.failText} <br />
                            Error Code: {rule.responseStatus}.
                        </Alert>
                    ) : null
                )
            })}
            {appStatus === 'completed' && (
                < Alert
                    variant='primary'
                    className="width-flex"
                    style={{
                        paddingBottom: '5px', paddingTop: '5px', textAlign: 'left'
                    }}
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
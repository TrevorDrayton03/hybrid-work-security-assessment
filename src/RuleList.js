import Alert from 'react-bootstrap/Alert';

const RuleList = ({ ruleArray }) => {
    return (
        <div style={{ padding: '10px' }}>
            {Object.values(ruleArray).map((rule) => {
                return (
                    // only shows the rule in a panel callout if its the last rule that failed and ends
                    (rule.responseStatus > 299 && rule.failRule.toLowerCase() === "end") ? (
                        < Alert
                            key={rule.key}
                            variant='danger'
                            style={{
                                paddingBottom: '5px', paddingTop: '5px', textAlign: 'left',
                                minWidth: '200px', maxWidth: '560px', width: '90vw'
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
                );
            })}
        </div >
    );
}

export default RuleList
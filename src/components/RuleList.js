import Alert from 'react-bootstrap/Alert'
import Button from 'react-bootstrap/Button'

/**
 * The panel component.
 *
 * Maintains a list of each rule that has been processed. 
 * One panel is visible when the current rule fails and failRule is 'end' or if the process completes successfully. 
 */
const RuleList = ({ ruleArray, appStatus, copy, uuid }) => {
    return (
        <div style={{ padding: '10px' }}>
            {Object.values(ruleArray).map((rule) => {
                return (
                    ((rule.responseStatus > 299 || rule.responseStatus === null) && rule.failRule.toLowerCase() === "end") ? (
                        <Alert
                            key={rule.key}
                            variant='danger'
                            className="width-flex"
                            style={{ paddingBottom: '5px', paddingTop: '5px', textAlign: 'left' }}
                        >
                            <Alert.Heading
                                style={{ margin: '0px', alignItems: 'baseline' }}
                                className="row"
                            >
                                <div className="col" style={{ padding: '0' }}>
                                    {rule.title}
                                </div>
                                <div className="col" style={{ padding: '0', textAlign: 'right' }}>
                                    <Button variant="primary" onClick={() => copy()}>
                                        Copy I.D. Number
                                    </Button>
                                </div>
                            </Alert.Heading>
                            {rule.failText} <br /><br />
                            If you require assistance, please contact client services with the following I.D. number: {uuid}.
                            <br /><br />
                            <a
                                href="https://tru.teamdynamix.com/TDClient/84/Portal/Home/"
                                alt="https://tru.teamdynamix.com/TDClient/84/Portal/Home/"
                                target="_blank"
                                rel="noreferrer"
                            >
                                IT Service Desk
                            </a>
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
                    The pre-screening assessment completed without error.
                </Alert>)
            }
        </div >
    )
}

export default RuleList
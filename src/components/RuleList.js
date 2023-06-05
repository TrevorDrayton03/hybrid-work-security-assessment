import Alert from 'react-bootstrap/Alert'
import Button from 'react-bootstrap/Button'

/**
 * The panel component.
 *
 * Maintains a list of each rule that has been processed. 
 * One panel is visible when the current rule fails and failRule is 'end' or if the process completes successfully. 
 * @param {object} ruleArray - The array of assessed rules.
 * @param {string} appStatus - The application status.
 * @param {function} copy - The function to copy the UUID.
 * @param {string} uuid - The UUID.
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
                                    <Button variant="secondary" onClick={() => copy()}>
                                        Copy I.D. Number
                                    </Button>
                                </div>
                            </Alert.Heading>
                            {rule.failText}
                            <br /><br />
                            If you require assistance, please contact client services with your I.D. number: {uuid}.
                            <br></br>
                            <br></br>
                            For your convenience, you can copy the I.D. number by using the Copy I.D. Number button,
                            and you can find the contact information for the IT service desk from the link below.
                            <br /><br />
                            <a
                                href="https://tru.teamdynamix.com/TDClient/84/Portal/Home/"
                                alt="https://tru.teamdynamix.com/TDClient/84/Portal/Home/"
                                target="_blank"
                                rel="noreferrer"
                            >
                                IT Services Portal
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
                        style={{ margin: '0px', alignItems: 'baseline' }}
                        className="row"
                    >
                        <div className="col" style={{ padding: '0' }}>
                            Congratulations!
                        </div>
                        <div className="col" style={{ padding: '0', textAlign: 'right' }}>
                            <Button variant="secondary" onClick={() => copy()}>
                                Copy I.D. Number
                            </Button>
                        </div>
                    </Alert.Heading>
                    Your pre-screening assessment completed successfully without error.
                    <br /><br />
                    Your I.D. number: {uuid}.
                    <br></br>
                    <br></br>
                    For your convenience, you can copy the I.D. number by using the Copy I.D. Number button,
                    which IT Services may require from you. If you lose it, you can run this assessment again for a new one.
                </Alert>)
            }
        </div >
    )
}

export default RuleList
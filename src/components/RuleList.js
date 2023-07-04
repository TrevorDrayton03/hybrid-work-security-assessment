import Alert from 'react-bootstrap/Alert'
import Button from 'react-bootstrap/Button'

/**
 * The panel component.
 *
 * Maintains a list of each rule that has been processed. 
 * One panel is visible when the current rule fails and failRule is 'end' or if the process completes successfully. 
 * @param {object} ruleArray - The array of assessed rules.
 * @param {string} appStatus - The application status.
 * @param {string} uuid - The UUID.
 */
const RuleList = ({ ruleArray, appStatus, uuid }) => {
    return (
        <div style={{ padding: '10px', flex:1, paddingLeft: 0 }}>
            {Object.values(ruleArray).map((rule) => {
                return (
                    ((rule.responseStatus > 299 || rule.responseStatus === null) && rule.failRule.toLowerCase() === "end") ? (
                        <Alert
                            key={rule.key}
                            variant='danger'
                            style={{ paddingBottom: '5px', paddingTop: '5px', textAlign: 'left' }}
                        >
                            <Alert.Heading
                                style={{ margin: '0px', alignItems: 'baseline' }}
                                className="row"
                            >
                                <div className="col" style={{ padding: '0' }}>
                                    {rule.title}
                                </div>
                            </Alert.Heading>
                            {rule.failText}
                        </Alert>
                    ) : null
                )
            })}
            {ruleArray.some(rule => rule.responseStatus > 299 || rule.responseStatus === null) && (
                    <div>
                        <p>
                            Reference number: <b>{uuid}</b>.
                        </p>
                        <p>
                            If you require assistance, please contact client services with the reference number.
                            For your convenience, you can copy the reference number by using the Copy Reference Number button
                            and you can find the contact information for the IT service desk from&nbsp;
                            <a
                                href="https://tru.teamdynamix.com/TDClient/84/Portal/Home/"
                                alt="https://tru.teamdynamix.com/TDClient/84/Portal/Home/"
                                target="_blank"
                                rel="noreferrer"
                                >
                                here.
                            </a>
                        </p>
                    </div>
                )
            }
            {!ruleArray.some(rule => rule.responseStatus > 299 || rule.responseStatus === null) && appStatus === 'completed' && (
                <div style={{padding:0, margin:0}}>
                    < Alert
                        variant='primary'
                        style={{ paddingBottom: '5px', paddingTop: '5px', textAlign: 'left' }}
                    >
                        <Alert.Heading
                            style={{ margin: '0px', alignItems: 'baseline' }}
                            className="row"
                        >
                            <div className="col" style={{ padding: '0' }}>
                                Congratulations!
                            </div>
                        </Alert.Heading>
                        Your pre-screening assessment completed successfully without error.
                    </Alert>
                    <p>
                        Reference number: <b>{uuid}</b>.
                    </p>
                    <p>
                        For your convenience, you can copy the reference number by using the Copy Reference Number button,
                        which&nbsp;
                            <a
                                href="https://tru.teamdynamix.com/TDClient/84/Portal/Home/"
                                alt="https://tru.teamdynamix.com/TDClient/84/Portal/Home/"
                                target="_blank"
                                rel="noreferrer"
                                >
                                IT Services
                            </a> 
                        &nbsp;may require from you. If you lose it, you can run this assessment again for a new one.
                    </p>
                </div>
                )
            }
        </div >
    )
}

export default RuleList
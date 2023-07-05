import Alert from 'react-bootstrap/Alert'
import Button from 'react-bootstrap/Button'
import { RiFileCopy2Line } from "react-icons/ri";
import React, { useState } from "react"

/**
 * The panel component.
 *
 * Maintains a list of each rule that has been processed. 
 * One panel is visible when the current rule fails and failRule is 'end' or if the process completes successfully. 
 * @param {object} ruleList - The array of assessed rules.
 * @param {string} appStatus - The application status.
 * @param {string} uuid - The UUID.
 */
const RuleList = ({ ruleList, appStatus, uuid, copy }) => {
    const [isCopied, setIsCopied] = useState(false);

    const handleClick = () => {
      setIsCopied(true);
      setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    };

    return (
        <div style={{ padding: '10px', flex:1, paddingLeft: 0 }}>
            {Object.values(ruleList).map((rule) => {
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
            {ruleList.some(rule => rule.responseStatus > 299 || rule.responseStatus === null) && appStatus !== "running" && (
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            Reference number:&nbsp;<b>{uuid}</b>&nbsp;
                            <Button
                                variant="secondary"
                                style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                                onClick={() => { copy(); handleClick(); }}
                            >
                                {isCopied ? 'Copied!' : <RiFileCopy2Line style={{alignSelf:'center'}} size={27} />}
                            </Button>
                        </div>
                        <p>
                            If you require assistance, please contact&nbsp;  
                            <a
                                href="https://tru.teamdynamix.com/TDClient/84/Portal/Home/"
                                alt="https://tru.teamdynamix.com/TDClient/84/Portal/Home/"
                                target="_blank"
                                rel="noreferrer"
                                >
                                IT Services
                            </a>
                            &nbsp;with the reference number.
                        </p>
                    </div>
                )
            }
            {!ruleList.some(rule => rule.responseStatus > 299 || rule.responseStatus === null) && appStatus === 'completed' && (
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
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            Reference number:&nbsp;<b>{uuid}</b>&nbsp;
                        <Button
                                variant="secondary"
                                style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                                onClick={() => { copy(); handleClick(); }}
                            >
                                {isCopied ? 'Copied!' : <RiFileCopy2Line style={{alignSelf:'center'}} size={27} />}
                            </Button>
                            </div>
                        <p>  
                            <a
                                href="https://tru.teamdynamix.com/TDClient/84/Portal/Home/"
                                alt="https://tru.teamdynamix.com/TDClient/84/Portal/Home/"
                                target="_blank"
                                rel="noreferrer"
                                >
                                IT Services
                            </a>
                                &nbsp;may require this reference number. If you lose it, you can run this assessment again for a new one.
                        </p>
                    </div>
                </div>
                )
            }
        </div >
    )
}

export default RuleList
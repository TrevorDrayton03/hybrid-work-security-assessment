import Alert from 'react-bootstrap/Alert'
import Button from 'react-bootstrap/Button'
import { RiFileCopy2Line } from "react-icons/ri"
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
    const [isCopied, setIsCopied] = useState(false)

    const handleClick = () => {
      setIsCopied(true)
      setTimeout(() => {
        setIsCopied(false)
      }, 2000)
    }

    const isUnsuccessful = (rule) => {
        return (rule.responseStatus > 299 || rule.responseStatus === null) 
    }

    const isNotFetching = (appStatus) => {
        return (appStatus !== "running")
    }

    const isAnError = (rule) => {
        return (isUnsuccessful(rule) && rule.failRule.toLowerCase() === "end" && rule.warning === false)
    }

    const isAWarning = (rule) => {
        return (isUnsuccessful(rule) && rule.failRule.toLowerCase() === "end" && rule.warning === true)
    }

    const CopyUUID = () => {
        return (
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
        )
    }

    const Panel = ({rule, variant, body}) => {
        console.log(rule, " is the rule", rule.title, " is the title")
        return (
            <Alert
                // key={rule.rule.key}
                variant={variant}
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
                {body}
            </Alert>
        )
    }

    return (
        <div style={{ padding: '10px', flex:1, paddingLeft: 0 }}>
            {isNotFetching(appStatus) && Object.values(ruleList).map((rule) => { // error panels
            console.log(isAnError(rule), " is an error")
                return (
                    isAnError(rule) ? 
                        <Panel rule={rule} variant='danger' body={rule.failText} />
                     : null
                )
            })}
            {appStatus === 'completed' && !ruleList.some(rule => isAnError(rule)) && // complete panel and footer
                ( 
                    <div style={{padding:0, margin:0}}>
                        <Panel rule={{title:"Success"}} variant='primary' body="You can connect to Thompson Rivers University's network." />
                        <div>
                            <CopyUUID />
                            <p>  
                                <a
                                    href="https://tru.teamdynamix.com/TDClient/84/Portal/Home/"
                                    alt="https://tru.teamdynamix.com/TDClient/84/Portal/Home/"
                                    target="_blank"
                                    rel="noreferrer"
                                    >
                                    IT Services
                                </a>
                                &nbsp;may require this reference number. If you lose it, you can restart the assessment for a new one.
                            </p>
                        </div>
                    </div>
                )
            }
            {isNotFetching(appStatus) && Object.values(ruleList).map((rule) => { // error panels
                console.log(isAWarning(rule), " is a warning")
                return (
                    isAWarning(rule) ? 
                        <Panel rule={rule} variant='danger' body={rule.failText} />
                     : null
                )
            })}
            {isNotFetching(appStatus) && ruleList.some(rule => isAnError(rule)) && // error footer
                (
                    <div>
                        <CopyUUID />
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
        </div >
    )
}

export default RuleList
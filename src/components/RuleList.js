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

    let failed = ruleList.filter(rule => rule.responseStatus !== 200 && rule.failRule === "end").length
    let passed = ruleList.filter(rule => rule.responseStatus === 200).length
    let warnings = ruleList.filter(rule => rule.responseStatus !== 200 && rule.warning === true && rule.failRule === "end").length
    let errors = ruleList.filter(rule => rule.responseStatus !== 200 && rule.warning !== true && rule.failRule === "end").length
    let total = passed + errors // warnings are not counted in the total

    const handleClick = () => {
      setIsCopied(true)
      setTimeout(() => {
        setIsCopied(false)
      }, 2000)
    }

    const isUnsuccessful = (rule) => {
        return ((rule.responseStatus > 299 || rule.responseStatus === null) && rule.failRule === "end") 
    }

    const isNotFetching = (appStatus) => {
        return (appStatus !== "running" && appStatus !== "retry")
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
                {/* Your reference number is:&nbsp;<b>{uuid}</b>&nbsp;&nbsp;&nbsp;&nbsp; */}
                Your reference number is:&nbsp;{uuid}&nbsp;&nbsp;&nbsp;&nbsp;

                <Button
                    variant="secondary"
                    style={{ display: 'flex', justifyContent: 'center', alignItems: 'center'}}
                    onClick={() => { copy(); handleClick(); }}
                >
                    {isCopied ? 'Copied!' : <RiFileCopy2Line style={{alignSelf:'center'}} size={27} />}
                </Button>
            </div>
        )
    }

    const Panel = ({ rule, variant, body, success }) => {
        const csvValues = body.includes(':')
        ? body.split(':')[1].trim().split(', ').sort()
        : null;
        if(csvValues) {
            body = body.split(':')[0].trim();
        }
      
        return (
          <Alert
            key={rule.key}
            variant={variant}
            style={{ padding: '5px 0 5px 0', marginBottom: '7px', textAlign: 'left' }}
          >
            <Alert.Heading style={{ margin: '0px', alignItems: 'baseline' }} className="row">
              <div className="col" style={{ padding: '0' }}>
                {success ? null : rule.warning ? <b>Warning: </b> : <b>Error: </b>}
                {success ? <b>{rule.title}</b> : rule.title}
              </div>
            </Alert.Heading>
            {body}
            {csvValues ? csvValues.length > 0 && (
              <ul className="grid-list">
                {csvValues.map((csv, index) => (
                  <li key={index}>{csv}</li>
                )) }
              </ul>
            ): null}
          </Alert>
        );
      };      

    const Summary = () => {
        return (
            <div style ={{padding:0, margin:0}}>
                <p style={{marginBottom: 0}}>
                    Security Check Summary:<br/>
                    <ul>
                        <li>
                            Passed: {passed}
                        </li>
                        <li>
                            Failed: {errors}
                        </li>
                    </ul>
                </p>
            </div>
        )
    }

    return (
        <div style={{ padding: '5px 10px 10px 10px', flex:1, paddingLeft: 0 }}>
            {isNotFetching(appStatus) && Object.values(ruleList).map((rule) => { // error panel
                return (
                    isAnError(rule) ? 
                        <Panel rule={rule} variant='danger' body={rule.failText} success={false} />
                     : null
                )
            })}
            {appStatus === 'completed' && !ruleList.some(rule => isAnError(rule)) && // complete panel
                ( 
                    <Panel rule={{title:"Success"}} variant='primary' body="You passed the assessment and can connect to Thompson Rivers University's network." success={true}/>       
                )
            }
            {isNotFetching(appStatus) && Object.values(ruleList).map((rule) => { // warning panel
                return (
                    isAWarning(rule) ? 
                        <Panel rule={rule} variant='warning' body={rule.failText} success={false}/>
                     : null
                )
            })}
            <div id="footers" style={{margin:0, padding:'20px 0 0 0'}}>
                {isNotFetching(appStatus) && ruleList.some(rule => isUnsuccessful(rule)) && // error footer
                    (
                        <div>
                            {/* You passed {passed}/{total} security check(s). &nbsp; */}
                            {/* <Summary /> */}
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
                {appStatus === 'completed' && !ruleList.some(rule => isUnsuccessful(rule)) && // complete footer
                    (
                        <div>
                            {/* You passed {passed}/{total} security check(s). &nbsp; */}
                            {/* <Summary /> */}
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
                    )
                }
            </div>
        </div >
    )
}

export default RuleList
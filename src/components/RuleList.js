import Alert from 'react-bootstrap/Alert'
import Button from 'react-bootstrap/Button'
import { RiFileCopy2Line } from "react-icons/ri"
import React, { useState } from "react"
import { isNotFetching, isUnsuccessful, isAnError, isAWarning, failedCount, passedCount, warningsCount, errorsCount } from '../helpers/helpers'

/**
 * The panel component to display warnings, errors, and the success panels.
 * Below the aforementioned panels, there are footers displayed based on appstatus.
 * 
 * @param {object} ruleList - The array of assessed rules.
 * @param {string} appStatus - The application status.
 * @param {string} uuid - The UUID.
 * @param {function} copy - The copy UUID function.
 */
const RuleList = ({ ruleList, appStatus, uuid, copy }) => {
    const [isCopied, setIsCopied] = useState(false)

    let failed = failedCount(ruleList)
    let passed = passedCount(ruleList)
    let warnings = warningsCount(ruleList)
    let errors = errorsCount(ruleList)
    let total = passed + errors // warnings are not counted in the total

    /**
     * Calls the copy UUID function and sets the isCopied state to true.
     * Used to give the user a response to let them know when the UUID has been copied.
     */
    const handleClick = () => {
      copy()
      setIsCopied(true)
      setTimeout(() => {
        setIsCopied(false)
      }, 2000)
    }

    /**
     * A subcomponent that displays the UUID and copy UUID button.
     * 
     * @returns {object} - The CopyUUID component [JSX object]. 
     */
    const CopyUUID = () => {
        return (
            <div style={{ display: 'flex', alignItems: 'center' }}>
                Your reference number is:&nbsp;{uuid}&nbsp;&nbsp;&nbsp;&nbsp;
                <Button
                    variant="secondary"
                    style={{ display: 'flex', justifyContent: 'center', alignItems: 'center'}}
                    onClick={() => handleClick()}
                >
                    {isCopied ? 'Copied!' : <RiFileCopy2Line style={{alignSelf:'center'}} size={27} />}
                </Button>
            </div>
        )
    }

    /**
     * A subcomponent that displays the rule list.
     * 
     * @param {object} rule - The rule object.
     * @param {string} variant - The alert variant [primary, warning, danger].
     * @param {string} body - The body text of the alert.
     * @param {boolean} success - A boolean that is used to trigger the success panel.
     * @returns {object} - The RuleList component [JSX object].
     */
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

    /**
     * Meant to utilize the endPathLength and/or show a more overall summary that includes total passed rules out of endlengthpath rules.
     * Not finished or used.
     * 
     * @returns {object} - The Summary component [JSX object]. 
     */
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
        <div style={{ padding: '5px 10px 10px 0', flex:1,}}>
            <div style={{ padding: 0, flex:1, marginLeft: '35px' }}>

            {Object.values(ruleList).map((rule) => { // error panel
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
            {Object.values(ruleList).map((rule) => { // warning panel
                return (
                    isAWarning(rule) ? 
                        <Panel rule={rule} variant='warning' body={rule.failText} success={false}/>
                     : null
                )
            })}
            </div>
            <div id="footers" style={{margin:0, padding:'20px 0 0 0'}}>
                {ruleList.some(rule => isUnsuccessful(rule)) && // error footer
                    (
                        <div>
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
import Accordion from 'react-bootstrap/Accordion';
import Alert from 'react-bootstrap/Alert';


const RuleList = ({ ruleArray, responseStatus }) => {
    return (
        <div style={{ padding: '10px' }}>
            {/* <Accordion defaultActiveKey="0">
                {Object.values(ruleArray).map((rule) => (
                    <Accordion.Item eventKey={rule.key}>
                        <Accordion.Header>{rule.title}</Accordion.Header>
                        <Accordion.Body>
                            {rule.passText}
                        </Accordion.Body>
                    </Accordion.Item>
                ))
                }
            </Accordion> */}
            {/* {Object.values(ruleArray).map((rule) => {
                return (
                    rule.responseStatus >= 200 && rule.responseStatus <= 299 ?
                        < Alert
                            key={rule.key}
                            variant={rule.responseStatus >= 200 && rule.responseStatus <= 299 ? 'success' : 'danger'}
                            style={{ paddingBottom: '5px', paddingTop: '5px' }}
                        >
                            <Alert.Heading
                                style={{ margin: '0px' }}
                            >
                                {rule.title}
                            </Alert.Heading>
                            {rule.responseStatus >= 200 && rule.responseStatus <= 299 ? rule.passText : rule.failText}
                        </Alert>
                    )
                            :
            null
            }

            )) */}
            {Object.values(ruleArray).map((rule) => {
                return (
                    !(rule.responseStatus >= 200 && rule.responseStatus <= 299) ? (
                        < Alert
                            key={rule.key}
                            // variant={rule.responseStatus >= 200 && rule.responseStatus <= 299 ? 'success' : 'danger'}
                            variant='danger'
                            style={{ paddingBottom: '5px', paddingTop: '5px' }}
                        >
                            <Alert.Heading
                                style={{ margin: '0px' }}
                            >
                                {rule.title}
                            </Alert.Heading>
                            {/* {rule.responseStatus >= 200 && rule.responseStatus <= 299 ? rule.passText : rule.failText} */}
                            {rule.failText}
                        </Alert>
                    ) : null
                );
            })}
        </div >
    );
}

export default RuleList
import RuleItem from './RuleItem'
import Accordion from 'react-bootstrap/Accordion';
import Alert from 'react-bootstrap/Alert';


const RuleList = ({ ruleArray }) => {
    {/* {
                Object.values(ruleArray).map((rule, index) => (
                    <RuleItem rule={rule} key={rule.key}> </RuleItem>
                ))
            } */}
    return (
        <div style={{ padding: '20px' }}>
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
            {Object.values(ruleArray).map((rule) => (
                <Alert key={rule.key} variant='success'>
                        <Alert.Heading>{rule.title}</Alert.Heading>
                        {rule.passText}
                </Alert>
            ))
            }
        </div>
    );
}

export default RuleList
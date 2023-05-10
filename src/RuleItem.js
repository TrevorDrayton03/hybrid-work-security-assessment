import Accordion from 'react-bootstrap/Accordion';

const RuleItem = ({ rule }) => {

    return (
        <div style={{ padding: '5px' }}>
            <Accordion></Accordion>
            {rule.title}
        </div>
    );
}

export default RuleItem
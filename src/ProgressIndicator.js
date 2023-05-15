import React from "react"
import ProgressBar from 'react-bootstrap/ProgressBar'
import { Spinner } from "react-bootstrap";

const ProgressIndicator = ({ progressPercentage, currentRule }) => {
    return (
        <div>
            <p style={{ fontSize: '1.25rem', paddingBottom:'20px' }}>
                <Spinner animation="border" role="status" size="sm" /> &nbsp;
                {/* <b> */}
                {currentRule.title}
                {/* <br /> */}
                {/* </b> */}
            </p>
            <ProgressBar
                // animated
                now={progressPercentage}
                key={currentRule.key}
                className="width-flex"
                style={{ height: '25px', borderRadius: '0' }}
            />
        </div>
    );
}

export default ProgressIndicator
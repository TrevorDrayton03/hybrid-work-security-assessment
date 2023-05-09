import React, { useState, useEffect } from "react"
import ProgressBar from 'react-bootstrap/ProgressBar'


const RulePanel = ({ status, title, passText, failText, passRule, failRule }) => {
    return (
        <div>
            {status === 'running' ?
                <div>
                    <ProgressBar now={10}></ProgressBar>
                    <p>
                        {title} <br />
                        {passText} <br />
                        {failText} <br />
                        {passRule} <br />
                        {failRule}
                    </p>
                </div>
                :
                <div>
                    <p>not running</p>
                </div>}
        </div>
    );
}

export default RulePanel
import React, { useState, useEffect } from 'react'
import { Button, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem, Row, Col } from 'reactstrap'
import liveableEnvironment from '../../../assets/image/liveableEnvironment.jpg';
const LiveableEnvironment = () => {
    return <>
        <Row>
                <img style={{top:'100px', transform:'none', left:0, height:'85%'}} src={liveableEnvironment} />
        </Row>
    </>
}

export default LiveableEnvironment

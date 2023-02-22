import React, { useState, useEffect } from 'react'
import { Button, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem, Row, Col } from 'reactstrap'
import regionalCollaboration from '../../../assets/image/regionalCollaboration.jpg';
const ParisAgreement = () => {
    return <>
        <Row>
                <img style={{top:'100px', transform:'none', left:0, height:'85%'}} src={regionalCollaboration} />
        </Row>
    </>
}

export default ParisAgreement

import React, { useState, useEffect } from 'react'
import { Button, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem, Row, Col } from 'reactstrap'
import scientificManagement from '../../../assets/image/scientificManagement.jpg';
const ParisAgreement = () => {
    return <>
        <Row>
                <img style={{top:'100px', transform:'none', left:0, height:'85%'}} src={scientificManagement} />
        </Row>
    </>
}

export default ParisAgreement

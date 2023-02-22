import React, { useState, useEffect } from 'react'
import { Button, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem, Row, Col } from 'reactstrap'
import cleanEnergy from '../../../assets/image/cleanEnergy.jpg';
const ParisAgreement = () => {
    return <>
        <Row>
                <img style={{top:'100px', transform:'none', left:0, height:'85%'}} src={cleanEnergy} />
        </Row>
    </>
}

export default ParisAgreement

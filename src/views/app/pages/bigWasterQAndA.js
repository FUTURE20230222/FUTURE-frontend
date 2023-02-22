import React, { useState, useEffect } from 'react'
import { Button, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem, Row, Col } from 'reactstrap'
import airImprovement from '../../../assets/image/airImprovement.jpg';
const ParisAgreement = () => {
    return <>
        <Row>
                <img style={{top:'100px', transform:'none', left:0}} src={airImprovement} />
        </Row>
    </>
}

export default ParisAgreement

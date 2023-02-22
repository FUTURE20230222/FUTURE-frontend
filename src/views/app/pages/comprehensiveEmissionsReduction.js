import React, { useState, useEffect } from 'react'
import { Button, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem, Row, Col } from 'reactstrap'
import comprehensiveEmissionsReduction from '../../../assets/image/comprehensiveEmissionsReduction.jpg';
const ComprehensiveEmissionsReduction = () => {
    return <>
        <Row>
                <img style={{top:'100px', transform:'none', left:0, height:'85%'}} src={comprehensiveEmissionsReduction} />
        </Row>
    </>
}

export default ComprehensiveEmissionsReduction

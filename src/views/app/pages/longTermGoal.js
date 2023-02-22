import React, { useState, useEffect } from 'react'
import { Button, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem, Row, Col } from 'reactstrap'
import ImageAgreement from '../../../assets/image/cleanAirPlan.jpg';
const ParisAgreement = () => {
    return <>
        <Row>
            <Col sm='6' style={{ paddingLeft: '30px', paddingTop: '10px' }}>
                <h1>《香港清新空氣藍圖2035》長遠目標是甚麼？
                </h1>
                <img style={{ height: 'auto', position: 'relative', top: '0', left: '130px', transform: 'none', display: 'block', width: '60%' }} src={ImageAgreement} />
            </Col>
            <Col sm='6' style={{ top: '30px', paddingRight: '100px', fontSize: '26px', display: 'flex', flexDirection: 'column', alignItems: 'center', }}>
                <p></p>
                {/* <h2 style={{ fontSize: '40px', marginBottom: '30px' }}>《香港清新空氣藍圖2035》</h2> */}
                <div>長遠來說，目標是達至空氣質素全數符合世衞（世界衞生組織）的空氣質素指引最終的所有指標。
                </div>
                <p></p>
                <p></p>
            </Col>
        </Row>
    </>
}

export default ParisAgreement

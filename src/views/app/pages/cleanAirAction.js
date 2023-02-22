import React, { useState, useEffect } from 'react'
import { Button, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem, Row, Col } from 'reactstrap'
import ImageAgreement from '../../../assets/image/sixActions.jpg';
const ParisAgreement = () => {
    return <>
        <Row>
            <Col sm='6' style={{ paddingLeft: '30px', paddingTop: '10px' }}>
                <h1>六大行動</h1>
                <img style={{ height: 'auto', position: 'relative', top: '0', left: '130px', transform: 'none', display: 'block', width: '70%' }} src={ImageAgreement} />
            </Col>
            <Col sm='6' style={{ top: '30px', paddingRight: '100px', fontSize: '26px', display: 'flex', flexDirection: 'column', alignItems: 'center', }}>
                <p></p>
                {/* <h2 style={{ fontSize: '40px', marginBottom: '30px' }}>《香港清新空氣藍圖2035》</h2> */}
                <div>《香港清新空氣藍圖2035》提出六大主要行動，涵蓋「綠色運輸」、宜居環境、全面減排 潔淨能源 科學管理和區域協同 這個展區有具體介紹，歡迎參觀。
                </div>
                <p></p>
                <p></p>
                <a style={{ position: 'sticky', 'bottom': '50px', position: 'absolute', bottom: '0px', left: '40%' }} href="https://www.epd.gov.hk/epd/tc_chi/resources_pub/policy_documents/index.html">想知多啲 按此</a>
            </Col>
        </Row>
    </>
}

export default ParisAgreement

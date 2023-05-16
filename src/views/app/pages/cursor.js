import React, { useState, useEffect } from 'react'
import { Button, Row } from 'reactstrap'
const Cursor = () => {
    return <>
        <Row>
            <Button onClick={() => { fetch('http://localhost:8080/cursor?status=on').catch(err => console.error('Fetch error:', err)) }} style={{ position: 'absolute', left: '35%', top: "50%", transform: "translate(-50%,-50%)", transform: "scale(2, 2)", fontSize: '30px' }}>On</Button>
            <Button onClick={() => { fetch('http://localhost:8080/cursor?status=off').catch(err => console.error('Fetch error:', err)) }} style={{ position: 'absolute', left: '55%', top: "50%", transform: "translate(-50%,-50%)", transform: "scale(2, 2)", fontSize: '30px' }}>Off</Button>
        </Row>
    </>
}

export default Cursor

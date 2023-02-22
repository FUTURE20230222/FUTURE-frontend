import React from 'react';
import { Input, Button, Row, Col } from 'reactstrap';
import { useHistory } from 'react-router-dom';
import './reactHub.css'

const AppItem = ({ imageSrc, appName, appCategory, history }) => {
    return <div onClick={()=>history.push('/projectionApp')} className='appItem'>
        <div>
            <img src={'/icon/' + imageSrc} style={{ width: '80px', position: 'relative', transform: 'none', top: 0, left: 0 }}></img>
        </div>
        <div>
            <div style={{fontSize:'28px'}}>{appName}</div>
            <div>{appCategory}</div>
        </div>
    </div>
}

const TopNav = () => {
    return (<>
        <div id='nav-container' style={{ height: 100 }}>
            <img style={{ width: '100px', height: '50px', position: 'relative', top: 0, left: 0, transform: 'none' }} src='Roborn-logo-01.png'></img>
            <div style={{ width: '400px', marginLeft: '50px' }}>Future Store</div>
            <Input id='search-bar'></Input>
            <Button id='signin-btn'>Sign In</Button>
        </div>
    </>
    )
}

const ReactHub = () => {
    const history = useHistory();
    return (<div style={{
        backgroundImage: 'url(FutureHub.png)',
        backgroundPosition: 'center',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        position: 'absolute',
        width: '100vw',
        height: '100vh',
        top: 0,
        left: '20px'
    }}>
        <Row>
            <Col sm="3">
                {/* <div id='catergories'>
                    <div className="sub-title" style={{ fontSize: 20 }} >Categories</div>
                    <div>AI</div>
                    <div>Voice</div>
                </div> */}
            </Col>
            <Col>
                <div className='app-container'>
                    <AppItem imageSrc='select.png' appName='Hand Tracking' appCategory='Communication, AI' history={history}></AppItem>
                    <AppItem imageSrc='shopping-bag.png' appName='Future Shop' appCategory='Shopping'></AppItem>
                    <AppItem imageSrc='delivery.png' appName='Delivery Robot' appCategory='AI'></AppItem>
                </div>
            </Col>
        </Row>
    </div>)
}

export default ReactHub;
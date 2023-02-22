import React, { useState, useEffect } from 'react';
import { Row, Col, Button } from 'reactstrap';

const ProjectionApp = () => {
    const [isDownloading, setIsDownloading] = useState(false);
    const [isDownloadDone, setIsDownloadDone] = useState(false);
    const enableApp = () => {
        console.log('Pressed enable')
        setIsDownloading(true);
        window.open('hand-tracking-install://')
    }
    const startApp = () => {
        window.open('hand-tracking://')
    }
    useEffect(() => {
        setTimeout(() => {
            setIsDownloadDone(true);
        }, 5000);
    }, [isDownloading])
    return (
        <div style={{
            backgroundImage: 'url(FutureHub-clean.png)',
            backgroundPosition: 'center',
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            position: 'absolute',
            width: '100vw',
            height: '100vh',
            top: 0,
            left: '20px'
        }}>
            <div style={{ position: 'absolute', top: '150px', left: '300px', width: window.screen.width - 300 }}>
                <Row>
                    <Col sm='4'>
                        <img src='/icon/select.png' style={{ width: '200px', transform: 'none', left: 100, top: 0, display: 'block' }}></img>
                    </Col>
                    <Col>
                        <div style={{ padding: '10px' }}>
                            <div style={{ fontSize: '40px' }}>Hand Tracking</div>
                            <div style={{ fontSize: '20px' }}>Communication, AI</div>
                            <div style={{ fontSize: '20px', marginBottom: '10px' }}>Enjoy interactions with robot by sensing different hand postures</div>
                        </div>
                        {!isDownloading && !isDownloadDone && <Button style={{ height: '60px', fontSize: '30px', width: '150px', borderRadius: '20px' }} onClick={enableApp}>Enable</Button>}
                        {isDownloading && !isDownloadDone && <Button style={{ height: '60px', fontSize: '30px', width: '250px', borderRadius: '20px' }}>Downloading...</Button>}
                        {isDownloadDone && <Button style={{ height: '60px', fontSize: '30px', width: '150px', borderRadius: '20px' }} onClick={startApp}>Open App</Button>}
                    </Col>
                </Row>
                <Row style={{ marginTop: 50 }}>
                    <div>
                        <div style={{ fontSize: 30, marginBottom: 40 }}>ABOUT</div>
                        <p style={{ fontSize: 20 }}>
                            Try the new uploaded application with AI camera!
                        </p>
                        <p style={{ fontSize: 20 }}>
                            The ability to perceive the shape and motion of hands can be a vital component in improving
                        </p>
                        <p style={{ fontSize: 20 }}>
                            the user experience across a variety of technological domains and platforms.
                        </p>
                        <p style={{ fontSize: 20 }}>
                            For example, it can form the basis for sign language understanding and hand gesture control,
                        </p>
                        <p style={{ fontSize: 20 }}>
                            and can also enable the overlay of digital content and information on top of the physical world in augmented reality.
                        </p>
                        <p style={{ fontSize: 20 }}>
                            While coming naturally to people, robust real-time hand perception is a decidedly challenging computer vision task,
                        </p>
                        <p style={{ fontSize: 20 }}>
                            as hands often occlude themselves or each other (e.g. finger/palm occlusions and hand shakes) and lack high contrast patterns.
                        </p>
                    </div>
                </Row>
            </div>
        </div >
    )
}

export default ProjectionApp;
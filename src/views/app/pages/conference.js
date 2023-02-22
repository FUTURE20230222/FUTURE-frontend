import React, { useEffect } from 'react'
import Jitsi from 'react-jitsi';
import { Row } from 'reactstrap';
import { Colxx } from '../../../components/common/CustomBootstrap';
import { io } from 'socket.io-client';
import Webcam from "react-webcam";


const Conference = () => {
    useEffect(() => {
        const socket = io('http://api.roborn.com:28082')
        socket.on("connect", () => {
            console.log("connect with id")
            socket.emit("call", socket.id)
        })
        return () => { socket.close() }
    }, [])
    return (
        <>
            <Row style={{ overflowY: "hidden" }}>
                <Colxx xxs="12" style={{ justifyContent: "center", display: "flex" }}>
                    {/* {state.width} {state.height} */}
                    <Webcam  
                        audio={true}
                        height={720}
                        width={1280}
                        >
                    </Webcam>
                    {/* <Jitsi
                        roomName="future-roborn-meet-room-30624700"
                        displayName="Future A"
                        domain="meet.roborn.com"
                        noSSL={false}
                        containerStyle={{
                            width: window.innerWidth + 'px',
                            height: window.innerHeight + 'px',
                        }}
                    /> */}
                </Colxx>
            </Row>
        </>
    )
}

export default Conference;
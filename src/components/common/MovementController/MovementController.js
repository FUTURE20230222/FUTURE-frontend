import React, { useEffect, useState } from 'react';
import './MovementController.css'
import { Joystick } from 'react-joystick-component';
import {
    Button, Input, Label
} from 'reactstrap';

const MovementController = ({
    actionSocket, rid, isButtonType = true
}) => {
    const [joystickTimer, setJoystickTimer] = useState();
    const [joystickStatus, setJoystickStatus] = useState();
    const [sendFlag, setSendFlag] = useState(false);
    const [speed, setSpeed] = useState(0.25);

    const PressButton = (e) => {
        const message = {
            request: "move",
            params: { dir: e.target.value, speed: speed },
            rid: rid
        }
        const timer = setInterval(() => {
            console.log('pressed', e.target.value)
            actionSocket.send(message)
        }, 300);
        setJoystickTimer(timer)
    }

    const toggleButton = (e) => {
        let message
        message = {
            request: "move",
            params: { dir: e.target.value, speed: speed },
            rid: rid
        }
        actionSocket.send(message)
    }

    const clearButton = () => {
        clearInterval(joystickTimer)
    }

    useEffect(() => {
        if (joystickStatus === undefined) return;
        console.log(joystickStatus)
        if (isButtonType === false) {
            clearInterval(joystickTimer)
            const timer = setInterval(() => {
                if (sendFlag) {
                    console.log('sending message')
                    actionSocket.emit('message', {
                        request: "move",
                        params: joystickStatus,
                        rid: rid
                    })
                }
            }, 300);
            setJoystickTimer(timer)
        }
    }, [joystickStatus])



    const pressJoystick = (e) => {
        setSendFlag(true);
    }
    const moveJoystick = (e) => {
        // Record joystick position
        e.speed = speed;
        e.request = "move"
        setJoystickStatus(e)
    }
    const stopJoystick = (e) => {
        // Stop request by interval
        setSendFlag(false)
        clearInterval(joystickTimer)
    }

    const changeSpeed = (e) => {
        setSpeed(e.target.value / 100)
    }

    return (
        <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ margin: '10px' }}>
                {isButtonType &&
                    <div className="controller">
                        <div className="joystick-group-btn">
                            <Button outline onTouchStart={PressButton} onTouchEnd={clearButton} className="joystick up glyph-icon simple-icon-arrow-up" color="primary" value="FORWARD"
                                onClick={toggleButton} onMouseDown={PressButton} onMouseUp={clearButton}></Button>
                            <Button outline onTouchStart={PressButton} onTouchEnd={clearButton} className="joystick left glyph-icon simple-icon-arrow-left" color="primary" value="LEFT"
                                onClick={toggleButton} onMouseDown={PressButton} onMouseUp={clearButton}></Button>
                            <Button outline onTouchStart={PressButton} onTouchEnd={clearButton} className="joystick down glyph-icon simple-icon-arrow-down" color="primary" value="BACKWARD"
                                onClick={toggleButton} onMouseDown={PressButton} onMouseUp={clearButton}></Button>
                            <Button outline onTouchStart={PressButton} onTouchEnd={clearButton} className="joystick right glyph-icon simple-icon-arrow-right" color="primary" value="RIGHT"
                                onClick={toggleButton} onMouseDown={PressButton} onMouseUp={clearButton}></Button>
                        </div>
                    </div>
                }
                {!isButtonType && <Joystick
                    baseColor="rgb(111 111 111)"
                    stickColor="rgb(214 214 214)"
                    throttle={100}
                    start={pressJoystick}
                    move={moveJoystick}
                    stop={stopJoystick}
                />}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Input style={{ "-webkit-appearance": "slider-vertical" }} type='range' id='input' min="10" max="40" defaultValue="25" onChange={changeSpeed} />
                <Label>Speed</Label>
            </div>
        </div >
    )
}
export default MovementController

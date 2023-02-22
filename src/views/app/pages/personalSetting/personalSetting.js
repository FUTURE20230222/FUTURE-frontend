import React, { useEffect, useState } from "react";
import { HexColorPicker } from "react-colorful";
import { Label, Button, Row } from "reactstrap"
import './personalSetting.css'
import imageBoy from '../../../../assets/image/eyes g m1_standby.gif'
import imageGirl from '../../../../assets/image/future face black.gif'
import fetchWithTimeoutAndHandling from "../../../../components/common/fetch";

const PersonalSetting = ({ user, reLoadData, baseUrl }) => {
    const [color, setColor] = useState(`#${user.lightColor}`);
    const [robotFace, setRobotFace] = useState(user.robotFace)

    const chooseRobot = (e) => {
        setRobotFace(e.target.id)
    }

    const saveSetting = async () => {
        const loadData = localStorage.getItem('data')
        let filterData = JSON.parse(loadData).filter((elem) => elem.userId !== user.userId)
        const newData = [...filterData, { ...user, lightColor: `${color.substring(1)}`, robotFace: parseInt(robotFace) }]
        localStorage.setItem('data', JSON.stringify(newData))
        reLoadData()
    }

    useEffect(() => {
        if (user && baseUrl) {
            fetchWithTimeoutAndHandling(`${baseUrl}/LED_ctrl/setColor?color=${user.lightColor}&timer=0`)
        }
    }, [user])

    return <>
        <Row className='setting'>
            <div className='option'>
                <Label>LED light color</Label>
                <HexColorPicker className='color-A' color={color} onMouseDown={e => e.stopPropagation()} onTouchStart={e => e.stopPropagation()} onChange={setColor} />
            </div>
            <div className='option robot-face'>
                <Label>Robot Face</Label>
                <div className='robot-button'>
                    <Button id={1} onClick={chooseRobot} onTouch={chooseRobot}>Robot 1</Button>
                    <Button id={2} onClick={chooseRobot} onTouch={chooseRobot}>Robot 2</Button>
                </div>
                <div className='face-image'>
                    {(robotFace === '1' || robotFace === 1) && <img className='robot-face-img' src={imageBoy} />}
                    {(robotFace === '2' || robotFace === 2) && <img className='robot-face-img' src={imageGirl} />}
                </div>
            </div>
        </Row>
        <Button id='save-setting' onClick={saveSetting}>Save</Button>

    </>
}

export default PersonalSetting;
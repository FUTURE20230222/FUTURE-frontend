import React, { useState, useEffect } from 'react'
import { Button, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem, Row, Col } from 'reactstrap'
import fetchWithTimeoutAndHandling from '../../../components/common/fetch'
const RelayControl = () => {
    const [baseUrl,setBaseUrl] = useState()
    useEffect(() => {
        const loadBaseUrl = async () => {
            try {
                const result = await fetchWithTimeoutAndHandling('/dynamicIP.json')
                setBaseUrl(result.host_url)
                return result
            } catch (err) {
                console.log(err)
                return []
            }
        };
        loadBaseUrl();
    }, [])

    const timerSetting = [
        { text: 'Unlimited', time: 0 },
        { text: '0.5 Second', time: 0.5 },
        { text: '1 Second', time: 1 },
        { text: '2 Second', time: 2 },
    ]
    const [timer, setTimer] = useState({ text: 'Unlimited', time: 0 })
    // Create status array for type checking in future
    // const relayStatus = Array(8).fill({ isOn: 'false' }, 0, 8)
    const relayStatus = [
        { id: 1, isOn: true, name: "Elevator Up" },
        { id: 2, isOn: true, name: "Elevator Stop", remainingTime: '30:00' },
        { id: 3, isOn: true, name: "Elevator Down",},
        { id: 4, isOn: false, name: "Humidifier" },
    ]
    // http://192.168.199.105:8080/relay_ctrl/set_SW?id=0&status=1&timer=0
    // id : 0-7 for 8relays, status = 0/1 for off/on
    // timer = sec, timer = 0 for permanent change

    // Get status /relay_ctrl/status
    const handleOn = (i, time) => {
        fetchWithTimeoutAndHandling(baseUrl + '/relay_ctrl/set_SW?id=' + i + '&status=1&timer=' + time)
    }

    const handleOff = (i) => {
        console.log(i)
        fetchWithTimeoutAndHandling(baseUrl + '/relay_ctrl/set_SW?id=' + i + '&status=0&timer=0')
        relayStatus[i].isOn = false
    }

    return <>
        <h1 style={{ marginTop: '20px', marginLeft: window.innerWidth / 2 - 85 + 'px' }}>Relay Control</h1>
        <Row style={{ margin: '2px' }}>
            <Col sm='3'>
                <div style={{ border: "2px solid black", padding: "10px" }}>
                    {relayStatus.map((elem, i) => <>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '15px' }}>
                            {elem.name ?? 'Modbus-' + i}
                            <div style={{ display: 'flex' }}>
                                <UncontrolledDropdown >
                                    <DropdownToggle caret>
                                        On
                                    </DropdownToggle>
                                    <DropdownMenu>
                                        {timerSetting.map((elem, j) =>
                                            <DropdownItem key={'timer-option-' + j} id={elem.time}
                                                onClick={(e) => { setTimer({ text: e.target.textContent, time: e.target.id }); handleOn(i, e.target.id) }}
                                                onTouch={(e) => { setTimer({ text: e.target.textContent, time: e.target.id }); handleOn(i, e.target.id) }}>
                                                {elem.text}
                                            </DropdownItem>)}
                                    </DropdownMenu>
                                </UncontrolledDropdown>
                                <Button onClick={() => handleOff(i)} onTouch={() => handleOff(i)}>Off</Button>
                            </div>
                        </div>
                    </>)}
                </div>
            </Col>
            <Col sm='9'>
                <div style={{ border: "2px solid black" }}>
                    <div style={{ padding: '10px', fontSize: '20px', display: 'flex', justifyContent: 'space-between' }}>
                        <div style={{ width: '250px' }}>Schedule</div>
                        <div>Status</div>
                        <div>Remaining Time</div>
                    </div>
                    <div>
                        {relayStatus.map((elem, i) =>
                            <div key={'status-' + i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '18px', padding: '10px' }}>
                                <div style={{ width: '150px' }}>{elem.name ?? 'Modbus-' + i}</div>
                                <div>{elem.isOn ? 'On' : 'Off'}</div>
                                <div>{elem.remainingTime ?? '00:00'}</div>
                            </div>
                        )}
                    </div>
                </div>
            </Col>
        </Row>
        {/* <div style={{ marginTop: '100px', marginLeft: window.innerWidth / 2 - 85 + 'px' }}>
            <h1 style={{ marginLeft: '-80px' }}>Timer set to: {timer.text}</h1>
            <UncontrolledDropdown >
                <DropdownToggle caret style={{ fontSize: '20px', width: '120px' }}>
                    Timer
            </DropdownToggle>
                <DropdownMenu>
                    {timerSetting.map((elem, i) => <DropdownItem key={'timer-option-' + i} id={elem.time}
                        onClick={(e) => setTimer({ text: e.target.textContent, time: e.target.id })}
                        onTouch={(e) => setTimer({ text: e.target.textContent, time: e.target.id })} >{elem.text}</DropdownItem>)}
                </DropdownMenu>
            </UncontrolledDropdown>
        </div> */}
    </>
}

export default RelayControl

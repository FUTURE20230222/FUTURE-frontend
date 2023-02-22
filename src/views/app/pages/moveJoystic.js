import React, {useEffect,useState} from 'react'
import { Button } from 'reactstrap'
import '../../../components/common/MovementController/MovementController.css'
import fetchWithTimeoutAndHandling from '../../../components/common/fetch'
const MovementControl = () => {
    const [baseUrl, setBaseUrl] = useState()
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

    const base_url = `${baseUrl}/move?direction=`
    const toggleButton = async (e) => {
        // fetchWithTimeoutAndHandling(base_url + e.target.value)
        const requestAddress =  base_url + e.target.value
        console.log(`Fetch ${requestAddress}`)
        const response = await fetch(requestAddress);
        console.log(response)

    }

    const clearButton = async() => {
        // const response = await fetch(`${base_url}/stop`);
        fetchWithTimeoutAndHandling(`${baseUrl}/stop`)
    }


    return <div className="controller" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)' }}>
        <div className="joystick-group-btn" style={{ height: '300px', width: '350px' }}>
            <Button outline onPointerDown={toggleButton} onPointerUp={clearButton} onPointerOut={clearButton} className="joystick up glyph-icon simple-icon-arrow-up" color="primary" value="forward"
            ></Button>
            <Button outline onPointerDown={toggleButton} onPointerUp={clearButton} onPointerOut={clearButton} className="joystick left glyph-icon simple-icon-arrow-left" color="primary" value="left"
            ></Button>
            <Button outline onPointerDown={toggleButton} onPointerUp={clearButton} onPointerOut={clearButton} className="joystick down glyph-icon simple-icon-arrow-down" color="primary" value="backward"
            ></Button>
            <Button outline onPointerDown={toggleButton} onPointerUp={clearButton} onPointerOut={clearButton} className="joystick right glyph-icon simple-icon-arrow-right" color="primary" value="right"
            ></Button>
        </div>
    </div >
    // - move (direction: forward, backward, left, right)
    //  http://192.168.199.105:8080/move?direction=<>
}

export default MovementControl
import React, { useEffect, useState } from 'react'
import { Button } from 'reactstrap'
import noLight from './nolight.png'
import dimLight from './dimlight.png'
import halfLight from './halflight.png'
import fullLight from './fulllight.png'
import fetchWithTimeoutAndHandling from '../../../../components/common/fetch'

const loadBaseUrl = async () => {
    try {
        const res = await fetch('/dynamicIP.json')
        const result = await res.json()
        return result
    } catch (err) {
        console.log(err)
        return []
    }
};
let base_url
loadBaseUrl().then(result => base_url = result.host_url);

const Sensor = () => {
    const lightArray = [noLight, dimLight, halfLight, fullLight]
    const [lux, setLux] = useState(0)
    const [light, setLight] = useState(noLight)
    useEffect(() => {
        if (lux < 10) {
            setLight(noLight)
        } else if (lux < 50) {
            setLight(dimLight)
        } else if (lux < 100) {
            setLight(halfLight)
        } else if (lux >= 100) {
            setLight(fullLight)
        }
    }, [lux])

    useEffect(() => {
        const fetchLightValue = async () => {
            try {
                const res = await fetchWithTimeoutAndHandling(`${base_url}/light_sensor/get_lux`)
                // const result = await res.json()
                setLux(res)
            } catch (e) {
                console.log(e)
            }
        }
        const interval = setInterval(() => {
            try {
                fetchLightValue()
            } catch (err) {
                console.log(err)
            }
        }, 2000);
        return () => clearInterval(interval)
    }, [])

    return <>
        <img src={light} style={{ height: "100vh", width: "100vw", zIndex: -1, position: 'absolute', top: '60%' }} />
    </>
}

export default Sensor
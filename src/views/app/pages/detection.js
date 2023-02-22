import React, { useEffect, useState } from 'react'
import fetchWithTimeoutAndHandling from '../../../components/common/fetch'

const Detection = () => {
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
    const [itemList, setItemList] = useState([])
    useEffect(() => {
        if (!baseUrl) { return }
        fetch(`${baseUrl}/ai_activate?status=on`).catch(err => console.error('Error: Turning on Detection', err))
        return () => fetch(`${baseUrl}/ai_activate?status=off`).catch(err => console.error('Error: Turning off Detection', err))
    }, [baseUrl])
    useEffect(() => {
        const getItemList = async () => {
            try {
                const res = await fetch(`${baseUrl}/detected_object`)
                const result = await res.json()
                console.log(result)
                setItemList(result)
            } catch (e) {
                console.log('server error: detected object')
            }
        }
        const interval = setInterval(() => {
            getItemList()
        }, 1000);
        return () => clearInterval(interval);
    }, [baseUrl])
    return (<>
        {itemList.length === 0 && < h1 style={{ marginLeft: '10px' }}>Detection application popping up...</h1>}
        {itemList.length > 0 && <>
            <div style={{ fontSize: '30px' }}> Detected Item:</div>
            <div style={{ fontSize: '30px' }}> {itemList.toString()}</div></>}
    </>)
}

export default Detection
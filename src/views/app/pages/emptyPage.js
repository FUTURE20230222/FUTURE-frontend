import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { Row } from 'reactstrap'
import { playWithCallback } from '../../../helpers/RobornSpeechRecognition';
const EmptyPage = () => {
    let { imagePath, audioPath, videoPath } = useParams();
    const [imageSrc, setImageSrc] = useState();
    const [videoSrc, setVideoSrc] = useState();
    const [audioSrc, setAudioSrc] = useState();

    useEffect(() => {
        console.log('hi')
        if (imagePath !== 'undefined') {
            setImageSrc('/assets/askFuture/image/' + imagePath)
        }
    }, [])

    useEffect(() => {
        console.log('hello')
        if (videoPath !== 'undefined') {
            setVideoSrc('/assets/askFuture/video/' + videoPath)
        }
    }, [])

    useEffect(() => {
        console.log("sound", audioPath)
        if (audioPath) {
            setAudioSrc(audioPath)
        }
    }, [])

    // Prevent repeating audio
    useEffect(() => {
        const playSound = async (audioPath) => {
            const audio = new Audio('/assets/askFuture/audio/' + audioPath)
            playWithCallback(audio)
        }
        if (audioSrc) {
            playSound(audioSrc)
            setAudioSrc(undefined)
        }
    }, [audioSrc])
    return <>
        <Row>
            {imageSrc && <img onError={() => { setImageSrc('/Roborn-image-not-found.png') }} style={{ height: 'calc(100% - 100px)', left: 0, top: '100px', transform: 'none' }} src={imageSrc} alt={imagePath} />}
            {videoSrc && <video controls style={{ height: 'calc(100vh - 100px)', position: 'absolute', left: '50%', top: '100px', transform: 'translate(-50%)' }} src={videoSrc} autoPlay muted alt={videoPath} />}
        </Row>
    </>
}

export default EmptyPage;
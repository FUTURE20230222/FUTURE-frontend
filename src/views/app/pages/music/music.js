import React, { useEffect, useState } from 'react'
import { Col, Row } from 'reactstrap'
import freqTable from './notes'
import './music.css'
import fetchWithTimeoutAndHandling from '../../../../components/common/fetch'

// const getUserMedia = require('get-user-media-promise');
// const MicrophoneStream = require('microphone-stream');
const Music = () => {
    const [baseUrl, setBaseUrl] = useState()
    useEffect(() => {
        const loadBaseUrl = async () => {
            try {
                const result = await fetchWithTimeoutAndHandling('/dynamicIP.json')
                // const result = await res.json()
                setBaseUrl(result.host_url)
                return result
            } catch (err) {
                console.log(err)
                return []
            }
        };
        loadBaseUrl();
    }, [])
    const baseFreq = 440;
    let currentNoteIndex = 57; // A4
    let isRefSoundPlaying = false;
    let isMicrophoneInUse = false;
    let frameId,
        micStream,
        notesArray,
        audioContext,
        sourceAudioNode,
        analyserAudioNode;
    const pianoKeyList = [
        { id: 'C', className: 'white-key' },
        { id: 'C#', className: 'black-key' },
        { id: 'D', className: 'white-key' },
        { id: 'D#', className: 'black-key' },
        { id: 'E', className: 'white-key' },
        { id: 'F', className: 'white-key' },
        { id: 'F#', className: 'black-key' },
        { id: 'G', className: 'white-key' },
        { id: 'G#', className: 'black-key' },
        { id: 'A', className: 'white-key' },
        { id: 'A#', className: 'black-key' },
        { id: 'B', className: 'white-key' },
    ]
    const [pitch, setPitch] = useState('440 Hz')
    const [note, setNote] = useState('--')
    const [noteCount, setCount] = useState(0)
    // const [detectedArray, setDetectedArray] = useState();
    const updateNote = (note) => {
        setNote(note)
    }
    const updatePitch = (pitch) => { setPitch(pitch + 'Hz') }

    const isAudioContextSupported = () => {
        // This feature is still prefixed in Safari
        window.AudioContext = window.AudioContext || window.webkitAudioContext;
        if (window.AudioContext) {
            return true;
        }
        else {
            return false;
        }
    };
    const isGetUserMediaSupported = function () {
        navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
        if ((navigator.mediaDevices && navigator.mediaDevices.getUserMedia) || navigator.getUserMedia) {
            return true;
        }

        return false;
    };
    const findFundamentalFreq = function (buffer, sampleRate) {
        // We use Autocorrelation to find the fundamental frequency.

        // In order to correlate the signal with itself (hence the name of the algorithm), we will check two points 'k' frames away.
        // The autocorrelation index will be the average of these products. At the same time, we normalize the values.
        // Source: http://www.phy.mty.edu/~suits/autocorrelation.html
        // Assuming the sample rate is 48000Hz, a 'k' equal to 1000 would correspond to a 48Hz signal (48000/1000 = 48),
        // while a 'k' equal to 8 would correspond to a 6000Hz one, which is enough to cover most (if not all)
        // the notes we have in the notes.json file.
        var n = 1024;
        var bestK = -1;
        var bestR = 0;
        for (var k = 8; k <= 1000; k++) {
            var sum = 0;

            for (var i = 0; i < n; i++) {
                sum += ((buffer[i] - 128) / 128) * ((buffer[i + k] - 128) / 128);
            }

            var r = sum / (n + k);

            if (r > bestR) {
                bestR = r;
                bestK = k;
            }

            if (r > 0.9) {
                // Let's assume that this is good enough and stop right here
                break;
            }
        }

        if (bestR > 0.0025) {
            // The period (in frames) of the fundamental frequency is 'bestK'. Getting the frequency from there is trivial.
            var fundamentalFreq = sampleRate / bestK;
            return fundamentalFreq;
        }
        else {
            // We haven't found a good correlation
            return -1;
        }
    };
    const findClosestNote = function (freq, notes) {
        // Use binary search to find the closest note
        var low = -1;
        var high = notes.length;
        while (high - low > 1) {
            var pivot = Math.round((low + high) / 2);
            if (notes[pivot].frequency <= freq) {
                low = pivot;
            } else {
                high = pivot;
            }
        }

        if (Math.abs(notes[high].frequency - freq) <= Math.abs(notes[low].frequency - freq)) {
            // notes[high] is closer to the frequency we found
            return notes[high];
        }

        return notes[low];
    };
    const findCentsOffPitch = function (freq, refFreq) {
        // We need to find how far freq is from baseFreq in cents
        var log2 = 0.6931471805599453; // Math.log(2)
        var multiplicativeFactor = freq / refFreq;

        // We use Math.floor to get the integer part and ignore decimals
        var cents = Math.floor(1200 * (Math.log(multiplicativeFactor) / log2));
        return cents;
    };
    const streamReceived = function (stream) {
        micStream = stream;

        analyserAudioNode = audioContext.createAnalyser();
        analyserAudioNode.fftSize = 2048;

        sourceAudioNode = audioContext.createMediaStreamSource(micStream);
        sourceAudioNode.connect(analyserAudioNode);

        detectPitch();
    };
    const detectPitch = function () {
        var buffer = new Uint8Array(analyserAudioNode.fftSize);
        analyserAudioNode.getByteTimeDomainData(buffer);

        var fundalmentalFreq = findFundamentalFreq(buffer, audioContext.sampleRate);

        if (fundalmentalFreq !== -1) {
            var note = findClosestNote(fundalmentalFreq, notesArray);
            var cents = findCentsOffPitch(fundalmentalFreq, note.frequency);
            if (note.frequency < 2048) {
                updateNote(note.note);
            }
        }
        else {
            updateNote('--');
        }

        frameId = window.requestAnimationFrame(detectPitch);
    };
    const toggleMicrophone = () => {
        // if (isRefSoundPlaying) {
        //     turnOffReferenceSound();
        // }

        if (!isMicrophoneInUse) {
            // $('#microphoneOptions').toggle(true);

            if (isGetUserMediaSupported()) {
                notesArray = freqTable[baseFreq.toString()];

                var getUserMedia = navigator.mediaDevices && navigator.mediaDevices.getUserMedia ?
                    navigator.mediaDevices.getUserMedia.bind(navigator.mediaDevices) :
                    function (constraints) {
                        return new Promise(function (resolve, reject) {
                            navigator.getUserMedia(constraints, resolve, reject);
                        });
                    };

                getUserMedia({ audio: true }).then(streamReceived);
                updatePitch(baseFreq);
                isMicrophoneInUse = true;
            }
            else {
                console.log('It looks like this browser does not support getUserMedia. ' +
                    'Check <a href="http://caniuse.com/#feat=stream">http://caniuse.com/#feat=stream</a> for more info.');
            }
        }
        else {
            // turnOffMicrophone();
        }
    };

    useEffect(() => {
        if (isAudioContextSupported()) {
            audioContext = new window.AudioContext();
        }
        else {
            console.log('AudioContext is not supported in this browser');
        }
        toggleMicrophone()
    }, [])

    // useEffect(() => {
    //     const loadDetectedArray = async () => {
    //         const res = await fetchWithTimeoutAndHandling(`${base_url}/`)
    //         const result = await res.json()
    //         setDetectedArray(result)
    //     }
    //     const interval = setInterval(() => {
    //         loadDetectedArray()
    //     }, 1000);
    //     return () => clearInterval(interval)
    // }, [])

    useEffect(() => {
        if (!baseUrl) {
            return;
        }
        fetchWithTimeoutAndHandling(`${baseUrl}/LED_ctrl/ColorFreq?status=on`)
        return () => fetchWithTimeoutAndHandling(`${baseUrl}/LED_ctrl/ColorFreq?status=off`)
    }, [baseUrl])

    useEffect(() => {
        // Change color
        document.querySelectorAll('.white-key').forEach(elem => elem.style.backgroundColor = 'white')
        document.querySelectorAll('.black-key').forEach(elem => elem.style.backgroundColor = 'black')
        if (note !== '--') {
            document.querySelector(`#${note.substring(0, note.length - 1).replace('#', '\\#')}`).style.backgroundColor = 'Red';
        }
    }, [note])

    return <>
        <h1>Command list</h1>
        <Row>
            <Col sm="8">
                <div style={{ fontSize: '30px' }}>F, G, A</div>
                <div style={{ fontSize: '30px' }}>A, G, F</div>
            </Col>
            <Col sm="4">
                <div style={{ fontSize: '30px' }}>Go Straight</div>
                <div style={{ fontSize: '30px' }}>Go Backward</div>
            </Col>
        </Row>
        <div id='piano'>
            {pianoKeyList.map((elem) => <div className={elem.className} id={elem.id}></div>)}
        </div>
        <div style={{ textAlign: 'center', fontSize: '30px' }}>Detected {note}</div>
        {/* <div style={{ textAlign: 'center', fontSize: '30px' }}>Receiving {detectedArray}</div> */}
    </>
}

export default Music
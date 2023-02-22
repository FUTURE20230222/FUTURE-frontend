import React, { useEffect, useContext, useState } from 'react'
import { useHistory, BrowserRouter as Router, Switch, Route, useParams, useRouteMatch } from 'react-router-dom'
import { adminRoot } from '../../../constants/defaultValues'
import { MyProtectedRoute } from '../../../App'
import RelayControl from './relayControl'
import PersonalSetting from './personalSetting/personalSetting'
import VideoConferencing from './conference'
import MovementControl from './moveJoystic'
import { CarouselContext } from 'pure-react-carousel'
import Music from './music/music'
import Detection from './detection'
import Sensor from './sensor/sensor'
import Question from './question'
import ParisAgreement from './parisAgreement'
import WhyTokyoParis from './whyTokyoParis'
import CleanAirAction from './cleanAirAction'
import AirImprovement from './airImprovement'
import AirQualityProblem from './airQualityProblem'
import NewBlueprint from './newBlueprint'
import SixActions from './sixActions'
import GreenTransport from './greenTransport'
import LiveableEnvironment from './liveableEnvironment'
import ComprehensiveEmissionsReduction from './comprehensiveEmissionsReduction'
import CleanEnergy from './cleanEnergy'
import ScientificManagement from './scientificManagement'
import RegionalCollaboration from './regionalCollaboration'
import WantToKnowMore from './wantToKnowMore'
import fetchWithTimeoutAndHandling from '../../../components/common/fetch'
import bigWasterAudio from '../../../assets/audio/bigwastersound'
import EmptyPage from './emptyPage'
import Cursor from './cursor'

import { playWithCallback } from '../../../helpers/RobornSpeechRecognition'


const AppIcon = ({ imageCode = "simple-icon-user", text = "default", url = "/app", history, windowSize = { width: window.innerWidth, height: window.innerHeight } }) => {
    return <>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: (window.innerWidth - 200) / 4, marginBottom: '50px' }}>
            <div style={{
                border: '6px solid black', borderRadius: '30px', width: '150px',
                height: '150px', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '10px'
            }}
                onClick={() => history.push(url)}
            >
                <div style={{ fontSize: '108px' }} className={imageCode} />
            </div>
            <div style={{ marginTop: "5px", fontSize: "30px", textAlign: 'center' }}>{text}</div>
        </div>
    </>
}

// NavBar at top
const NavBar = ({ history }) => {
    const expoList = [
        { name: 'airImprovement', sound: new Audio(bigWasterAudio.bigwasterQ1) },
        { name: 'airQualityProblem', sound: new Audio(bigWasterAudio.bigwasterQ2) },
        { name: 'newBlueprint', sound: new Audio(bigWasterAudio.bigwasterQ3) },
        { name: 'whyTokyoParis', sound: new Audio(bigWasterAudio.bigwasterQ4) },
        { name: 'sixActions', sound: new Audio(bigWasterAudio.bigwasterQ5) },
        { name: 'greenTransport', sound: new Audio(bigWasterAudio.bigwasterQ5a) },
        { name: 'liveableEnvironment', sound: new Audio(bigWasterAudio.bigwasterQ5b) },
        { name: 'comprehensiveEmissionsReduction', sound: new Audio(bigWasterAudio.bigwasterQ5c) },
        { name: 'cleanEnergy', sound: new Audio(bigWasterAudio.bigwasterQ5d) },
        { name: 'scientificManagement', sound: new Audio(bigWasterAudio.bigwasterQ5e) },
        { name: 'regionalCollaboration', sound: new Audio(bigWasterAudio.bigwasterQ5f) },
        { name: 'wantToKnowMore', sound: new Audio(bigWasterAudio.bigwasterQ5g) },
    ]

    const [playing, setPlaying] = useState('')

    const carouselContext = useContext(CarouselContext);
    const logout = () => {
        sessionStorage.removeItem('token')
        history.push('/')
    }

    const visitStore = () => {
        history.push('/reactHub')
    }

    const goBack = () => {
        console.log(history.location.pathname, 'current location')
        const path = history.location.pathname
        if (path === "/app/" || path === "/app") {
            carouselContext.setStoreState({ currentSlide: 0 })
            return;
        } else { history.push('/app') }
    }

    return <>
        {playing && <audio autoPlay={true} src={playing.src} id={'player'}></audio>}
        <div className="NavBar" style={{ height: "100px", background: '#505656', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: "20px", zIndex: 1 }}>
            <div className="simple-icon-action-undo" style={{ fontSize: '40px', color: "white" }}
                onClick={goBack}></div>
            <div style={{ color: 'white', fontSize: '30px' }} onClick={visitStore}>Future Store</div>
            {/* {expoList.map((elem, i) => <div key={'expo-icon-' + i} style={{ width: '20px', height: '20px', backgroundColor: 'greenyellow', zIndex: 2, borderRadius: '10px' }}
                onClick={() => {
                    history.push(`/app/${elem.name}`);
                    setPlaying(elem.sound)
                }}></div>)} */}
            <div className="logout" style={{ fontSize: "30px", color: 'white' }} onClick={logout}>Logout</div>
        </div>
    </>
}

const FutureAppUI = ({ user, loadData }) => {
    const [baseUrl, setBaseUrl] = useState()
    useEffect(() => {
        const loadBaseUrl = async () => {
            try {
                const res = await fetch('/dynamicIP.json')
                const result = await res.json()
                setBaseUrl(result.host_url)
                return result
            } catch (err) {
                console.log(err)
                return []
            }
        };
        loadBaseUrl();
    }, [])
    const history = useHistory();
    let ApplicationList = [{
        imageCode: "simple-icon-user",
        text: "User Setting",
        url: "/app/setting"
    },
    {
        imageCode: "simple-icon-people",
        text: "Video Conferencing",
        url: "/app/conference"
    },
    {
        imageCode: "simple-icon-wrench",
        text: "Relay Control",
        url: "/app/control"
    },
    {
        imageCode: "simple-icon-game-controller",
        text: "Robot Control",
        url: "/app/movement"
    },];

    const userToken = sessionStorage.getItem('token')
    if (userToken === '13579') {
        ApplicationList.push(
            {
                imageCode: "simple-icon-music-tone-alt",
                text: "Music control",
                url: "/app/music"
            },
            {
                imageCode: "simple-icon-magnifier",
                text: "Object Detection",
                url: "/app/detection"
            },
            {
                imageCode: "simple-icon-speedometer",
                text: "Sensor",
                url: "/app/sensor"
            },
            {
                imageCode: "simple-icon-question",
                text: "Q&A Challenge",
                url: "/app/question"
            },
            {
                imageCode: "simple-icon-cursor-move",
                text: "Hand Detection",
                url: "/app/cursor"
            },
        )
    } else if (userToken === '12345') {
        ApplicationList.push(
            {
                imageCode: "simple-icon-cursor-move",
                text: "Hand Detection",
                url: "/app/cursor"
            },
            {
                imageCode: "simple-icon-question",
                text: "Q&A Challenge",
                url: "/app/question"
            },
        )
    }
    let { path } = useRouteMatch();

    // Light
    useEffect(() => {
        if (!baseUrl) { return }
        const baseLightUrl = `${baseUrl}/LED_ctrl/`
        try {
            if (user.lightColor) {
                const colorParam = `setColor?color=${user.lightColor}&timer=0`
                fetchWithTimeoutAndHandling(baseLightUrl + colorParam).then(function () {
                }).catch(function () {
                    console.log("error");
                });
            } else {
                const colorParam = 'setColor?color=505656&timer=0'
                fetchWithTimeoutAndHandling(baseLightUrl + colorParam).then(function () {
                }).catch(function () {
                    console.log("error");
                });
            }
        } catch (e) {
            console.warn('baseLightUrl request', e)
        }
        if (user.lightColor) {
            const colorParam = `setColor?color=${user.lightColor}&timer=0`
            fetchWithTimeoutAndHandling(baseLightUrl + colorParam)
        } else {
            const colorParam = 'setColor?color=505656&timer=0'
            fetchWithTimeoutAndHandling(baseLightUrl + colorParam)
        }

    }, [baseUrl])

    // Style
    useEffect(() => {
        // Style
        document.querySelector('.NavBar').style.backgroundColor = `#${user.lightColor}`
    }, [user])

    return <>
        <div id="UIbackground">
            <NavBar history={history} />

            <Switch>
                <MyProtectedRoute exact path={path} component={() =>
                    <>
                        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: '', padding: "50px" }}>
                            {ApplicationList.map((elem, i) => <AppIcon key={'icon-' + i} {...elem} history={history} />)}
                        </div>
                    </>
                } />
                <MyProtectedRoute exact path={`${path}/setting`} component={() => <PersonalSetting baseUrl={baseUrl} user={user} reLoadData={loadData} />} />
                <MyProtectedRoute exact path={`${path}/camera`} component={() => <h1>Camera</h1>} />
                <MyProtectedRoute exact path={`${path}/conference`} component={() => <VideoConferencing />} />
                <MyProtectedRoute exact path={`${path}/control`} component={() => <RelayControl />} />
                <MyProtectedRoute exact path={`${path}/movement`} component={() => <MovementControl />} />
                <MyProtectedRoute exact path={`${path}/music`} component={() => <Music />} />
                <MyProtectedRoute exact path={`${path}/detection`} component={() => <Detection />} />
                <MyProtectedRoute exact path={`${path}/sensor`} component={() => <Sensor />} />
                <MyProtectedRoute exact path={`${path}/question`} component={() => <Question />} />
                <MyProtectedRoute exact path={`${path}/parisAgreement`} component={() => <ParisAgreement />} />
                <MyProtectedRoute exact path={`${path}/airImprovement`} component={() => <AirImprovement />} />
                <MyProtectedRoute exact path={`${path}/airQualityProblem`} component={() => <AirQualityProblem />} />
                <MyProtectedRoute exact path={`${path}/whyTokyoParis`} component={() => <WhyTokyoParis />} />
                <MyProtectedRoute exact path={`${path}/cleanAirAction`} component={() => <CleanAirAction />} />
                <MyProtectedRoute exact path={`${path}/newBlueprint`} component={() => <NewBlueprint />} />
                <MyProtectedRoute exact path={`${path}/sixActions`} component={() => <SixActions />} />
                <MyProtectedRoute exact path={`${path}/greenTransport`} component={() => <GreenTransport />} />
                <MyProtectedRoute exact path={`${path}/liveableEnvironment`} component={() => <LiveableEnvironment />} />
                <MyProtectedRoute exact path={`${path}/comprehensiveEmissionsReduction`} component={() => <ComprehensiveEmissionsReduction />} />
                <MyProtectedRoute exact path={`${path}/cleanEnergy`} component={() => <CleanEnergy />} />
                <MyProtectedRoute exact path={`${path}/scientificManagement`} component={() => <ScientificManagement />} />
                <MyProtectedRoute exact path={`${path}/regionalCollaboration`} component={() => <RegionalCollaboration />} />
                <MyProtectedRoute exact path={`${path}/wantToKnowMore`} component={() => <WantToKnowMore />} />
                <MyProtectedRoute exact path={`${path}/cursor`} component={() => <Cursor />} />
                <MyProtectedRoute path={`${path}/emptyPage/:imagePath?/:audioPath?/:videoPath?`} component={() => <EmptyPage />} />
            </Switch>
        </div>
    </>
}

export default FutureAppUI
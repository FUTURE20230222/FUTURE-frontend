import React, { useContext, useEffect, useState } from 'react';
import {
    Slider,
    Slide,
    CarouselContext
} from 'pure-react-carousel'
import 'pure-react-carousel/dist/react-carousel.es.css';
import './control.css'
import imageSrc from '../../../../src/assets/image/Roborn-logo-01.png'
import imageBoy from '../../../../src/assets/image/eyes g m1_standby.gif'
import imageGirl from '../../../../src/assets/image/future face black.gif'
import imageBigWasterGuy from '../../../../src/assets/image/Big_waster.jpeg'
import videoJokeFace from '../../../../src/assets/image/waste-jokeface.mp4'
import videoBigWaster from '../../../../src/assets/image/BigWaster-final.mp4'
import Auth from '../auth/authCheck'
import FutureAppUI from '../pages/FutureAppUI'
import { height } from '@material-ui/system';
import fetchWithTimeoutAndHandling from '../../../components/common/fetch';
import zIndex from '@material-ui/core/styles/zIndex';
import Cursor from '../pages/cursor';
const defaultUserSettings = [
    {

        "userId": 1,

        "userName": "Jacky",

        "lightColor": "b7cec2",

        "robotFace": 1,

        "token": "13579"

    },

    {

        "userId": 2,

        "userName": "Mary",

        "lightColor": "e11584",

        "robotFace": 2,

        "token": "246810"

    },

    {

        "userId": 3,

        "userName": "NervGear",

        "lightColor": "abcdef",

        "robotFace": 1,

        "token": "183462"

    },

    {

        "userId": 4,

        "userName": "屯馬開通",

        "lightColor": "abcdef",

        "robotFace": 2,

        "token": "97315"

    },
    {
        "userId": 5,
        "userName": "Eric",
        "lightColor": "abcdef",
        "robotFace": 1,
        "token": "12345"
    }

]
const Carousel = ({ isLogin = false, carouselRef }) => {
    const carouselContext = useContext(CarouselContext);
    const [currentSlide, setCurrentSlide] = useState(carouselContext.state.currentSlide);
    const [user, setUser] = useState({ light: 'blue', face: 'boy', robotFace: 'default' })
    const [data, setData] = useState([]);
    const [isClicked, setIsClicked] = useState(false)
    const [source, setSource] = useState('')

    const loadData = () => {
        const localData = localStorage.getItem('data');
        // Initialize data
        if (!localData) {
            const loadData = async () => {
                localStorage.setItem('data', JSON.stringify(defaultUserSettings));
                setData(defaultUserSettings);
            }
            loadData();
        } else {
            setData(JSON.parse(localData));
        }
    }

    useEffect(() => {
        loadData();
    }, [])

    useEffect(() => {
        if (carouselRef === undefined) {
            return;
        }
        carouselRef.current = carouselContext;
    }, [carouselRef])

    useEffect(() => {
        const userToken = sessionStorage.getItem('token')
        if (data) {
            const user = data.filter((elem) => elem.token === userToken)
            if (user.length > 0) {
                setUser(user[0])
            } else {
                setUser({ light: 'default', face: 'default' })
            }
        }
    }, [data])

    return <>
        {!isLogin && <Slider>
            <Slide index={0}><img src={imageSrc}></img></Slide>
            <Slide index={1}><Auth /></Slide>
        </Slider>
        }
        {isLogin && user.robotFace === 1 && <Slider>
            <Slide index={0}>
                <img src={imageBoy}></img>
            </Slide>
            <Slide index={1}><FutureAppUI user={user} loadData={loadData} /></Slide>
        </Slider>}
        {isLogin && user.robotFace === 2 && <Slider>
            <Slide index={0}><img src={imageGirl}></img></Slide>
            <Slide index={1}><FutureAppUI user={user} loadData={loadData} /></Slide>
        </Slider>}
        {isLogin && user.robotFace === 3 && <Slider>
            <Slide index={0}><img style={{ height: '100%', width: 'auto' }} src={imageBigWasterGuy}></img></Slide>
            <Slide index={1}><FutureAppUI user={user} loadData={loadData} /></Slide>
        </Slider>}
        {isLogin && user.robotFace === 4 && <Slider>
            <Slide index={0}><video autoPlay loop muted style={{ width: '100%', height: 'auto' }} src={videoJokeFace}></video></Slide>
            {/* <Slide index={0}><img style={{ height: '100%', width: 'auto' }} src={imageJokeFace}></img></Slide> */}
            <Slide index={1}><FutureAppUI user={user} loadData={loadData} /></Slide>
        </Slider>}
    </>
}

export default Carousel;
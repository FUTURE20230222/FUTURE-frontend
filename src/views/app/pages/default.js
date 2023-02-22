import React, { useEffect } from 'react'
import Carousel from '../care-dashboards/carousel'
import { CarouselProvider } from 'pure-react-carousel'

export const Default = ({ isLogin, carouselRef }) => {
    return (
        <CarouselProvider
            naturalSlideWidth={window.innerWidth}
            naturalSlideHeight={window.innerHeight}
            totalSlides={2}>
            <Carousel isLogin={isLogin} carouselRef={carouselRef} />
        </CarouselProvider>
    )
}

export default Default;
import React, { useEffect, useState, useRef } from 'react'
import { Image, Text, Rect } from 'react-konva';
const MapImage = ({ imageSrc, onload = () => { }, isSelected = false, singleMap = false }) => {
    const [map, setMap] = useState();
    const [imageSize, setImageSize] = useState({ width: 0, height: 0 });

    useEffect(async () => {
        const map_img = new window.Image();
        map_img.src = imageSrc
        map_img.onload = () => {
            setMap(map_img)
            onload()
            setImageSize({ width: map_img.width, height: map_img.height })
        }
    }, [imageSrc])

    return (
        <>
            { map ? <>
                <Image image={map} />
                {isSelected && !singleMap &&
                    <Rect strokeWidth={2} stroke={'black'} width={imageSize.width} height={imageSize.height} />}
            </> : <Text text="Loading map..." />}
        </>
    )
}

export default MapImage;
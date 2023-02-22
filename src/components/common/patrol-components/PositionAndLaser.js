import React from 'react'
import { Arrow, Circle } from 'react-konva';
const defaultPositionResponse = {
    "angle": 45,
    "gridPosition": {
        "x": 186,
        "y": 100
    },
    "mapInfo": {
        "gridHeight": 608,
        "gridWidth": 512,
        "originX": -3.3500000000000001,
        "originY": -3.7371307373046876,
        "resolution": 0.05000000074505806
    }
}
const defaultLaserResponse = {
    "gridPhits": [
        {
            "x": 170,
            "y": -30
        },
        {
            "x": 184,
            "y": 39
        },
        {
            "x": 184,
            "y": 40
        }
    ]
}
const PositionAndLaser = ({ position = null, laser = null }) => {
    const getArrow = (position) => {
        if (position) {
            return [-10 * Math.cos(position.angle / 180 * Math.PI), 10 * Math.sin(position.angle / 180 * Math.PI), 0, 0]
        }
    }
    return (
        <>
            {position && position.gridPosition && <Arrow
                x={position.gridPosition.x}
                y={position.gridPosition.y}
                points={getArrow(position)}
                pointerLength={12}
                pointerWidth={8}
                fill='#DC143C'
            />}
            {laser && laser.gridPhits.map((point, i) => {
                return (<Circle
                    key={'laser_' + i}
                    x={point.x}
                    y={point.y}
                    radius={1}
                    fill="red"
                />)
            })}

        </>
    )
}

export default PositionAndLaser;